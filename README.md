# ServiceAtlas Frontend

Next.js frontend application for ServiceAtlas platform.

## Quick Start

### Local Development (Standard)

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### Local Development (Docker)

```bash
# Copy environment file
cp env.example .env

# Edit .env with your settings

# Start with Docker
docker-compose --profile dev up --build
```

Visit `http://localhost:8203` (or your configured `APP_PORT`)

## Documentation

- **[Quick Reference](doc/QUICK-REFERENCE.md)** - 🚀 Fast access to all commands and configs
- **[Docker Setup](doc/DOCKER.md)** - Complete Docker usage guide for development and production
- **[Build Arguments Explained](doc/BUILD-ARGS-EXPLAINED.md)** - ⭐ How build args enable static page generation
- **[GitHub Actions](doc/GITHUB-ACTIONS.md)** - Automated deployment setup and configuration
- **[Deployment Guide](doc/DEPLOYMENT.md)** - Manual server deployment with Nginx and PM2
- **[Integration Guide](doc/INTEGRATION.md)** - How frontend connects to Strapi backend, ports, and troubleshooting

## Environment Variables

Copy `env.example` to `.env` and configure:

```env
NODE_ENV=development
APP_PORT=8203
NEXT_PUBLIC_STRAPI_BASEURL=http://localhost:8202
NEXT_PUBLIC_APP_BASEURL=http://localhost:8203
NEXT_PUBLIC_MATOMO_TRACKER=false
REVALIDATE_SECRET=your-secret-token-here
```

## Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build production application
- `npm run start` - Start production server (port 5680)
- `npm run lint` - Run ESLint

## Docker Commands

**Development:**
```bash
docker-compose --profile dev up -d --build
```

**Production:**
```bash
docker-compose --profile prod up -d --build
```

**View Logs:**
```bash
docker-compose logs -f
```

## Technology Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Apollo Client** - GraphQL client
- **Strapi** - Headless CMS backend
- **Docker** - Containerization

## Quick Deploy (PM2)

```bash
git pull && rm -rf .next && npm run build && pm2 restart serviceatlas
```

For detailed deployment instructions, see [doc/DEPLOYMENT.md](doc/DEPLOYMENT.md).






