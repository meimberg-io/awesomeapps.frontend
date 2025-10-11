# Quick Reference Card

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```
→ http://localhost:3000

### Docker Dev
```bash
cp env.example .env
docker-compose --profile dev up --build
```
→ http://localhost:8203

### Docker Prod
```bash
docker-compose --profile prod up -d --build
```
→ Port 5680

## 📊 Ports

| Mode | Port | URL |
|------|------|-----|
| npm dev | 3000 | http://localhost:3000 |
| Docker dev | 8203 | http://localhost:8203 |
| Docker prod | 5680 | http://localhost:5680 |
| Strapi Backend | 8202 | http://localhost:8202 |

## 🔧 Required Environment Variables

**All required:**
```env
NEXT_PUBLIC_STRAPI_BASEURL=http://localhost:8202
NEXT_PUBLIC_APP_BASEURL=http://localhost:8203  
REVALIDATE_SECRET=your-random-secret-token
```

**Optional:**
```env
NEXT_PUBLIC_MATOMO_TRACKER=false
APP_PORT=8203
```

**⚠️ Important:** `NEXT_PUBLIC_*` vars are build-time - change requires rebuild!

## 🐳 Docker

```bash
# Dev
docker-compose --profile dev up -d --build
docker-compose --profile dev logs -f
docker-compose --profile dev down

# Prod
docker-compose --profile prod up -d --build
docker-compose --profile prod logs -f
docker-compose --profile prod down

# Clean rebuild
docker-compose build --no-cache
docker system prune -a
```

## 📦 PM2 (Production Server)

```bash
# Start
pm2 start npm --name awesomeapps-frontend -- run start
pm2 save
pm2 startup  # Run once

# Daily use
pm2 restart awesomeapps-frontend
pm2 logs awesomeapps-frontend
pm2 monit
pm2 status
```

## 🔄 Deploy/Update

```bash
cd /srv/awesomeapps-frontend/app
git pull
npm install
npm run build
pm2 restart awesomeapps-frontend
```

**⚠️ If env vars changed:** Rebuild Docker or restart after npm build

## ✅ Health Check

```bash
# Frontend
curl http://localhost:5680/

# Strapi
curl http://localhost:8202/_health
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | `netstat -tuln \| grep PORT` or change `APP_PORT` |
| Can't connect to Strapi | Check Strapi runs on 8202, CORS configured |
| Docker build fails | `docker system prune -a` then rebuild |
| Changes not showing | Rebuild required if `NEXT_PUBLIC_*` vars changed |
| Build errors | Run `npm run lint` and `npx tsc --noEmit` |

## 🔐 Production Checklist

- [ ] Strong random `REVALIDATE_SECRET`
- [ ] Correct `NEXT_PUBLIC_STRAPI_BASEURL` (production URL)
- [ ] Correct `NEXT_PUBLIC_APP_BASEURL` (production URL)
- [ ] `.env` never committed to git
- [ ] HTTPS enabled (Nginx + Let's Encrypt)
- [ ] Strapi CORS configured for frontend URL
- [ ] Firewall: Only 80, 443, 22 exposed
- [ ] App runs as non-root user

## 📚 More Docs

- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
- [DOCKER.md](DOCKER.md) - Docker details

