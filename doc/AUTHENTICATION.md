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

**Step 1: Go to Google Cloud Console**
- Visit: https://console.cloud.google.com/apis/credentials
- Sign in with your Google account

**Step 2: Create or Select Project**
- Click the project dropdown at the top
- Create a new project or select an existing one

**Step 3: Enable Required APIs**
- Go to "Library" in the sidebar
- Search for "Google+ API" (or "People API")
- Click "Enable"

**Step 4: Create OAuth Credentials**
1. Go to "Credentials" tab
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen first:
   - User Type: **External**
   - App name: `AwesomeApps`
   - User support email: Your email
   - Developer contact: Your email
   - Click **"Save and Continue"** through the steps

**Step 5: Configure OAuth Client**
- Application type: **Web application**
- Name: `AwesomeApps`
- **Authorized JavaScript origins:** (optional)
  - `http://localhost:8204`
- **Authorized redirect URIs:**
  - Development: `http://localhost:8204/api/auth/callback/google`
  - Production: `https://yourdomain.com/api/auth/callback/google`
- Click **"Create"**

**Step 6: Copy Credentials**
A modal will show your credentials:
- **Client ID**: Copy this (looks like `xxxxx.apps.googleusercontent.com`)
- **Client Secret**: Copy this (looks like `GOCSPX-xxxxx`)

**Step 7: Add to `.env`**
```env
OAUTH_GOOGLE_CLIENT_ID=your-client-id-here
OAUTH_GOOGLE_CLIENT_SECRET=your-client-secret-here
```

---

### GitHub OAuth

**Step 1: Go to GitHub Developer Settings**
- Visit: https://github.com/settings/developers
- Sign in to your GitHub account

**Step 2: Create New OAuth App**
1. Click **"OAuth Apps"** in the left sidebar
2. Click **"New OAuth App"** button

**Step 3: Fill in Application Details**
- **Application name**: `AwesomeApps` (or any name you prefer)
- **Homepage URL**: 
  - Development: `http://localhost:8204`
  - Production: `https://yourdomain.com`
- **Application description**: (optional) "AwesomeApps authentication"
- **Authorization callback URL**:
  - Development: `http://localhost:8204/api/auth/callback/github`
  - Production: `https://yourdomain.com/api/auth/callback/github`
  
  ⚠️ **Note:** You can only set ONE callback URL. For development, use localhost. Update it later for production.

**Step 4: Register Application**
- Click **"Register application"**

**Step 5: Get Your Credentials**
After registration, you'll see:
- **Client ID**: Displayed immediately (looks like `Ov23xxxxxxxxxx`)
- **Client secrets**: Click **"Generate a new client secret"**
  - Copy the secret immediately - it won't be shown again!

**Step 6: Add to `.env`**
```env
OAUTH_GITHUB_CLIENT_ID=your-client-id-here
OAUTH_GITHUB_CLIENT_SECRET=your-client-secret-here
```

**For Production:**
- Go back to your OAuth App settings
- Update the "Authorization callback URL" to your production domain
- The Client ID and Secret remain the same

---

### Microsoft 365 / Azure AD OAuth

**Step 1: Go to Azure Portal**
- Visit: https://portal.azure.com/
- Sign in with your Microsoft account

**Step 2: Navigate to App Registrations**
- Search for **"App registrations"** in the top search bar, or
- Go directly to: https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade

**Step 3: Create New App Registration**
1. Click **"+ New registration"** button
2. Fill in the registration form:
   - **Name**: `AwesomeApps`
   - **Supported account types**: Select **"Accounts in any organizational directory and personal Microsoft accounts (Multitenant + Personal)"**
     - This allows both work/school accounts AND personal Microsoft accounts
   - **Redirect URI**:
     - Platform: **Web**
     - URI: `http://localhost:8204/api/auth/callback/azure-ad`
3. Click **"Register"**

**Step 4: Copy Application (Client) ID and Tenant ID**

After registration, you'll see the **Overview** page. This page shows MANY IDs - here's what you need:

```
┌─────────────────────────────────────────────────────────┐
│ AwesomeApps                                             │
│                                                         │
│ Application (client) ID                                 │
│ xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx                    │  ← COPY THIS
│                                                         │
│ Directory (tenant) ID                                   │
│ yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy                    │  ← COPY THIS
│                                                         │
│ Object ID                                               │
│ zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz                    │  ← IGNORE THIS
└─────────────────────────────────────────────────────────┘
```

✅ **Copy these two:**
- **Application (client) ID** → Your `OAUTH_AZURE_AD_CLIENT_ID`
- **Directory (tenant) ID** → Your `OAUTH_AZURE_AD_TENANT_ID`

❌ **Don't copy:**
- Object ID (you don't need this)

**Step 5: Create Client Secret**
1. In the left sidebar, click **"Certificates & secrets"**
2. Under "Client secrets", click **"+ New client secret"**
3. Add a description: `AwesomeApps Dev` (or any name)
4. Select expiration: `24 months` (or your preference)
5. Click **"Add"**

**Step 6: Copy Client Secret Value**

⚠️ **CRITICAL:** After creating the secret, you'll see a table like this:

```
┌──────────────────┬─────────────────────────────────┬────────────┐
│ Description      │ Value                           │ Secret ID  │
├──────────────────┼─────────────────────────────────┼────────────┤
│ AwesomeApps Dev  │ abc~123~xyz~secret~value~here   │ aaaaa-bbbb │
│                  │ [Copy]                          │ [Copy]     │
└──────────────────┴─────────────────────────────────┴────────────┘
```

✅ **Copy the "Value" column** (the long string with `~` characters)  
❌ **Don't copy the "Secret ID"** (you don't need this)

⚠️ **WARNING:** The "Value" is shown **ONLY ONCE**! If you lose it, you'll need to create a new secret.

**Step 7: Add to `.env`**
```env
OAUTH_AZURE_AD_CLIENT_ID=your-application-client-id-here
OAUTH_AZURE_AD_CLIENT_SECRET=your-client-secret-value-here
OAUTH_AZURE_AD_TENANT_ID=your-directory-tenant-id-here
```

**Step 8: Add Production Redirect URI (Later)**

When deploying to production:
1. Go back to Azure Portal → Your app registration
2. Click **"Authentication"** in the left sidebar
3. Under **"Web"** → **"Redirect URIs"**, click **"+ Add URI"**
4. Add: `https://yourdomain.com/api/auth/callback/azure-ad`
5. Click **"Save"**

---

### Quick Reference: Which IDs to Use

| Provider | What to Copy | What NOT to Copy |
|----------|-------------|------------------|
| **Google** | Client ID, Client Secret | Project ID, Project Number |
| **GitHub** | Client ID, Client Secret | App ID |
| **Azure AD** | Application (client) ID, Directory (tenant) ID, Secret Value | Object ID, Secret ID, Subscription ID |

## Required Environment Variables

```env
# NextAuth.js configuration
AUTH_SECRET=your-nextauth-secret-here        # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:8204           # Must match your frontend URL

# OAuth providers (at least one recommended)
OAUTH_GOOGLE_CLIENT_ID=...
OAUTH_GOOGLE_CLIENT_SECRET=...

OAUTH_GITHUB_CLIENT_ID=...
OAUTH_GITHUB_CLIENT_SECRET=...

OAUTH_AZURE_AD_CLIENT_ID=...
OAUTH_AZURE_AD_CLIENT_SECRET=...
OAUTH_AZURE_AD_TENANT_ID=...
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

