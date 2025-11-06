# Deployment

Automatic deployment on push to `main` via GitHub Actions.

## Deploy

```bash
git push origin main
```

Watch: https://github.com/meimberg-io/awesomeapps.frontend/actions

**Duration:** ~3-4 minutes

## How It Works

1. Checkout code
2. Build Docker image with build args
3. Push to GitHub Container Registry
4. Copy `docker-compose.prod.yml` to server
5. SSH to server and run `envsubst` to substitute variables
6. Pull image and restart container

**File:** `.github/workflows/deploy.yml`
**Template:** `docker-compose.prod.yml` (uses `${PROJECT_NAME}`, `${DOCKER_IMAGE}`, `${APP_DOMAIN}`)

## Initial Setup

**First time?** See [GITHUB-SETUP.md](GITHUB-SETUP.md) for:
- GitHub Secrets/Variables
- DNS configuration
- SSH keys
- Server setup

## Operations

**View logs:**
```bash
ssh -i ~/.ssh/oli_key root@hc-02.meimberg.io "docker logs awesomeapps-frontend -f"
```

**Restart:**
```bash
ssh -i ~/.ssh/oli_key root@hc-02.meimberg.io "cd /srv/projects/awesomeapps-frontend && docker compose restart"
```

**Manual deploy:**
```bash
ssh -i ~/.ssh/oli_key root@hc-02.meimberg.io "cd /srv/projects/awesomeapps-frontend && docker compose pull && docker compose up -d"
```

## Troubleshooting

**Container logs:**
```bash
ssh -i ~/.ssh/oli_key root@hc-02.meimberg.io "docker logs awesomeapps-frontend --tail 100"
```

**Traefik routing:**
```bash
ssh -i ~/.ssh/oli_key root@hc-02.meimberg.io "docker logs traefik --tail 50"
```

**Check running containers:**
```bash
ssh -i ~/.ssh/oli_key root@hc-02.meimberg.io "docker ps"
```

**DNS:**
```bash
dig awesomeapps-frontend.meimberg.io +short
```

**Test direct access:**
```bash
curl -I https://awesomeapps-frontend.meimberg.io/
```

## Configuration

**Environment Variables (GitHub Secrets):**
- `SSH_PRIVATE_KEY` - SSH key for server access
- `REVALIDATE_SECRET` - Next.js revalidation secret

**Environment Variables (GitHub Variables):**
- `SERVER_HOST` - Server hostname (hc-02.meimberg.io)
- `APP_DOMAIN` - Application domain
- `NEXT_PUBLIC_STRAPI_BASEURL` - Strapi API URL
- `NEXT_PUBLIC_APP_BASEURL` - Frontend base URL
- `NEXT_PUBLIC_MATOMO_TRACKER` - Matomo tracking (optional)
- `ADMIN_EMAILS` - Admin email whitelist (comma-separated, optional, defaults to `oli@meimberg.io`)

**Runtime Environment Variables (set in `.env` on server):**
- `ADMIN_EMAILS` - Admin email whitelist (comma-separated, optional, defaults to `oli@meimberg.io`)

## Build Args

The following are passed as Docker build arguments:
- `NEXT_PUBLIC_STRAPI_BASEURL` - Baked into client bundle
- `NEXT_PUBLIC_APP_BASEURL` - Baked into client bundle
- `NEXT_PUBLIC_MATOMO_TRACKER` - Baked into client bundle

## Server Access

**SSH Key:** `~/.ssh/oli_key`

```bash
ssh -i ~/.ssh/oli_key root@hc-02.meimberg.io
```

**Project Directory:** `/srv/projects/awesomeapps-frontend/`
