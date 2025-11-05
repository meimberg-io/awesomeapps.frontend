# Docker Setup

## Quick Start

```bash
# Configure environment
cp env.example .env

# Start development
docker-compose up
```

Visit http://localhost:8204

## Configuration

Edit `.env`:
```env
NODE_ENV=development
APP_PORT=8204
NEXT_PUBLIC_STRAPI_BASEURL=http://host.docker.internal:1337
NEXT_PUBLIC_APP_BASEURL=http://localhost:8204
NEXT_PUBLIC_MATOMO_TRACKER=false
REVALIDATE_SECRET=your-secret-token
AUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:8204
```

**Note:** Use `host.docker.internal` to access services on your host from inside Docker.

## Commands

```bash
# Start
docker-compose up

# Start with rebuild
docker-compose up --build

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Container status
docker-compose ps

# Shell access
docker-compose exec app-dev sh
```

## Profiles

```bash
docker-compose up                    # Development (default)
docker-compose --profile prod up     # Production
```

## Ports

- **Host**: 8204 (configurable via `APP_PORT`)
- **Container**: 5680 (internal)

## Build Args

`NEXT_PUBLIC_*` variables are injected **at build time**:

1. docker-compose.yml reads `.env` and passes as build args
2. Dockerfile receives them via `ARG` and converts to `ENV`
3. `npm run build` pre-renders pages with real data from Strapi
4. Result: Static pages with embedded data

**Important:** Changing `NEXT_PUBLIC_*` requires rebuild.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Change `APP_PORT` in `.env` |
| Build fails | Check `.env` exists, rebuild: `docker-compose build --no-cache` |
| Changes not visible | Using dev profile? Check hot reload is working |
| Can't reach Strapi | Use `host.docker.internal:1337`, not `localhost:1337` |
| .env changes ignored | Rebuild: `docker-compose up --build` |
