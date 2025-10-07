# Quick Reference Card

## 🚀 Quick Start Commands

### Development (Standard)
```bash
npm install
npm run dev
```
→ Visit http://localhost:3000

### Development (Docker)
```bash
cp env.example .env
docker-compose --profile dev up --build
```
→ Visit http://localhost:8203

### Production (Docker)
```bash
docker-compose --profile prod up -d --build
```
→ Application runs on port 5680

## 📊 Port Configuration

| Service | Environment | Port | URL |
|---------|-------------|------|-----|
| **Frontend** | npm dev | 3000 | http://localhost:3000 |
| **Frontend** | Docker dev | 8203 | http://localhost:8203 |
| **Frontend** | Docker prod | 5680 | http://localhost:5680 |
| **Strapi** | Local/Docker | 8202 | http://localhost:8202 |

## 🔧 Environment Variables

```env
# Local Development
APP_PORT=8203
NEXT_PUBLIC_STRAPI_BASEURL=http://localhost:8202
NEXT_PUBLIC_APP_BASEURL=http://localhost:8203
REVALIDATE_SECRET=your-secret-token-here
```

## 🐳 Docker Commands

```bash
# Development
docker-compose --profile dev up -d --build     # Start
docker-compose --profile dev down              # Stop
docker-compose --profile dev logs -f           # View logs

# Production
docker-compose --profile prod up -d --build    # Start
docker-compose --profile prod down             # Stop
docker-compose --profile prod logs -f          # View logs

# Rebuild from scratch
docker-compose build --no-cache
docker system prune -a  # Clean all Docker cache
```

## 📦 PM2 Commands (Production Server)

```bash
# Start
pm2 start npm --name serviceatlas-frontend -- run start

# Manage
pm2 restart serviceatlas-frontend
pm2 stop serviceatlas-frontend
pm2 logs serviceatlas-frontend
pm2 monit

# Save & Persist
pm2 save
pm2 startup
```

## 🔄 Deploy/Update

```bash
# Quick update
git pull && rm -rf .next && npm run build && pm2 restart serviceatlas-frontend

# Full rebuild
git pull && rm -rf node_modules .next && npm install && npm run build && pm2 restart serviceatlas-frontend
```

## ✅ Health Checks

```bash
# Frontend alive?
curl http://localhost:8203/

# Strapi alive?
curl http://localhost:8202/_health

# GraphQL working?
curl -X POST http://localhost:8202/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Port already in use | `netstat -tuln \| grep 8203` or change `APP_PORT` |
| CORS errors | Check Strapi CORS config includes frontend URL |
| Can't connect to Strapi | Verify Strapi is running on port 8202 |
| Docker build fails | `docker system prune -a` then rebuild |
| Changes not reflected | Use `--profile dev` for hot-reload |

## 📚 Documentation Links

- [Docker Setup](DOCKER.md)
- [Deployment Guide](DEPLOYMENT.md)  
- [Integration Guide](INTEGRATION.md)

## 🔐 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Strong `REVALIDATE_SECRET` set
- [ ] CORS properly configured in Strapi
- [ ] HTTPS enabled in production
- [ ] Firewall rules configured
- [ ] Non-root user for deployment

## 📞 Support

For detailed information, see the full documentation:
- Docker: `doc/DOCKER.md`
- Deployment: `doc/DEPLOYMENT.md`
- Integration: `doc/INTEGRATION.md`

