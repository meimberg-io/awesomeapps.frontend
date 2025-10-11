# AwesomeApps Frontend

Modern Next.js frontend for the AwesomeApps platform with Strapi CMS integration.

## Quick Start

### Development
```bash
npm install
npm run dev
```
Visit `http://localhost:3000`

### Docker Development
```bash
cp env.example .env
docker-compose --profile dev up --build
```
Visit `http://localhost:8204`

### Docker Production
```bash
docker-compose --profile prod up -d --build
```
Application runs on port `5680`

## Required Environment Variables

Create `.env` file with these variables:

```env
# Required - Backend API URL
NEXT_PUBLIC_STRAPI_BASEURL=http://localhost:8202

# Required - Frontend URL
NEXT_PUBLIC_APP_BASEURL=http://localhost:8204

# Required - Secret for revalidation API
REVALIDATE_SECRET=your-random-secret-token

# Required - NextAuth secrets (for authentication)
AUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:8204

# Optional - OAuth providers (see doc/AUTHENTICATION.md for setup)
OAUTH_GOOGLE_CLIENT_ID=your-google-client-id
OAUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret
# ... (more providers in env.example)

# Optional - Analytics
NEXT_PUBLIC_MATOMO_TRACKER=false

# Optional - Development port
APP_PORT=8204
```

**Important:** 
- `NEXT_PUBLIC_*` variables are **build-time** variables - they're embedded in the static build
- Change these? Rebuild required: `npm run build` or rebuild Docker image
- `REVALIDATE_SECRET` should be a strong random token in production

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build (runs TypeScript & ESLint checks)
- `npm run start` - Production server
- `npm run lint` - ESLint only

## Features

- 🔍 Search functionality with Strapi backend integration
- 🏷️ Tag-based filtering system
- 🔐 Authentication with Google, GitHub, and Microsoft 365
- 📱 Responsive design with mobile support
- 🎨 Modern UI with dark mode support

## Technology Stack

- Next.js 15 (App Router, TypeScript)
- NextAuth.js v5 (authentication)
- Tailwind CSS + Manrope font
- Apollo Client (GraphQL)
- Strapi CMS backend
- Docker (multi-stage builds)

## Documentation

- **[Quick Reference](doc/QUICK-REFERENCE.md)** - 🚀 Fast command reference
- **[Authentication Setup](doc/AUTHENTICATION.md)** - 🔐 OAuth provider configuration
- **[Pre-Deployment Checklist](doc/PRE-DEPLOYMENT-CHECKLIST.md)** - ✅ Required vars & checklist
- **[Deployment Guide](doc/DEPLOYMENT.md)** - 📦 Complete deployment guide
- **[Docker Guide](doc/DOCKER.md)** - 🐳 Docker usage details

## Production Deployment

**Before deploying:** Review [doc/PRE-DEPLOYMENT-CHECKLIST.md](doc/PRE-DEPLOYMENT-CHECKLIST.md)

**For deployment:** See [doc/DEPLOYMENT.md](doc/DEPLOYMENT.md)

Quick update on server:
```bash
cd /srv/awesomeapps-frontend/app
git pull
npm install
npm run build
pm2 restart awesomeapps-frontend
```






