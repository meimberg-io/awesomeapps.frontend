# Docker Setup

## Quick Start

```bash
# 1. Configure environment
cp env.example .env

# 2. Start development
docker-compose --profile dev up -d --build

# 3. Access at http://localhost:8203
```

## Configuration

Edit `.env`:
```env
NODE_ENV=development
APP_PORT=8203
NEXT_PUBLIC_STRAPI_BASEURL=http://host.docker.internal:8202
NEXT_PUBLIC_APP_BASEURL=http://localhost:8203
NEXT_PUBLIC_MATOMO_TRACKER=false
REVALIDATE_SECRET=your-secret-token-here
```

**Note:** Use `host.docker.internal` to access services on your host from inside Docker containers.

## Commands

### Development
```bash
# Start with hot-reload
docker-compose --profile dev up -d --build

# View logs
docker-compose --profile dev logs -f

# Stop
docker-compose --profile dev down
```

### Production
```bash
# Start optimized build
docker-compose --profile prod up -d --build

# View logs
docker-compose --profile prod logs -f

# Stop
docker-compose --profile prod down
```

### Utilities
```bash
# Container status
docker-compose ps

# Rebuild without cache
docker-compose build --no-cache

# Shell access
docker-compose exec app-dev sh

# Clear everything
docker system prune -a
```

## Ports

- **Host**: 8203 (configured via `APP_PORT`)
- **Container**: 5680 (internal)

## How Build Args Work

The `NEXT_PUBLIC_*` variables are injected **at build time** using Docker build arguments:

1. docker-compose.yml reads `.env` and passes values as build args
2. Dockerfile receives them via `ARG` and converts to `ENV`
3. `npm run build` can now fetch from Strapi during static page generation
4. Result: Pre-rendered pages with real data

See [BUILD-ARGS-EXPLAINED.md](BUILD-ARGS-EXPLAINED.md) for details.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port already in use | Change `APP_PORT` in `.env` or stop other service |
| Build fails | Check `.env` exists, Strapi is running, clear cache: `docker system prune -a` |
| Changes not reflected | Ensure using `dev` profile, check volume mounts: `docker-compose config` |
| Can't connect to Strapi | Use `host.docker.internal:8202`, not `localhost:8202` |
| .env changes ignored | Rebuild: `docker-compose --profile dev up --build` |

## Network

Services use the `app-network` bridge, allowing communication with other Docker services (like Strapi backend).
