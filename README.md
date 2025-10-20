# AwesomeApps Frontend

Next.js frontend for the AwesomeApps service directory.

**First time?** See [doc/SETUP.md](doc/SETUP.md) to create required local files (`.env`)

## Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev
```

Visit http://localhost:3000

### Docker Development

```bash
cp env.example .env
docker-compose up
```

Visit http://localhost:8204

## Environment Setup

Create `.env`:

```env
# Backend API
NEXT_PUBLIC_STRAPI_BASEURL=http://localhost:1337
NEXT_PUBLIC_APP_BASEURL=http://localhost:8204

# Secrets
REVALIDATE_SECRET=your-random-secret-token
AUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:8204

# OAuth providers (optional)
OAUTH_GOOGLE_CLIENT_ID=your-google-client-id
OAUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret

# Analytics (optional)
NEXT_PUBLIC_MATOMO_TRACKER=false

# Docker port
APP_PORT=8204
```

**Important:** `NEXT_PUBLIC_*` variables are baked into the build. Changes require rebuild.

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build (with type & lint checks)
npm run start    # Production server
npm run lint     # Lint check
```

## Features

- Search with Strapi backend
- Tag-based filtering
- Authentication (Google, GitHub, Microsoft 365)
- Responsive design with dark mode
- SEO optimized

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- NextAuth.js v5
- Tailwind CSS
- Apollo Client (GraphQL)
- Docker

## Documentation

- **[Setup](doc/SETUP.md)** - First-time local setup
- **[Deployment](doc/DEPLOYMENT.md)** - Deploy to production
- **[GitHub Setup](doc/GITHUB-SETUP.md)** - Initial configuration
- **[Docker](doc/DOCKER.md)** - Docker setup

## Deployment

Push to `main` triggers automatic deployment:

```bash
git push origin main
```

See [doc/DEPLOYMENT.md](doc/DEPLOYMENT.md) for details.

## Production

**URL:** https://awesomeapps.meimberg.io
**Server:** hc-02.meimberg.io
**SSH:** `ssh -i ~/.ssh/oli_key root@hc-02.meimberg.io`
