# Deployment Guide

Simple production deployment guide for AwesomeApps Frontend.

## Prerequisites

- Ubuntu/Debian server with SSH access
- Domain name pointed to your server
- Strapi backend running (port 8202)

## Required Environment Variables

Before deployment, prepare these values:

### Essential Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_STRAPI_BASEURL` | `https://api.yourdomain.com` | Strapi backend URL (public) |
| `NEXT_PUBLIC_APP_BASEURL` | `https://yourdomain.com` | Frontend URL (public) |
| `REVALIDATE_SECRET` | `random-token-xyz` | Secret for cache revalidation API |
| `AUTH_SECRET` | `base64-string` | NextAuth.js session encryption secret |
| `NEXTAUTH_URL` | `https://yourdomain.com` | Frontend URL for NextAuth.js |

### Optional Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_MATOMO_TRACKER` | `true` or `false` | Enable/disable analytics |
| `OAUTH_GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | Google OAuth Client ID |
| `OAUTH_GOOGLE_CLIENT_SECRET` | `GOCSPX-xxx` | Google OAuth Client Secret |
| `OAUTH_GITHUB_CLIENT_ID` | `Ov23xxx` | GitHub OAuth Client ID |
| `OAUTH_GITHUB_CLIENT_SECRET` | `xxx` | GitHub OAuth Client Secret |
| `OAUTH_AZURE_AD_CLIENT_ID` | `guid` | Azure AD Client ID |
| `OAUTH_AZURE_AD_CLIENT_SECRET` | `xxx` | Azure AD Client Secret |
| `OAUTH_AZURE_AD_TENANT_ID` | `guid` | Azure AD Tenant ID |

**⚠️ Important:** `NEXT_PUBLIC_*` variables are embedded during build - changing them requires rebuild!

## Quick Setup

### 1. Create User & Directory

```bash
# As root
mkdir /srv/awesomeapps-frontend
useradd -d /srv/awesomeapps-frontend -s /bin/bash awesomeapps
chown -R awesomeapps:awesomeapps /srv/awesomeapps-frontend
su - awesomeapps
```

### 2. Setup SSH Keys

```bash
# As user awesomeapps
mkdir .ssh && chmod 700 .ssh
touch .ssh/authorized_keys && chmod 600 .ssh/authorized_keys
# Add your SSH public key to authorized_keys
```

### 3. Install Node.js

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20
node --version  # Verify

# Install PM2
npm install pm2 -g
```

### 4. Clone & Setup Application

```bash
# Clone repository
git clone https://YOUR_TOKEN@github.com/YOUR_ORG/awesomeapps.frontend /srv/awesomeapps-frontend/app

cd /srv/awesomeapps-frontend/app

# Create environment file
cp env.example .env
vim .env
```

**Configure `.env`:**
```env
NODE_ENV=production
APP_PORT=5680

# ⚠️ Use production URLs!
NEXT_PUBLIC_STRAPI_BASEURL=https://api.yourdomain.com
NEXT_PUBLIC_APP_BASEURL=https://yourdomain.com

# Generate strong random tokens
REVALIDATE_SECRET=your-strong-random-token-here
AUTH_SECRET=your-nextauth-secret-here  # Generate: openssl rand -base64 32
NEXTAUTH_URL=https://yourdomain.com

# Optional - OAuth Providers (for login functionality)
OAUTH_GOOGLE_CLIENT_ID=your-google-client-id
OAUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret
OAUTH_GITHUB_CLIENT_ID=your-github-client-id
OAUTH_GITHUB_CLIENT_SECRET=your-github-client-secret
OAUTH_AZURE_AD_CLIENT_ID=your-azure-client-id
OAUTH_AZURE_AD_CLIENT_SECRET=your-azure-client-secret
OAUTH_AZURE_AD_TENANT_ID=your-azure-tenant-id

# Optional - Analytics
NEXT_PUBLIC_MATOMO_TRACKER=true
```

### 5. Build Application

```bash
npm install
npm run build
```

**Note:** Build runs:
- TypeScript type checking
- ESLint linting  
- Next.js production build

Any errors here will fail the build!

### 6. Start with PM2

```bash
pm2 start npm --name awesomeapps-frontend -- run start
pm2 save
pm2 startup  # Follow the instructions shown
```

**Verify it's running:**
```bash
pm2 status
curl http://localhost:5680/
```

## Nginx Configuration

### Create Nginx Config

```bash
# As root
vim /etc/nginx/sites-available/awesomeapps-frontend
```

```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5680;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:5680;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
}
```

### Enable Site

```bash
ln -s /etc/nginx/sites-available/awesomeapps-frontend /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Setup SSL

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Follow prompts to get SSL certificate
```

## Updates & Redeployment

### Standard Update

```bash
cd /srv/awesomeapps-frontend/app
git pull
npm install
npm run build
pm2 restart awesomeapps-frontend
```

### After Environment Variable Change

If you changed `NEXT_PUBLIC_*` variables:

```bash
cd /srv/awesomeapps-frontend/app
vim .env  # Update variables
npm run build  # Rebuild required!
pm2 restart awesomeapps-frontend
```

### Quick Check

```bash
pm2 status
pm2 logs awesomeapps-frontend --lines 50
curl https://yourdomain.com/
```

## PM2 Commands

```bash
pm2 status                        # Check status
pm2 logs awesomeapps-frontend     # View logs
pm2 monit                         # Monitor
pm2 restart awesomeapps-frontend  # Restart
pm2 stop awesomeapps-frontend     # Stop
```

## Troubleshooting

### Build Fails

```bash
# Check for linting errors
npm run lint

# Check for TypeScript errors
npx tsc --noEmit

# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### App Won't Start

```bash
# Check port availability
netstat -tuln | grep 5680

# Check PM2 errors
pm2 logs awesomeapps-frontend --err

# Check environment
cat .env
```

### Can't Connect to Backend

1. Verify Strapi is running: `curl http://localhost:8202/_health`
2. Check CORS in Strapi config includes your frontend URL
3. Check firewall rules
4. Verify `NEXT_PUBLIC_STRAPI_BASEURL` in `.env`

### Changes Not Showing

1. If you changed `NEXT_PUBLIC_*` vars → rebuild required
2. Clear browser cache
3. Check PM2 logs for errors
4. Verify Nginx is proxying correctly

## Security Checklist

- [ ] Strong random `REVALIDATE_SECRET` token
- [ ] Strong random `AUTH_SECRET` token (generated with openssl)
- [ ] Production URLs in `NEXT_PUBLIC_*` variables
- [ ] Production `NEXTAUTH_URL` matches frontend domain
- [ ] OAuth redirect URIs configured for production domains
- [ ] `.env` file never committed to git
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Firewall configured (only ports 22, 80, 443)
- [ ] Application runs as non-root user
- [ ] SSH key-only authentication
- [ ] Strapi CORS configured for frontend domain
- [ ] Regular security updates (`apt update && apt upgrade`)

## Monitoring

### Health Check

```bash
# Frontend
curl https://yourdomain.com/

# PM2 Status
pm2 status
pm2 monit

# Resource usage
htop
```

### Logs

```bash
# PM2 logs
pm2 logs awesomeapps-frontend --lines 100

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Backup

Backup these files regularly:

```bash
# Environment config
cp .env /backup/env.backup

# PM2 config
pm2 save
```

## Need Help?

See [QUICK-REFERENCE.md](QUICK-REFERENCE.md) for quick command reference.
