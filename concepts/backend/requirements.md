# Requirements: App Admin Administration

## Document Information

- **Version**: 1.0
- **Status**: Draft
- **Target Audience**: Junior Developer
- **Related Document**: `vision.md`

## Table of Contents

1. [Overview](#overview)
2. [User Roles & Access Control](#user-roles--access-control)
3. [Navigation Structure](#navigation-structure)
4. [Section Requirements](#section-requirements)
5. [Data Models](#data-models)
6. [API Requirements](#api-requirements)
7. [UI/UX Requirements](#uiux-requirements)
8. [Technical Implementation](#technical-implementation)
9. [Open Questions](#open-questions)

---

## Overview

### Purpose

Create an admin administration section for managing apps (services), tags, users, and an app import/update queue. This section is restricted to authorized administrators only.

### Scope

- **Frontend**: Next.js App Router with React Server Components (default)
- **Backend API**: Strapi CMS
- **Authentication**: NextAuth.js with OAuth providers (Google, GitHub, Azure AD)
- **Authorization**: Role-based access control (RBAC) via Strapi

### Key Terminology

- **App/App**: The main entity representing an application. Currently named "app" in codebase but will be renamed to "app" in future. For this feature, both terms are equivalent.
- **Admin**: The administration section (not to be confused with Strapi backend)
- **New App Queue**: Queue of apps pending import/update (stored in `new-app` collection)

---

## User Roles & Access Control

### Authorization Requirements

1. **Access Control**
   - Admin section visible only to authorized users
   - Authorization must be checked on both frontend and API level
   - Unauthorized users must be redirected or shown 403 error

2. **Authorization Mechanism**
   - **Option A**: Add `isAdmin` or `role` field to Member model in Strapi
   - **Option B**: Maintain a whitelist of authorized email addresses (stored in environment variable or Strapi config)
   - **Option C**: Use Strapi admin roles and link members to admin users
   - **For now**: Start with Option B (whitelist) for MVP, migrate to Option A for production

3. **Frontend Authorization Check**
   - Check user authorization on page load
   - Show admin navigation link in user menu only if authorized
   - Implement middleware or route protection for `/admin/*` routes

4. **API Authorization Check**
   - All admin API endpoints must verify user authorization
   - Use Strapi policies to enforce authorization
   - Return 403 Forbidden if unauthorized

### Implementation Notes

- Authorization check should be performed using the authenticated member's email or member ID
- Cache authorization status in session/token to avoid repeated checks
- Log unauthorized access attempts for security monitoring

---

## Navigation Structure

### Top-Level Navigation

The admin section should be accessible from the user menu dropdown:

**Location**: `UserButton` component (`src/components/auth/UserButton.tsx`)

**Menu Item**: 
- **Label**: "Admin"
- **Icon**: Settings/Cog icon (lucide-react)
- **Visibility**: Only visible to authorized users
- **Link**: `/{locale}/admin`

### Admin Sub-Navigation

Create a dedicated navigation component for admin sections:

**Navigation Items**:
1. **Dashboard** (default)
   - Route: `/{locale}/admin`
   - Icon: LayoutDashboard
   
2. **Apps**
   - Route: `/{locale}/admin/apps`
   - Icon: Package/Grid
   
3. **App Queue**
   - Route: `/{locale}/admin/queue`
   - Icon: List/Inbox
   
4. **Tags**
   - Route: `/{locale}/admin/tags`
   - Icon: Tag
   
5. **Users**
   - Route: `/{locale}/admin/users`
   - Icon: Users

**Navigation Component Requirements**:
- Horizontal navigation bar (desktop) or vertical sidebar (mobile)
- Active state highlighting
- Responsive design
- Consistent styling with existing navigation

---

## Section Requirements

### 1. Dashboard

**Route**: `/{locale}/admin`

**Purpose**: Overview of key metrics and recent activity

**Display Items**:

1. **Statistics Cards**:
   - Total number of apps
   - Total number of users/members
   - Number of apps in queue (pending status)
   - Number of apps with errors (error status in queue)
   - Recent apps (last 5-10 created/updated)

2. **Recent Activity**:
   - List of recently created/updated apps
   - List of recent queue processing activities
   - Optional: Activity timeline

3. **Quick Actions**:
   - Link to create new app
   - Link to view queue
   - Link to manage tags

**Data Requirements**:
- Fetch aggregate counts from Strapi API
- Cache statistics for performance (refresh every 5-10 minutes)
- Display loading states during data fetch

**UI Components**:
- Stat cards (number + label + icon)
- Data table for recent apps
- Action buttons/links

---

### 2. Apps

**Route**: `/{locale}/admin/apps`

**Purpose**: Manage all apps with full CRUD operations

#### 2.1 Apps List View

**Layout**: Data table with customizable columns

**Features**:

1. **Column Display**:
   - Default visible columns: Name, Slug, URL, Created Date, Updated Date, Status
   - User-selectable columns from all available fields
   - Drag-and-drop column reordering
   - Save column preferences (localStorage or user profile)
   - Column width adjustment (resizable)

2. **Sorting**:
   - Default: Sort by name (ascending)
   - Sortable columns: Name, Slug, Created Date, Updated Date, Publish Date
   - Multi-column sorting: TBD (optional for MVP)
   - Sort indicators (ascending/descending arrows)

3. **Filtering**:
   - **Text Search**: Global search across name, slug, URL
   - **Status Filter**: Filter by published/draft status
   - **Tag Filter**: Filter by associated tags (multi-select)
   - **Date Range**: Filter by created/updated date
   - **Top Apps**: Filter for apps marked as "top"
   - Save filter presets (optional)

4. **Pagination**:
   - Page size: 10, 25, 50, 100 items per page
   - Page navigation (first, prev, next, last)
   - Display total count and current range

5. **Row Actions**:
   - **Edit**: Opens edit form (inline modal or separate page)
   - **Delete**: Shows confirmation dialog before deletion

**Table Columns** (All available fields):
- Checkbox (for selection)
- Name
- Slug
- URL
- Abstract
- Pricing
- Description
- Functionality
- Short Facts
- Created Date
- Updated Date
- Publish Date
- Top (boolean)
- Tags (badges)
- Logo (thumbnail)
- Thumbnail (thumbnail)
- Reviews Count
- Average Rating
- YouTube Video
- YouTube Title

**Data Requirements**:
- Fetch apps with pagination, sorting, filtering from Strapi API
- Support server-side pagination (not client-side)
- Include related data (tags, images) in API response
- Handle loading and error states

**UI Components**:
- Data table component (recommend shadcn/ui table or similar)
- Column selector dropdown
- Filter panel
- Search input
- Pagination controls
- Action buttons/dropdowns

#### 2.2 App Edit Form

**Purpose**: Edit all fields of an app

**Form Structure**:

1. **Basic Information** (Tab/Section):
   - Name (required, unique)
   - Slug (auto-generated from name, editable, unique)
   - URL (required, unique, URL validation)
   - Abstract (text, localized: de/en)
   - Short Facts (text, localized: de/en)

2. **Descriptions** (Tab/Section):
   - Description (rich text, localized: de/en)
   - Long Description (blocks editor, localized: de/en)
   - Functionality (rich text, localized: de/en)
   - Pricing (rich text, localized: de/en)

3. **Media** (Tab/Section):
   - Logo Upload (image, single)
     - File upload component
     - Image preview
     - Crop/resize functionality (optional)
   - Thumbnail Upload (image, single)
   - Screenshots (images, multiple)
     - Add/remove/reorder screenshots
     - Image preview grid

4. **Content** (Tab/Section):
   - Article Content (dynamic zones with components: slider, rich-text, quote, media)
   - YouTube Video ID
   - YouTube Title

5. **Metadata** (Tab/Section):
   - Tags (multi-select from existing tags)
   - Publish Date (date picker)
   - Top (checkbox)

6. **Translations** (Tab/Section):
   - Language selector: English (default) / German
   - Ensure German translation exists for all localized fields
   - Validation: Warn if German translation missing

**Form Features**:

1. **Validation**:
   - Client-side validation before submit
   - Server-side validation for uniqueness (name, slug, URL)
   - Real-time uniqueness check (debounced API call)
   - Required field indicators
   - Error messages displayed inline

2. **Save Actions**:
   - **Save**: Save draft (stay on form)
   - **Save & Close**: Save and return to list
   - **Cancel**: Discard changes (with confirmation if unsaved)

3. **Auto-save** (Optional):
   - Save draft automatically every 30-60 seconds
   - Show "Saving..." indicator
   - Show "Saved" confirmation

4. **Image Handling**:
   - Upload images to Strapi media library
   - Display existing images with option to replace/remove
   - Support drag-and-drop upload
   - Image format validation (jpg, png, webp, etc.)
   - File size validation (max 5MB recommended)

5. **Rich Text Editors**:
   - Use Strapi Blocks Renderer compatible editor
   - Support all Strapi block types
   - Localized content editing

**Data Requirements**:
- Fetch app data by ID (including all relations)
- Submit form data to Strapi API
- Handle partial updates (only changed fields)
- Handle image uploads via Strapi media API

**UI Components**:
- Form component with tabs or accordion sections
- Text inputs
- Rich text editor
- Blocks editor (for long description)
- Image upload component
- Tag multi-select
- Date picker
- Validation error display
- Loading states

#### 2.3 App Delete

**Confirmation Dialog**:
- Show app name and confirmation message
- Warn about permanent deletion
- Option to cancel or confirm
- Show loading state during deletion
- Refresh list after successful deletion

**API Requirements**:
- DELETE endpoint: `/api/services/{id}`
- Authorization check required
- Return success/error response

---

### 3. App Queue

**Route**: `/{locale}/admin/queue`

**Purpose**: Manage apps pending import/update

**Data Model**: `new-app` collection with fields:
- `slug` (string)
- `field` (string)
- `n8nstatus` (enum: "new", "pending", "finished", "error")

**Display**:

1. **Queue List**:
   - Table view with columns:
     - Slug
     - Field
     - Status (with color coding: new=blue, pending=yellow, finished=green, error=red)
     - Created Date
     - Updated Date
     - Actions (Edit, Delete)

2. **Status Filtering**:
   - Filter by status (all, new, pending, finished, error)
   - Default: Show all or only "new" and "pending"

3. **Quick Actions**:
   - **Edit**: Open edit form for queue item
   - **Process**: Mark as "pending" and trigger processing (if applicable)
   - **Mark as Finished**: Change status to "finished"
   - **Mark as Error**: Change status to "error"
   - **Delete**: Remove from queue

4. **Bulk Actions**:
   - Bulk status update
   - Bulk delete

**Edit Form**:
- Simple form with:
  - Slug (editable)
  - Field (editable)
  - Status (dropdown: new, pending, finished, error)

**Integration**:
- This queue may be populated by external systems (n8n workflow)
- Queue items can be manually created/edited by admins
- Consider adding "notes" or "error message" field for error status

**UI Components**:
- Data table
- Status badges (colored)
- Filter dropdown
- Action buttons

---

### 4. Tags

**Route**: `/{locale}/admin/tags`

**Purpose**: Manage tags for apps

**Data Model**: `tag` collection with fields:
- `name` (string)
- `description` (text)
- `icon` (string)
- `excluded` (boolean)
- `services` (relation: manyToMany with services)

#### 4.1 Tags List View

**Display**:
- Table with columns:
  - Name
  - Icon (display icon if available)
  - Description (truncated)
  - Excluded (boolean status badge or icon indicator)
  - Number of Connected Apps (count from relation)
  - Actions (Edit, Delete)

**Features**:
- Sortable by name (default: alphabetical)
- Search/filter by name
- Filter by excluded status (all, excluded, not excluded)
- Create new tag button
- Delete confirmation dialog

#### 4.2 Tag Edit/Create Form

**Form Fields**:
- Name (required, unique)
- Description (optional)
- Icon (string input - icon name or icon picker component)
  - Consider using icon library (lucide-react, heroicons, etc.)
- Excluded (checkbox - boolean)
  - Default: false (not excluded)
  - When checked, tag is excluded
- Connected Apps (read-only list or link to filtered apps view)

**Validation**:
- Name must be unique
- Check uniqueness on blur/submit

**Actions**:
- Save
- Cancel
- Delete (only in edit mode)

**UI Components**:
- Form component
- Icon picker (optional)
- Checkbox component (for excluded field)
- Connected apps list/badge

---

### 5. Users

**Route**: `/{locale}/admin/users`

**Purpose**: View and manage users/members

**Data Model**: `member` collection

#### 5.1 Users List View

**Display**:
- Table with columns:
  - Name/Username
  - Email
  - Display Name
  - OAuth Provider
  - Last Login (if available)
  - Created Date
  - Status (Active/Inactive)
  - Actions (View, Edit, Delete)

**Features**:
- Sortable by name, email, last login, created date
- Search/filter by name, email
- Filter by OAuth provider
- Filter by status (active/inactive)
- Pagination

**Actions**:
- **View**: View user details (read-only)
- **Edit**: Edit user profile (optional - may be restricted)
- **Delete**: Delete user (with confirmation)
- **Toggle Active Status**: Activate/deactivate user

#### 5.2 User Detail View (Optional)

**Display**:
- User profile information
- Associated favorites (list of apps)
- Reviews (if applicable)
- Activity history (optional)

**Note**: Edit functionality may be limited to prevent privilege escalation. Consider read-only view only.

**UI Components**:
- Data table
- User detail modal/page
- Status toggle

---

## Data Models

### App/App Model

**Strapi Collection**: `app`

**Fields** (from schema):
- `name` (string, unique, not localized)
- `slug` (uid, auto-generated from name)
- `url` (string, unique, not localized)
- `abstract` (text, localized: de/en)
- `pricing` (richtext, localized: de/en)
- `shortfacts` (text, localized: de/en)
- `description` (richtext, localized: de/en)
- `functionality` (richtext, localized: de/en)
- `thumbnail` (media: image, single, not localized)
- `screenshots` (media: images, multiple, not localized)
- `logo` (media, single, not localized)
- `youtube_video` (string, not localized)
- `youtube_title` (string, not localized)
- `tags` (relation: manyToMany with tag)
- `reviews` (relation: oneToMany with review)
- `reviewCount` (integer, default: 0)
- `averageRating` (decimal, default: 0)
- `publishdate` (date)
- `top` (boolean)
- `createdAt` (datetime)
- `updatedAt` (datetime)

**Localization**: 
- Default locale: `en`
- Additional locale: `de`
- All localized fields must have both `en` and `de` translations

### Tag Model

**Strapi Collection**: `tag`

**Fields**:
- `name` (string, unique)
- `description` (text)
- `icon` (string)
- `excluded` (boolean, default: false)
- `services` (relation: manyToMany with app)

### Member/User Model

**Strapi Collection**: `member`

**Fields**:
- `email` (string, unique, required)
- `username` (string, unique)
- `displayName` (string)
- `avatarUrl` (string)
- `oauthProvider` (enum: google, github, azure-ad, local)
- `oauthId` (string)
- `favorites` (relation: manyToMany with app)
- `lastlogin` (datetime)
- `reviews` (relation: oneToMany with review)
- `bio` (text, max 500)
- `avatar` (media: image, single)
- `isActive` (boolean, default: true)
- `strapiUser` (relation: oneToOne with admin user)
- `createdAt` (datetime)

### New App Queue Model

**Strapi Collection**: `new-app`

**Fields**:
- `slug` (string)
- `field` (string)
- `n8nstatus` (enum: new, pending, finished, error, default: new)
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

## API Requirements

### Base URL

All API calls to Strapi: `${STRAPI_BASEURL}/api`

### Authentication

- Use JWT token from NextAuth session (`session.strapiJwt`)
- Include token in `Authorization` header: `Bearer {token}`
- Handle token refresh if expired

### Endpoints

#### Apps

1. **GET /services**
   - Query params: `pagination[page]`, `pagination[pageSize]`, `sort`, `filters`, `populate`
   - Returns: Paginated list of apps
   - Authorization: Required

2. **GET /services/:id**
   - Query params: `populate` (for relations and media)
   - Returns: Single app with all relations
   - Authorization: Required

3. **POST /services**
   - Body: App data (JSON)
   - Returns: Created app
   - Authorization: Required

4. **PUT /services/:id**
   - Body: App data (JSON, partial update supported)
   - Returns: Updated app
   - Authorization: Required

5. **DELETE /services/:id**
   - Returns: Deleted app or success message
   - Authorization: Required

6. **POST /upload**
   - Body: FormData with file
   - Returns: Uploaded media file
   - Authorization: Required
   - Use for logo, thumbnail, screenshots

#### Tags

1. **GET /tags**
   - Query params: `populate[services][count]` (to get count)
   - Returns: List of tags with app count
   - Authorization: Required

2. **GET /tags/:id**
   - Returns: Single tag
   - Authorization: Required

3. **POST /tags**
   - Body: Tag data
   - Returns: Created tag
   - Authorization: Required

4. **PUT /tags/:id**
   - Body: Tag data
   - Returns: Updated tag
   - Authorization: Required

5. **DELETE /tags/:id**
   - Returns: Deleted tag or success message
   - Authorization: Required

#### Users/Members

1. **GET /members**
   - Query params: `pagination`, `sort`, `filters`
   - Returns: Paginated list of members
   - Authorization: Required (admin only)

2. **GET /members/:id**
   - Returns: Single member
   - Authorization: Required (admin only)

3. **PUT /members/:id**
   - Body: Member data (limited fields)
   - Returns: Updated member
   - Authorization: Required (admin only)

4. **DELETE /members/:id**
   - Returns: Deleted member or success message
   - Authorization: Required (admin only)

#### Queue

1. **GET /new-services**
   - Query params: `filters[n8nstatus]`, `sort`, `pagination`
   - Returns: List of queue items
   - Authorization: Required

2. **GET /new-services/:id**
   - Returns: Single queue item
   - Authorization: Required

3. **POST /new-services**
   - Body: Queue item data
   - Returns: Created queue item
   - Authorization: Required

4. **PUT /new-services/:id**
   - Body: Queue item data
   - Returns: Updated queue item
   - Authorization: Required

5. **DELETE /new-services/:id**
   - Returns: Deleted queue item or success message
   - Authorization: Required

#### Uniqueness Validation

1. **GET /services?filters[name][$eq]=:name**
   - Check if name exists
   - Returns: List (empty if unique)

2. **GET /services?filters[slug][$eq]=:slug**
   - Check if slug exists
   - Returns: List (empty if unique)

3. **GET /services?filters[url][$eq]=:url**
   - Check if URL exists
   - Returns: List (empty if unique)

**Note**: Implement debounced API calls for real-time uniqueness checking in forms.

---

## UI/UX Requirements

### Design System

- Use existing design system (shadcn/ui components)
- Maintain consistency with rest of application
- Follow existing color scheme and typography

### Responsive Design

- Desktop-first approach
- Mobile-friendly navigation (collapsible sidebar or bottom nav)
- Tables should scroll horizontally on mobile or use card layout
- Forms should stack vertically on mobile

### Loading States

- Show skeleton loaders or spinners during data fetch
- Display loading indicators for form submissions
- Disable buttons during async operations

### Error Handling

- Display user-friendly error messages
- Show validation errors inline in forms
- Handle API errors gracefully
- Show toast notifications for success/error actions

### Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Focus indicators
- Semantic HTML

### Performance

- Implement pagination (not load all data at once)
- Lazy load images
- Debounce search inputs
- Cache API responses where appropriate
- Optimize re-renders with React.memo, useMemo, useCallback

---

## Technical Implementation

### File Structure

```
src/
├── app/
│   └── [locale]/
│       └── admin/
│           ├── layout.tsx              # Admin layout with navigation
│           ├── page.tsx                # Dashboard
│           ├── apps/
│           │   ├── page.tsx            # Apps list
│           │   └── [id]/
│           │       └── page.tsx        # App edit form
│           ├── queue/
│           │   ├── page.tsx            # Queue list
│           │   └── [id]/
│           │       └── page.tsx        # Queue item edit
│           ├── tags/
│           │   ├── page.tsx            # Tags list
│           │   └── [id]/
│           │       └── page.tsx        # Tag edit form
│           └── users/
│               ├── page.tsx            # Users list
│               └── [id]/
│                   └── page.tsx        # User detail view
├── components/
│   └── admin/
│       ├── AdminNav.tsx                # Admin navigation
│       ├── AppsTable.tsx               # Apps list table
│       ├── AppEditForm.tsx             # App edit form
│       ├── TagsTable.tsx               # Tags list table
│       ├── TagEditForm.tsx             # Tag edit form
│       ├── QueueTable.tsx              # Queue list table
│       ├── UsersTable.tsx              # Users list table
│       └── DashboardStats.tsx          # Dashboard statistics
├── lib/
│   └── api/
│       └── admin-api.ts                # Admin API functions
└── hooks/
    └── useAdminAuth.ts                 # Authorization hook
```

### Authorization Implementation

1. **Create Authorization Hook**:
```typescript
// hooks/useAdminAuth.ts
export function useAdminAuth() {
  // Check if user is authorized to access admin
  // Return: { isAuthorized: boolean, isLoading: boolean }
}
```

2. **Authorization Check**:
- Create API endpoint or Strapi policy to check authorization
- Store authorization status in session or check on each request
- Implement middleware for `/admin/*` routes

3. **Strapi Policy**:
```typescript
// src/api/admin/policies/is-admin.ts
export default async (policyContext, config, { strapi }) => {
  // Check if member is authorized (whitelist or role check)
  // Return true/false
};
```

### API Client

Create centralized API client for admin operations:

```typescript
// lib/api/admin-api.ts
export const AdminAPI = {
  // Apps
  getApps: (params) => Promise<App[]>,
  getApp: (id) => Promise<App>,
  createApp: (data) => Promise<App>,
  updateApp: (id, data) => Promise<App>,
  deleteApp: (id) => Promise<void>,
  
  // Tags
  getTags: () => Promise<Tag[]>,
  getTag: (id) => Promise<Tag>,
  createTag: (data) => Promise<Tag>,
  updateTag: (id, data) => Promise<Tag>,
  deleteTag: (id) => Promise<void>,
  
  // Queue
  getQueueItems: (params) => Promise<QueueItem[]>,
  updateQueueItem: (id, data) => Promise<QueueItem>,
  deleteQueueItem: (id) => Promise<void>,
  
  // Users
  getUsers: (params) => Promise<Member[]>,
  getUser: (id) => Promise<Member>,
  
  // Upload
  uploadImage: (file) => Promise<Media>,
};
```

### Form Handling

- Use React Hook Form for form management
- Implement validation with Zod or Yup
- Handle file uploads with FormData
- Show loading states during submission

### State Management

- Use React Server Components where possible
- Use client components only when necessary (forms, interactions)
- Consider Zustand or React Context for global state (authorization status, column preferences)

---

## Open Questions

### To Be Determined (TBD)

1. **Dashboard Statistics**:
   - What specific statistics should be displayed?
   - Should statistics be real-time or cached?
   - What time range for "recent" activity?

2. **Apps Sorting Options**:
   - What sorting options beyond "name" are needed?
   - Multi-column sorting required?

3. **Apps Filter Options**:
   - What filters are essential vs. nice-to-have?
   - Should filters be saved as presets?

4. **Authorization Method**:
   - Which authorization approach (whitelist, role field, admin roles)?
   - How to manage authorized user list?

5. **Image Upload**:
   - Image cropping/resizing before upload?
   - Maximum file size limits?
   - Supported image formats?

6. **Rich Text Editor**:
   - Which editor to use for Strapi blocks compatibility?
   - Custom block types needed?

7. **Queue Processing**:
   - Automated processing workflow or manual only?
   - Integration with n8n workflow needed?

8. **User Management**:
   - What fields can be edited by admins?
   - Should admin be able to change user passwords?

9. **Localization**:
   - Admin UI language (always English or localized)?
   - Translation keys for admin section?

10. **Performance**:
    - Expected number of apps/users?
    - Pagination size defaults?

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Set up authorization mechanism (whitelist or role)
- [ ] Create admin route structure
- [ ] Add admin link to user menu (conditional)
- [ ] Create admin layout with navigation
- [ ] Implement authorization check hook/middleware

### Phase 2: Dashboard
- [ ] Create dashboard page
- [ ] Implement statistics API calls
- [ ] Create stat cards component
- [ ] Create recent apps list

### Phase 3: Apps Management
- [ ] Create apps list page
- [ ] Implement data table with sorting, filtering, pagination
- [ ] Create app edit form
- [ ] Implement image upload
- [ ] Implement uniqueness validation
- [ ] Create delete confirmation dialog
- [ ] Implement column customization (drag-and-drop)

### Phase 4: Queue Management
- [ ] Create queue list page
- [ ] Implement queue item edit form
- [ ] Implement status filtering and updates

### Phase 5: Tags Management
- [ ] Create tags list page
- [ ] Create tag edit/create form
- [ ] Implement app count display

### Phase 6: Users Management
- [ ] Create users list page
- [ ] Implement user detail view
- [ ] Add user filtering and search

### Phase 7: Polish
- [ ] Error handling and loading states
- [ ] Responsive design testing
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Documentation

---

## Notes

- All dates should be displayed in user's timezone or UTC with clear indication
- Consider implementing audit logging for admin actions (who changed what, when)
- Test with large datasets to ensure performance
- Consider adding export functionality (CSV/JSON) for apps list
- Consider adding bulk import functionality for apps

---

## Revision History

- **v1.0** (YYYY-MM-DD): Initial requirements document created

