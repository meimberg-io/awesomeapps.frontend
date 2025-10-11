# Pre-Deployment Checklist

Use this checklist before deploying to production.

## Required Information

Prepare these values before deployment:

### 1. URLs

| Variable | Value | Example |
|----------|-------|---------|
| **Frontend Domain** | Your website URL | `https://awesomeapps.com` |
| **Backend API Domain** | Your Strapi URL | `https://api.awesomeapps.com` |

### 2. Secrets

| Variable | How to Generate | Example |
|----------|-----------------|---------|
| **REVALIDATE_SECRET** | Random token | Use: `openssl rand -hex 32` |

### 3. Server Access

- [ ] SSH access to production server
- [ ] Root or sudo access for setup
- [ ] Domain DNS pointed to server IP

## Environment Configuration

Create `.env` file with:

```env
# Production URLs (HTTPS!)
NEXT_PUBLIC_STRAPI_BASEURL=https://api.yourdomain.com
NEXT_PUBLIC_APP_BASEURL=https://yourdomain.com

# Strong random secret
REVALIDATE_SECRET=<generated-random-token>

# Optional
NEXT_PUBLIC_MATOMO_TRACKER=true
NODE_ENV=production
APP_PORT=5680
```

## Backend Configuration (Strapi)

Strapi must be configured to allow requests from your frontend:

1. **CORS Configuration** in Strapi:
   - Add your frontend URL: `https://yourdomain.com`
   - Include protocol and domain (no trailing slash)

2. **Verify Strapi is accessible:**
   ```bash
   curl https://api.yourdomain.com/_health
   ```

## Build Test (Local)

Before deploying, test the build locally:

```bash
# Use production URLs in .env
cp env.example .env
vim .env  # Add production values

# Test build
npm run build

# Test production mode
npm run start
# Visit http://localhost:5680
```

Build should complete without errors:
- ✅ TypeScript type checking
- ✅ ESLint linting
- ✅ Next.js build

## Deployment Checklist

### Pre-Deployment

- [ ] Production `.env` file ready with correct values
- [ ] Strapi backend running and accessible
- [ ] Strapi CORS configured for frontend domain
- [ ] Domain DNS configured
- [ ] SSL certificate ready (or use Let's Encrypt)
- [ ] Build tested locally with production URLs

### Server Setup

- [ ] Node.js 20 installed (via NVM)
- [ ] PM2 installed globally
- [ ] Application user created (non-root)
- [ ] Application directory created
- [ ] SSH keys configured
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Application built (`npm run build`)
- [ ] PM2 process started
- [ ] PM2 configured to start on boot

### Nginx Setup

- [ ] Nginx installed
- [ ] Site configuration created
- [ ] Site enabled in Nginx
- [ ] Nginx configuration tested (`nginx -t`)
- [ ] Nginx reloaded
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] HTTPS working

### Post-Deployment

- [ ] Frontend accessible via HTTPS
- [ ] Can fetch data from Strapi
- [ ] No console errors in browser
- [ ] PM2 shows process running: `pm2 status`
- [ ] Logs show no errors: `pm2 logs`
- [ ] Test all main pages work
- [ ] Test service detail pages work
- [ ] Test tag filtering works

## Security Checklist

- [ ] `.env` file NOT in git repository
- [ ] Strong random `REVALIDATE_SECRET` (32+ chars)
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Firewall configured (only 22, 80, 443 open)
- [ ] Application runs as non-root user
- [ ] SSH key-only authentication (no passwords)
- [ ] Strapi API secured with authentication
- [ ] Regular security updates enabled

## Monitoring Setup

- [ ] PM2 monitoring: `pm2 monit`
- [ ] Server monitoring (htop, etc.)
- [ ] Log rotation configured
- [ ] Backup strategy in place
- [ ] Health check endpoint working

## Quick Test Commands

After deployment, verify:

```bash
# Frontend alive
curl https://yourdomain.com/

# Can reach backend
curl https://api.yourdomain.com/_health

# PM2 status
pm2 status

# Check logs
pm2 logs awesomeapps-frontend --lines 50

# Monitor
pm2 monit
```

## Common Issues

### Build Fails

**Check:**
- TypeScript errors: `npx tsc --noEmit`
- Linting errors: `npm run lint`
- Dependencies: `rm -rf node_modules && npm install`

### Can't Connect to Backend

**Check:**
- Strapi is running
- CORS is configured in Strapi
- URLs in `.env` are correct
- Firewall allows connections
- DNS is configured correctly

### Changes Not Showing

**Remember:**
- `NEXT_PUBLIC_*` vars require rebuild!
- Clear browser cache
- Check PM2 logs
- Verify Nginx is serving correctly

## Need Help?

See full documentation:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Command reference
- [README.md](../README.md) - Project overview

