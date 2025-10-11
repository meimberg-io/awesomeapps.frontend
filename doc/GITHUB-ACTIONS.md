# GitHub Actions Setup

## Workflow Overview

The deployment workflow automatically:
1. **Tests** the code (lint + build)
2. **Deploys** to server using Docker
3. **Verifies** the deployment

## Required GitHub Secrets & Variables

### Secrets (Repository Settings → Secrets and variables → Actions → Secrets)

| Secret | Description | Example |
|--------|-------------|---------|
| `SSH_PRIVATE_KEY` | SSH private key for deployment | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `REVALIDATE_SECRET` | Next.js revalidation token | `your-secret-token-123` |

### Variables (Repository Settings → Secrets and variables → Actions → Variables)

| Variable | Description | Example |
|----------|-------------|---------|
| `HOST` | Server hostname/IP | `awesomeapps.example.com` or `123.45.67.89` |
| `USERNAME` | SSH username (optional, defaults to `deploy`) | `deploy` or `awesomeapps` |
| `APP_PORT` | Host port for the application | `8203` |
| `NEXT_PUBLIC_STRAPI_BASEURL` | Strapi API URL | `http://localhost:8202` or `https://api.example.com` |
| `NEXT_PUBLIC_APP_BASEURL` | Frontend URL | `https://awesomeapps.example.com` |
| `NEXT_PUBLIC_MATOMO_TRACKER` | Enable Matomo (optional) | `true` or `false` |

## Deployment Flow

```
Push to master/main
    ↓
Run tests (lint + build with production env vars)
    ↓
SSH to server
    ↓
Create .env file with secrets
    ↓
Deploy files to /opt/awesomeapps-frontend
    ↓
docker-compose --profile prod up -d --build
    ↓
Verify deployment (HTTP check)
    ↓
✅ Success or ❌ Fail
```

## Manual Trigger

GitHub Actions can be manually triggered:

1. Go to: **Actions** tab in GitHub
2. Select: **Deploy AwesomeApps Frontend to Server**
3. Click: **Run workflow**
4. Select branch and run

**Note:** For manual deployment, use PM2 method (see DEPLOYMENT.md)

## Deployment Location

- **Server Path**: `/opt/awesomeapps-frontend`
- **Container Name**: `awesomeapps-frontend-app-prod-1`
- **Port**: Internal 5680 → External as configured in `APP_PORT`

## Troubleshooting

### Check Deployment Status
```bash
ssh user@server
cd /opt/awesomeapps-frontend
docker-compose --profile prod ps
docker-compose --profile prod logs
```

### Failed Deployment
1. Check GitHub Actions logs for error details
2. Verify all secrets/variables are set correctly  
3. Ensure SSH key has access to the server
4. Check server disk space: `df -h`
5. Check Docker status: `docker ps`

### Manual Redeploy
```bash
ssh user@server
cd /opt/awesomeapps-frontend
docker-compose --profile prod down
docker-compose --profile prod up -d --build
```

## Notes

- Tests run on every push (includes TypeScript + ESLint)
- Deploy only runs on main/master branch
- Build uses production environment variables
- Docker images are pruned after deployment to save space

