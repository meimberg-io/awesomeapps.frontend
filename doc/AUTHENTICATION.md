# Authentication Setup Guide

This application uses **NextAuth.js v5** for authentication with support for Google, GitHub, and Microsoft 365 (Azure AD) login.

## Quick Start

1. Copy `env.example` to `.env`
2. Generate secrets:
   ```bash
   # Generate AUTH_SECRET
   openssl rand -base64 32
   ```
3. Configure OAuth providers (see below)
4. Set `NEXTAUTH_URL` to match your frontend URL

## OAuth Provider Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Application type: **Web application**
6. Authorized redirect URIs:
   - Development: `http://localhost:8204/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Application name: AwesomeApps
   - Homepage URL: `http://localhost:8204` (or your production URL)
   - Authorization callback URL:
     - Development: `http://localhost:8204/api/auth/callback/github`
     - Production: `https://yourdomain.com/api/auth/callback/github`
4. Copy Client ID and generate Client Secret
5. Add to `.env`:
   ```env
   GITHUB_CLIENT_ID=your-client-id-here
   GITHUB_CLIENT_SECRET=your-client-secret-here
   ```

### Microsoft 365 / Azure AD OAuth

1. Go to [Azure Portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps)
2. Click "New registration"
3. Fill in:
   - Name: AwesomeApps
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: 
     - Platform: **Web**
     - URI: `http://localhost:8204/api/auth/callback/azure-ad` (add production URL later)
4. After creation, note the:
   - **Application (client) ID**
   - **Directory (tenant) ID**
5. Go to "Certificates & secrets" → "New client secret"
6. Copy the secret value immediately (it won't be shown again)
7. Add to `.env`:
   ```env
   AZURE_AD_CLIENT_ID=your-application-id-here
   AZURE_AD_CLIENT_SECRET=your-client-secret-here
   AZURE_AD_TENANT_ID=your-tenant-id-here
   ```

## Required Environment Variables

```env
# NextAuth.js configuration
AUTH_SECRET=your-nextauth-secret-here        # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:8204           # Must match your frontend URL

# OAuth providers (at least one recommended)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

AZURE_AD_CLIENT_ID=...
AZURE_AD_CLIENT_SECRET=...
AZURE_AD_TENANT_ID=...
```

## Testing Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:8204`
3. Click the "Anmelden" (Login) button in the header
4. Choose your preferred provider
5. After successful login, you'll see your profile in the header

## Production Deployment

### Update Redirect URIs

For each OAuth provider, add your production URL to the authorized redirect URIs:
- Google: `https://yourdomain.com/api/auth/callback/google`
- GitHub: `https://yourdomain.com/api/auth/callback/github`
- Azure AD: `https://yourdomain.com/api/auth/callback/azure-ad`

### Environment Variables

Update `.env` for production:
```env
NEXTAUTH_URL=https://yourdomain.com          # Your production domain
AUTH_SECRET=<generate-strong-secret>          # New secret for production
```

### Security Checklist

- ✅ Use HTTPS in production
- ✅ Generate unique `AUTH_SECRET` for production
- ✅ Never commit `.env` to git
- ✅ Restrict OAuth app permissions to minimum required
- ✅ Monitor OAuth app usage in provider dashboards
- ✅ Rotate secrets periodically

## Troubleshooting

### "Callback URL mismatch" error
- Verify redirect URIs in OAuth provider settings match exactly
- Check `NEXTAUTH_URL` matches your frontend URL (including port in dev)

### "Invalid client" error
- Verify Client ID and Client Secret are correct
- Check if OAuth app is approved/published (Azure AD)

### Session not persisting
- Verify `AUTH_SECRET` is set and consistent
- Check browser isn't blocking cookies

## File Structure

```
src/
├── lib/
│   └── auth.ts                    # NextAuth configuration
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts       # Auth API routes
│   └── auth/
│       └── signin/
│           └── page.tsx           # Custom sign-in page
└── components/
    └── auth/
        └── UserButton.tsx         # User menu component
```

## Need Help?

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NextAuth.js v5 (Beta) Guide](https://authjs.dev/)

