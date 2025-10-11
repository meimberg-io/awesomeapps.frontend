# AwesomeApps Integration Guide

This guide explains how the frontend and Strapi backend work together.

## Architecture Overview

```
┌─────────────────────────────────────────┐
│  Frontend (Next.js)                     │
│  Port: 8203 (local dev)                 │
│  Port: 5680 (Docker/production)         │
└──────────────┬──────────────────────────┘
               │
               │ GraphQL API Requests
               │
┌──────────────▼──────────────────────────┐
│  Backend (Strapi)                       │
│  Port: 8202 (local)                     │
│  Port: 1337 (default Strapi)            │
└─────────────────────────────────────────┘
```

## Port Configuration

### Local Development

**Frontend:**
- Development server: `http://localhost:3000` (npm run dev)
- Docker dev: `http://localhost:8203`
- Docker prod: `http://localhost:5680`

**Backend (Strapi):**
- Local/Docker: `http://localhost:8202`

### Production

**Frontend:**
- PM2/Node: Port 5680
- Public URL: `https://awesomeapps.example.com` (via Nginx)

**Backend:**
- PM2/Node: Port 8202
- Public URL: `https://api.awesomeapps.example.com` (via Nginx)

## Environment Variables

### Frontend (.env)

```env
# For local development with local Strapi
NEXT_PUBLIC_STRAPI_BASEURL=http://localhost:8202
NEXT_PUBLIC_APP_BASEURL=http://localhost:8203

# For production with reverse proxy
NEXT_PUBLIC_STRAPI_BASEURL=https://api.awesomeapps.example.com
NEXT_PUBLIC_APP_BASEURL=https://awesomeapps.example.com
```

### Strapi (.env)

```env
# Frontend URL for CORS
CLIENT_URL=http://localhost:8203

# For production
CLIENT_URL=https://awesomeapps.example.com
```

## Running Both Services Locally

### Option 1: Standard Node Development

**Terminal 1 - Strapi Backend:**
```bash
cd ../awesomeapps.strapi
npm run develop
# Runs on http://localhost:8202
```

**Terminal 2 - Frontend:**
```bash
cd awesomeapps.frontend
npm run dev
# Runs on http://localhost:3000
```

### Option 2: Docker Development

**Strapi Backend:**
```bash
cd ../awesomeapps.strapi
docker-compose --profile dev up
# Accessible at http://localhost:8202
```

**Frontend:**
```bash
cd awesomeapps.frontend
docker-compose --profile dev up
# Accessible at http://localhost:8203
```

### Option 3: Docker Production Mode (Both Services)

Create a shared `docker-compose.yml` in a parent directory:

```yaml
version: '3.8'
services:
  strapi:
    build:
      context: ./awesomeapps.strapi
      dockerfile: Dockerfile
    ports:
      - "8202:1337"
    environment:
      - DATABASE_CLIENT=mysql
      - DATABASE_HOST=mysql
      # ... other Strapi env vars
    networks:
      - awesomeapps

  frontend:
    build:
      context: ./awesomeapps.frontend
      dockerfile: Dockerfile
    ports:
      - "8203:5680"
    environment:
      - NEXT_PUBLIC_STRAPI_BASEURL=http://strapi:1337
      - NEXT_PUBLIC_APP_BASEURL=http://localhost:8203
    depends_on:
      - strapi
    networks:
      - awesomeapps

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_DATABASE=strapi
      - MYSQL_USER=strapi
      - MYSQL_PASSWORD=strapi
      - MYSQL_ROOT_PASSWORD=root
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - awesomeapps

networks:
  awesomeapps:
    driver: bridge

volumes:
  mysql_data:
```

## API Communication

The frontend communicates with Strapi using **GraphQL**:

### GraphQL Endpoint
- Development: `http://localhost:8202/graphql`
- Production: `https://api.awesomeapps.example.com/graphql`

### Apollo Client Configuration

Located in `src/lib/strapi.ts`:

```typescript
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { STRAPI_BASEURL } from './constants';

const client = new ApolloClient({
  uri: `${STRAPI_BASEURL}/graphql`,
  cache: new InMemoryCache(),
});
```

## CORS Configuration

Strapi needs to allow requests from the frontend URL.

In `awesomeapps.strapi/config/middlewares.ts`:

```typescript
export default [
  // ... other middleware
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'http://localhost:8203',
        'https://awesomeapps.example.com',
      ],
    },
  },
];
```

## Revalidation

The frontend can trigger Strapi content revalidation via API route:

**Webhook in Strapi:**
```
POST http://localhost:8203/api/revalidate
Headers:
  x-revalidate-token: your-secret-token
Body:
  {
    "slug": "/s/service-slug"
  }
```

**Frontend API Route:** `src/app/api/revalidate/route.ts`

## Common Issues

### 1. CORS Errors
**Symptom:** "Access to fetch blocked by CORS policy"

**Solution:**
- Check Strapi CORS configuration includes frontend URL
- Verify `NEXT_PUBLIC_STRAPI_BASEURL` is correct
- Ensure both services are running

### 2. Connection Refused
**Symptom:** "Failed to fetch" or "ECONNREFUSED"

**Solution:**
- Verify Strapi is running: `curl http://localhost:8202/graphql`
- Check firewall settings
- Verify port numbers match in `.env` files

### 3. GraphQL Errors
**Symptom:** "GraphQL error: Forbidden" or 401/403 errors

**Solution:**
- Check Strapi permissions for public access
- Verify GraphQL queries match schema
- Check Strapi admin panel → Settings → Roles → Public

### 4. Environment Variables Not Working
**Symptom:** Variables are undefined or use wrong values

**Solution:**
- Prefix browser-accessible vars with `NEXT_PUBLIC_`
- Restart development server after changing `.env`
- Rebuild Docker containers: `docker-compose up --build`

## Production Deployment Notes

1. **Security:**
   - Use HTTPS for all public URLs
   - Set strong `REVALIDATE_SECRET`
   - Configure proper CORS origins
   - Use environment variables for secrets

2. **Performance:**
   - Enable Strapi caching
   - Use Next.js ISR (Incremental Static Regeneration)
   - Configure CDN for static assets
   - Enable gzip in Nginx

3. **Monitoring:**
   - Set up logging for both services
   - Monitor API response times
   - Track GraphQL query performance
   - Use PM2 monitoring: `pm2 monit`

## Testing the Integration

### Quick Health Check

```bash
# Check Strapi
curl http://localhost:8202/_health

# Check Frontend
curl http://localhost:8203/

# Check GraphQL
curl -X POST http://localhost:8202/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

### Browser Console Test

```javascript
// In browser console on frontend
fetch('http://localhost:8202/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: '{ __typename }' })
})
.then(r => r.json())
.then(console.log);
```

