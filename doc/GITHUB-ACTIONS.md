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
| `HOST` | Server hostname/IP | `serviceatlas.example.com` or `123.45.67.89` |
| `USERNAME` | SSH username (optional, defaults to `deploy`) | `deploy` or `serviceatlas` |
| `APP_PORT` | Host port for the application | `8203` |
| `NEXT_PUBLIC_STRAPI_BASEURL` | Strapi API URL | `http://localhost:8202` or `https://api.example.com` |
| `NEXT_PUBLIC_APP_BASEURL` | Frontend URL | `https://serviceatlas.example.com` |
| `NEXT_PUBLIC_MATOMO_TRACKER` | Enable Matomo (optional) | `true` or `false` |

## Deployment Flow

```
Push to master/main
    ↓
Run tests (lint + build)
    ↓
SSH to server
    ↓
Create /opt/serviceatlas-frontend/
    ↓
Generate .env file
    ↓
Clone repository
    ↓
docker-compose --profile prod up -d --build
    ↓
Verify deployment (HTTP check)
    ↓
✅ Success or ❌ Fail
```

## Manual Trigger

To manually trigger deployment without pushing:

1. Go to: **Actions** tab in GitHub
2. Select: **Deploy ServiceAtlas Frontend to Server**
3. Click: **Run workflow**
4. Select branch and run

## Deployment Location

- **Server Path**: `/opt/serviceatlas-frontend/`
- **Container Name**: `serviceatlas-frontend-app-prod-1`
- **Port**: As configured in `APP_PORT` variable

## Troubleshooting

### Check Deployment Status
```bash
ssh user@server
cd /opt/serviceatlas-frontend
docker-compose --profile prod ps
docker-compose --profile prod logs
```

### Failed Deployment
1. Check GitHub Actions logs for error details
2. Verify all secrets/variables are set correctly
3. Ensure SSH key has access to the server
4. Check server disk space and Docker status

### Manual Redeploy
```bash
ssh user@server
cd /opt/serviceatlas-frontend
docker-compose --profile prod down
docker-compose --profile prod up -d --build
```

