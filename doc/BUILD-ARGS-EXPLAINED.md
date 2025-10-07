# Docker Build Arguments for Next.js SSG

## The Problem

Next.js pre-renders pages during `npm run build` by fetching data from APIs. In Docker, environment variables need to be available **at build time**, not just runtime.

**Wrong:** Using `force-dynamic` disables static generation entirely → slower pages, higher server load.

**Right:** Use Docker build arguments to inject env vars during build → static pages with real data baked in.

## How It Works

### 1. Dockerfile
```dockerfile
# Accept build arguments
ARG NEXT_PUBLIC_STRAPI_BASEURL
ARG NEXT_PUBLIC_APP_BASEURL
ARG NEXT_PUBLIC_MATOMO_TRACKER

# Make available to Next.js build
ENV NEXT_PUBLIC_STRAPI_BASEURL=$NEXT_PUBLIC_STRAPI_BASEURL
ENV NEXT_PUBLIC_APP_BASEURL=$NEXT_PUBLIC_APP_BASEURL
ENV NEXT_PUBLIC_MATOMO_TRACKER=$NEXT_PUBLIC_MATOMO_TRACKER

RUN npm run build  # ← Can now connect to Strapi
```

### 2. docker-compose.yml
```yaml
build:
  args:
    NEXT_PUBLIC_STRAPI_BASEURL: ${NEXT_PUBLIC_STRAPI_BASEURL}
    NEXT_PUBLIC_APP_BASEURL: ${NEXT_PUBLIC_APP_BASEURL}
    NEXT_PUBLIC_MATOMO_TRACKER: ${NEXT_PUBLIC_MATOMO_TRACKER:-false}
```

### 3. .env
```env
# Docker development (container → host)
NEXT_PUBLIC_STRAPI_BASEURL=http://host.docker.internal:8202
NEXT_PUBLIC_APP_BASEURL=http://localhost:8203

# Production
# NEXT_PUBLIC_STRAPI_BASEURL=https://api.serviceatlas.example.com
```

## Results

```
Route (app)                                 Size  First Load JS
┌ ○ /                                    1.87 kB         186 kB  ← Static!
├ ○ /news                                2.41 kB         186 kB  ← Static!
└ ○ /api/sitemap.xml                       148 B         101 kB  ← Static!

○  (Static)   prerendered as static content
```

**Benefits:** Instant page loads, better SEO, lower server load, CDN-cacheable.

## Key Points

- **`host.docker.internal`**: Docker containers use this to access host services (not `localhost`)
- **`NEXT_PUBLIC_*` prefix**: Required for browser-accessible vars, injected at build time
- **Rebuild required**: Changes to build args need `docker-compose --profile dev up --build`
- **No secrets**: Never put secrets in `NEXT_PUBLIC_*` variables (they're in the browser bundle)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails: "fetch failed" | Check `.env` exists, Strapi is running, using `host.docker.internal` |
| Pages show `ƒ` instead of `○` | Remove `force-dynamic`, ensure build args in docker-compose.yml |
| .env changes ignored | Rebuild: `docker-compose build` (restart isn't enough) |

