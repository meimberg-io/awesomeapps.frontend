# Authentication & Profile Management Implementation

## Summary

Complete user authentication system with JWT, profile management, and favorites functionality has been implemented.

## What Was Implemented

### Backend (Strapi)

1. **Member Schema Extension**
   - Added `strapiUser` relation linking Member to Strapi's users-permissions User
   - File: `serviceatlas.strapi/src/api/member/content-types/member/schema.json`

2. **Member Service Updates**
   - New method `findOrCreateStrapiUser()` - Creates/finds Strapi user with authenticated role
   - Updated `findOrCreateFromOAuth()` - Now links Member to Strapi User
   - File: `serviceatlas.strapi/src/api/member/services/member.ts`

3. **Member Controller JWT Integration**
   - `/api/members/me` endpoint now:
     - Creates/updates Strapi User
     - Creates/updates Member
     - Generates JWT token with user ID and member ID
     - Returns `{ jwt, user, member }`
   - File: `serviceatlas.strapi/src/api/member/controllers/member.ts`

4. **Authentication Policy**
   - New policy `authenticate-member` validates JWT from Authorization header
   - Extracts memberId from JWT payload
   - File: `serviceatlas.strapi/src/policies/authenticate-member.ts`

5. **Secured Routes**
   - Member routes now require authentication:
     - `PUT /members/:id/profile`
     - `POST /members/:id/favorites`
     - `DELETE /members/:id/favorites/:serviceId`
   - Review routes now require authentication:
     - `POST /reviews`
     - `PUT /reviews/:id`
     - `DELETE /reviews/:id`
   - Files: `src/api/member/routes/member.ts`, `src/api/review/routes/review.ts`

### Frontend (Next.js)

1. **NextAuth Integration with Strapi**
   - Extended NextAuth callbacks to fetch Strapi JWT on login
   - JWT and member data stored in session
   - Protected routes: `/profile`, `/favorites`
   - File: `src/lib/auth.ts`

2. **Type Definitions**
   - Extended NextAuth Session type with `strapiJwt`, `memberId`, `memberData`
   - Added `id` field to Service type for relations
   - Files: `src/types/next-auth.d.ts`, `src/types/service.ts`

3. **Strapi API Helper**
   - Functions for all member operations:
     - `authenticateMember()` - Get JWT from Strapi
     - `updateMemberProfile()` - Update profile data
     - `addFavorite()` - Add service to favorites
     - `removeFavorite()` - Remove from favorites
     - `getFavorites()` - Get all favorites
     - `checkFavorite()` - Check if service is favorited
     - `getMemberProfile()` - Get profile with stats
     - `getMemberReviews()` - Get member's reviews
   - File: `src/lib/api/strapi-api.ts`

4. **Member Context Provider**
   - Global state for member data and favorites
   - Auto-fetches data on authentication
   - Provides helper functions to components
   - File: `src/contexts/MemberContext.tsx`
   - Integrated in: `src/components/Providers.tsx`

5. **UserButton Updates**
   - Added "Mein Profil" menu item → `/profile`
   - Added "Meine Favoriten" menu item → `/favorites`
   - File: `src/components/auth/UserButton.tsx`

6. **Service Detail with Favorites**
   - Heart icon button next to service name
   - Filled when favorited, outline when not
   - Toast notifications on success/error
   - Prompts login if not authenticated
   - File: `src/components/new/ServiceDetail.tsx`

7. **Profile Page** (`/profile`)
   - Display member information
   - Edit form for username, displayName, bio
   - Statistics card (favorites count, reviews count, member since)
   - List of member's reviews with links
   - Protected route (redirects to signin)
   - File: `src/app/profile/page.tsx`

8. **Favorites Page** (`/favorites`)
   - Grid display of favorite services
   - Service cards with thumbnail, logo, name, abstract, tags
   - "Remove from favorites" button on each card
   - Empty state with call-to-action
   - Protected route (redirects to signin)
   - File: `src/app/favorites/page.tsx`

9. **UI Components**
   - Created Textarea component for bio editing
   - File: `src/components/ui/textarea.tsx`

## How It Works

### Authentication Flow

1. User clicks "Anmelden" and selects OAuth provider (Google/GitHub/Azure AD)
2. NextAuth handles OAuth flow
3. On successful OAuth, NextAuth callback calls Strapi `/api/members/me`
4. Strapi:
   - Creates/finds users-permissions User
   - Creates/updates Member linked to User
   - Generates JWT with user.id and member.id
   - Returns JWT + member data
5. JWT stored in NextAuth session
6. All API requests include `Authorization: Bearer {jwt}` header

### Security

- **Public Routes**: Read-only access to services, tags, published reviews
- **Protected Routes**: Require valid JWT
  - Add/remove favorites
  - Update profile
  - Create/update/delete reviews
- **Authorization**: Strapi middleware validates JWT automatically
- **Policy**: `authenticate-member` extracts memberId from JWT

## Testing Instructions

### 1. Test Login

```bash
# Start Strapi backend
cd serviceatlas.strapi
npm run develop

# Start frontend
cd awesomeapps.frontend
npm run dev
```

1. Go to http://localhost:8204
2. Click "Anmelden"
3. Sign in with Google/GitHub/Microsoft
4. Should redirect back with user menu visible

### 2. Test Profile

1. After login, click user menu
2. Click "Mein Profil"
3. Should see profile page with your info
4. Click "Profil bearbeiten"
5. Change displayName or bio
6. Click "Speichern"
7. Should see success toast

### 3. Test Favorites

1. Browse services on home page
2. Click on a service to view details
3. Click heart icon next to service name
4. Should see "Hinzugefügt" toast
5. Click user menu → "Meine Favoriten"
6. Should see the favorited service
7. Click trash icon to remove
8. Should see "Entfernt" toast

### 4. Test Without Login

1. Log out
2. Try to access `/profile` → Should redirect to signin
3. Try to access `/favorites` → Should redirect to signin
4. View a service detail page
5. Click heart icon → Should see "Anmeldung erforderlich" message

### 5. Verify Backend Security

Test that protected endpoints require JWT:

```bash
# Without JWT - should fail with 401/403
curl -X POST http://localhost:1337/api/members/1/favorites \
  -H "Content-Type: application/json" \
  -d '{"serviceId": 1}'

# With JWT - should succeed
curl -X POST http://localhost:1337/api/members/1/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_HERE" \
  -d '{"serviceId": 1}'
```

## Environment Variables Required

Make sure these are set in frontend `.env`:

```env
AUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:8204

OAUTH_GOOGLE_CLIENT_ID=...
OAUTH_GOOGLE_CLIENT_SECRET=...

OAUTH_GITHUB_CLIENT_ID=...
OAUTH_GITHUB_CLIENT_SECRET=...

OAUTH_AZURE_AD_CLIENT_ID=...
OAUTH_AZURE_AD_CLIENT_SECRET=...
OAUTH_AZURE_AD_TENANT_ID=...

NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## Troubleshooting

### "Failed to authenticate with Strapi"
- Check Strapi is running on port 1337
- Verify NEXT_PUBLIC_STRAPI_URL in frontend .env
- Check Strapi logs for errors

### JWT not persisting
- Clear browser cookies and localStorage
- Restart both frontend and backend
- Check AUTH_SECRET is set consistently

### "Not authenticated" errors
- Check Authorization header is being sent
- Verify JWT is valid (not expired)
- Check Strapi users-permissions plugin is enabled

### Favorites not showing
- Check member data is loaded in MemberContext
- Verify API calls include JWT
- Check browser console for errors

## Next Steps

Optional enhancements:

1. **Email/Password Authentication**: Add local authentication option
2. **Review Moderation**: Admin interface for review approval
3. **Avatar Upload**: Allow users to upload custom avatars
4. **Review Voting**: Implement helpful/not helpful voting
5. **Member Badges**: Gamification with achievements
6. **Review Attachments**: Allow screenshots in reviews
7. **Social Features**: Follow other members, activity feed
8. **Notifications**: Email notifications for review responses

## Files Modified/Created

### Backend
- `src/api/member/content-types/member/schema.json` (modified)
- `src/api/member/services/member.ts` (modified)
- `src/api/member/controllers/member.ts` (modified)
- `src/api/member/routes/member.ts` (modified)
- `src/api/review/routes/review.ts` (modified)
- `src/policies/authenticate-member.ts` (created)

### Frontend
- `src/lib/auth.ts` (modified)
- `src/types/next-auth.d.ts` (created)
- `src/types/service.ts` (modified)
- `src/lib/api/strapi-api.ts` (created)
- `src/contexts/MemberContext.tsx` (created)
- `src/components/Providers.tsx` (modified)
- `src/components/auth/UserButton.tsx` (modified)
- `src/components/new/ServiceDetail.tsx` (modified)
- `src/components/ui/textarea.tsx` (created)
- `src/app/profile/page.tsx` (created)
- `src/app/favorites/page.tsx` (created)

---

**Implementation Status**: ✅ Complete

All planned features have been implemented and are ready for testing.

