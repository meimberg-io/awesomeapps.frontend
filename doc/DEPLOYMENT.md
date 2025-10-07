# Deployment Guide for ServiceAtlas Frontend

This guide explains how to deploy the ServiceAtlas frontend application to a production server.

## Server Setup

### 1. Create User and Home Directory

```bash
# As root
mkdir /srv/serviceatlas-frontend
useradd -d /srv/serviceatlas-frontend -s /bin/bash serviceatlas
chown -R serviceatlas:serviceatlas /srv/serviceatlas-frontend
su - serviceatlas
```

### 2. Setup SSH Access

```bash
# As user serviceatlas
cd ~
mkdir .ssh && chmod 700 .ssh
touch .ssh/authorized_keys && chmod 600 .ssh/authorized_keys
vim .ssh/authorized_keys   # Add your SSH public keys
```

## Node.js Installation

### Install NVM and Node.js

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc
```

### Configure .profile

```bash
vim ~/.profile
```

Add the following:
```bash
if [ -f ~/.bashrc ]; then
    . ~/.bashrc
fi
```

### Install Node and PM2

```bash
source ~/.bashrc
nvm install 20
nvm use 20
npm install pm2 -g
```

## Application Installation

### Clone Repository

```bash
# As user serviceatlas
git clone https://___token___@github.com/YOUR_ORG/serviceatlas.frontend /srv/serviceatlas-frontend/app

cd /srv/serviceatlas-frontend/app
```

### Configure Environment

```bash
cp env.example .env
vim .env
```

Update with production values:
```env
NODE_ENV=production
APP_PORT=5680
NEXT_PUBLIC_STRAPI_BASEURL=http://localhost:8202
NEXT_PUBLIC_APP_BASEURL=http://localhost:5680
NEXT_PUBLIC_MATOMO_TRACKER=true
REVALIDATE_SECRET=your-production-secret-token
```

**Note:** In production, if using a reverse proxy (Nginx), the `NEXT_PUBLIC_STRAPI_BASEURL` should point to your Strapi backend URL (e.g., `https://api.serviceatlas.example.com` or `http://localhost:8202` for local backend).

### Install and Build

```bash
npm install
npm run build
```

## Nginx Configuration

### Create Site Configuration

```bash
# As root
vim /etc/nginx/sites-available/serviceatlas-frontend
```

Add the following configuration:
```nginx
server {
    server_name serviceatlas.example.com;

    # Next.js Application
    location / {
        proxy_pass http://localhost:5680;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Gzip compression for better performance
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
        gzip_min_length 1000;
    }

    # Next.js static files with caching
    location /_next/static {
        proxy_pass http://localhost:5680;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # Public files with caching
    location /public {
        proxy_pass http://localhost:5680;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public";
    }
}

server {
    listen 80;
    server_name serviceatlas.example.com;
}
```

### Enable Site

```bash
cd /etc/nginx/sites-enabled
ln -s ../sites-available/serviceatlas-frontend .
nginx -t
systemctl reload nginx
```

### Setup SSL with Let's Encrypt

```bash
certbot --nginx -d serviceatlas.example.com
# Enter email address and accept terms
```

## Application Management

### Start Application

```bash
# As user serviceatlas
cd /srv/serviceatlas-frontend/app
pm2 start npm --name serviceatlas-frontend -- run start
pm2 save
pm2 startup  # Follow the instructions shown
```

### Useful PM2 Commands

```bash
# View logs
pm2 logs serviceatlas-frontend

# Monitor
pm2 monit

# Restart
pm2 restart serviceatlas-frontend

# Stop
pm2 stop serviceatlas-frontend

# Status
pm2 status
```

## Update/Redeploy

### Manual Update

```bash
# As user serviceatlas
cd /srv/serviceatlas-frontend/app
git pull
rm -rf .next
npm install
npm run build
pm2 restart serviceatlas-frontend
```

### Automated Deployment (Optional)

You can set up GitHub Actions or a webhook to automate deployments. Example webhook endpoint:

```bash
# Create a simple deployment script
vim ~/deploy.sh
```

```bash
#!/bin/bash
cd /srv/serviceatlas-frontend/app
git pull
npm install
npm run build
pm2 restart serviceatlas-frontend
```

```bash
chmod +x ~/deploy.sh
```

## Monitoring

### Check Application Health

```bash
curl http://localhost:5680/
```

### Check Logs

```bash
pm2 logs serviceatlas-frontend --lines 100
```

### Monitor Performance

```bash
pm2 monit
```

## Troubleshooting

### Application won't start:
1. Check if port 5680 is available: `netstat -tuln | grep 5680`
2. Verify environment variables: `cat .env`
3. Check build errors: `npm run build`
4. Review PM2 logs: `pm2 logs serviceatlas-frontend --err`

### High memory usage:
1. Check Next.js cache: `du -sh .next`
2. Review PM2 memory: `pm2 monit`
3. Consider increasing server resources

### Nginx errors:
1. Test configuration: `nginx -t`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Verify proxy_pass target: `curl http://localhost:5680`

## Backup

### Important files to backup:
- `.env` - Environment configuration
- `public/uploads/` - If storing uploads locally
- PM2 configuration: `~/.pm2/`

```bash
# Example backup command
tar -czf backup-$(date +%Y%m%d).tar.gz .env public/uploads/
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` to git
2. **REVALIDATE_SECRET**: Use a strong, random token
3. **Firewall**: Only expose necessary ports (80, 443, 22)
4. **Updates**: Keep Node.js, npm, and dependencies updated
5. **SSL**: Always use HTTPS in production (Let's Encrypt)
6. **User Permissions**: Run application as non-root user

## Performance Optimization

1. **Enable caching** in Nginx for static files
2. **Use CDN** for static assets if available
3. **Enable gzip compression** (already in config)
4. **Monitor** with tools like PM2, htop, or external monitoring services
5. **Database connection pooling** if using a database

