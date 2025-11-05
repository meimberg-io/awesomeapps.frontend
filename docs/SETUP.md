# Local Setup

## Required Files (Not in Repository)

These files are gitignored and must be created locally:

### 1. `.env` - Environment Configuration

**Location:** Project root

**Create from template:**
```bash
cp env.example .env
```

**Required variables:**

```bash
# For Docker development
NEXT_PUBLIC_STRAPI_BASEURL=http://host.docker.internal:8202
NEXT_PUBLIC_APP_BASEURL=http://localhost:8203

# For local npm development (without Docker)
# NEXT_PUBLIC_STRAPI_BASEURL=http://localhost:1337
# NEXT_PUBLIC_APP_BASEURL=http://localhost:3000

# Matomo Analytics
NEXT_PUBLIC_MATOMO_TRACKER=false

# Revalidation Secret - Generate with:
# node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
REVALIDATE_SECRET=your-secret-token-here
```

**Generate secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Note on URLs:**
- **Docker:** Use `host.docker.internal` to access host services from container
- **Local npm:** Use `localhost` for direct connections
- **Production:** Use actual domain URLs

## Next Steps

After creating `.env`:

```bash
docker-compose up -d
npm run dev
```

See [README.md](README.md) for complete development guide.

