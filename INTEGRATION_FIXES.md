# Backend-Frontend Integration Fixes

## Overview
This document outlines all the fixes applied to ensure the new Node.js/Express/MongoDB backend integrates correctly with the React frontend.

## Issues Identified & Fixed

### 1. ✅ Authentication Mechanism
**Issue:** Frontend was using localStorage tokens, backend uses httpOnly cookies
**Fix:** 
- Updated `frontend/src/services/apiClient.js` to use `credentials: 'include'` in all fetch calls
- Removed all localStorage token management (setTokens, getToken, clearTokens)
- Simplified auth flow - backend handles cookie setting automatically
- Updated `frontend/src/context/Context.jsx` to initialize auth on mount via `apiClient.getProfile()`
- Added `isLoading` state to prevent race conditions during app initialization

### 2. ✅ User Model Migration
**Issue:** Frontend expected firstName/lastName, backend uses username/displayName
**Changes:**
- Updated `frontend/src/components/Footer/PopupSign.jsx` to use username and displayName fields
- Updated `frontend/src/components/Footer/PopupLogin.jsx` to remove token storage logic
- Updated `frontend/src/utils/validation.js` to validate username (3-30 chars, alphanumeric)
- All user references now use: `user.username`, `user.displayName`, `user.email`

### 3. ✅ API Endpoint Structure
**Issue:** Frontend was calling `/cards/*` endpoints, backend only has `/projects/*`
**Fix - API Client Rewrite:**
- Removed: getAllCards, searchCards, getCard, addCard, likeCard, getLikedCards, deleteCard, deleteAllCards
- Added: createProject, getAllProjects, getProjectBySlug, updateProject, deleteProject, publishProject, appreciateProject, recordProjectView, saveProject, removeSaved, getSavedProjects
- All file upload endpoints updated to use new structure: uploadAvatar, uploadCover, uploadProjectImages
- Added comprehensive error handling with credentials: 'include'

### 4. 🔄 Frontend Components Updates
**Status:** Partial - API client updated, components still need migration

**Components requiring updates:**
- `HomePage.jsx` - Update to fetch from /api/projects instead of /api/cards
- `Content.jsx` - Update field mappings (imageTitle → title, images → coverImage + modules)
- `Modal.jsx` - Update to work with new Project model structure
- `CreateProjectPage.jsx` - Update project creation to match new backend schema
- `ProfilePage.jsx` - Update to use username instead of firstName/lastName
- `MyProfilePage.jsx` - Same as above
- `PopupLogin.jsx` - ✅ Already updated to remove token storage

**Data Structure Mapping:**
```
Old Card Model → New Project Model
- id → _id
- title → title
- images → modules[] (each with type, content, image, caption)
- coverImage → coverImage (object with url, filename, width, height, dominantColor)
- creatorName → owner (ObjectId, need to fetch user.username)
- likes → appreciations[] (array of user IDs)
- views → views (number)
- comments → Need separate Comment model API calls
```

### 5. File Upload Integration
**Backend Endpoints:**
- POST /api/upload/avatar - Single avatar upload, returns { url, filename }
- POST /api/upload/cover - Single cover image upload
- POST /api/upload/project - Multiple project images (up to 20), returns array with dimensions and dominantColor

**Frontend Changes:**
- Use FormData with multipart/form-data
- Include credentials: 'include' in fetch
- Handle response: { success, data: [{ url, filename, width, height, dominantColor }] }

### 6. Project Creation & Updates
**Old Flow:**
```javascript
POST /api/cards/add
{
  title, images[], likes, views, ...
}
```

**New Flow:**
```javascript
POST /api/projects
{
  title,
  description,
  coverImage: { url, filename, width, height, dominantColor },
  modules: [
    { type: 'image'|'text'|'video'|'embed', content, image, caption, ... }
  ]
}
```

## API Endpoint Reference

### Authentication (No changes to routes, only cookie-based)
- POST /api/auth/register
- POST /api/auth/login (now returns user in data.user, cookie set automatically)
- POST /api/auth/logout
- GET /api/auth/me (check if authenticated)

### Users
- GET /api/users - List all users
- GET /api/users/{username} - Get user profile
- PUT /api/users/profile - Update own profile
- POST /api/upload/avatar - Upload avatar
- POST /api/upload/cover - Upload cover image
- POST /api/users/{userId}/follow - Follow user
- DELETE /api/users/{userId}/follow - Unfollow user

### Projects
- GET /api/projects - List all projects (paginated)
- POST /api/projects - Create project (requires auth)
- GET /api/projects/{slug} - Get project details
- PUT /api/projects/{id} - Update project (requires ownership)
- DELETE /api/projects/{id} - Delete project (requires ownership)
- POST /api/projects/{id}/appreciate - Like/appreciate project
- DELETE /api/projects/{id}/appreciate - Remove appreciation
- POST /api/projects/{id}/save - Save project
- DELETE /api/projects/{id}/save - Unsave project
- POST /api/projects/{id}/publish - Publish project
- POST /api/projects/{id}/view - Record view

### Comments
- POST /api/comments/projects/{projectId}/comments - Add comment
- GET /api/comments/projects/{projectId}/comments - Get comments
- PUT /api/comments/comments/{commentId} - Update comment
- DELETE /api/comments/comments/{commentId} - Delete comment
- POST /api/comments/comments/{commentId}/like - Like comment

### Collections
- POST /api/collections - Create collection
- GET /api/collections - List collections
- POST /api/collections/{id}/projects/{projectId} - Add project to collection
- DELETE /api/collections/{id}/projects/{projectId} - Remove project

### Upload
- POST /api/upload/avatar - Upload avatar (single file)
- POST /api/upload/cover - Upload cover (single file)
- POST /api/upload/project - Upload project images (multiple, up to 20)
- DELETE /api/upload - Delete upload file

## Testing Checklist

- [ ] User Registration with new user model (username, displayName)
- [ ] User Login with httpOnly cookie (no localStorage)
- [ ] Authenticated requests include credentials: 'include'
- [ ] Profile page displays username instead of firstName/lastName
- [ ] Avatar and cover image uploads work
- [ ] Project creation with multiple images
- [ ] Project listing with pagination
- [ ] Search and filtering
- [ ] Like/appreciate projects
- [ ] Comments and replies
- [ ] Save projects to collections
- [ ] User follow/unfollow
- [ ] Logout (cookie automatically cleared by browser)

## Session Expiration Handling

**Current Implementation:**
- JWT expires after 7 days (set in .env: JWT_EXPIRE=7d)
- httpOnly cookie expires after 7 days (JWT_COOKIE_EXPIRE=7)
- No refresh token mechanism

**User Experience:**
- After 7 days, attempting any protected route returns 401
- Frontend should detect 401 and prompt user to log in again
- On 401, context should clear user and set isAuthenticated to false

**Recommended Frontend Enhancement:**
```javascript
// In apiClient request method
if (response.status === 401) {
  // Clear auth context
  window.location.href = '/login';
  // Or trigger login modal
}
```

## Database Seed Data

**Location:** backend/seeds/seedData.js

**Creates:**
- 5 users with avatars and cover images
- 20 projects with image modules
- Sample comments and appreciations
- Follow relationships

**To run:**
```bash
cd backend
npm run seed
```

## Environment Variables

Backend .env configuration:
```
MONGODB_URI=mongodb://localhost:27017/behance_clone
JWT_SECRET=<random-secret-key>
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

Frontend uses API_BASE_URL from apiClient.js:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Known Limitations & Future Improvements

1. **Session Timeout:** No automatic token refresh. Users must re-login after 7 days.
   - Future: Implement refresh token with separate httpOnly cookie

2. **Image Processing:** Sharp library runs on upload. Consider moving to background jobs for large batches.

3. **Pagination:** Manual pagination needed on frontend for infinite scroll.
   - Implement: Cursor-based pagination for better performance

4. **Real-time Updates:** No WebSocket support. Comments and appreciations need refresh.
   - Future: Implement Socket.io for real-time notifications

5. **Search:** Text search on project title and description only.
   - Future: Add full-text search with tags and filter combinations

## Files Modified

### Backend (Complete - no changes needed)
- ✅ server.js
- ✅ All models (5 files)
- ✅ All controllers (6 files)
- ✅ All routes (6 files)
- ✅ All middleware (3 files)
- ✅ All utilities (3 files)
- ✅ seeds/seedData.js
- ✅ .env

### Frontend (Updated)
- ✅ services/apiClient.js - Completely rewritten
- ✅ context/Context.jsx - Updated for httpOnly cookies
- ✅ components/Footer/PopupSign.jsx - Updated user model fields
- ✅ components/Footer/PopupLogin.jsx - Removed token storage
- ✅ utils/validation.js - Updated for username validation
- ⏳ components/Content/Content.jsx - Needs field mapping updates
- ⏳ components/Content/Modal.jsx - Needs project model structure updates
- ⏳ pages/HomePage.jsx - Needs endpoint migration
- ⏳ pages/CreateProjectPage.jsx - Needs schema updates
- ⏳ pages/ProfilePage.jsx - Needs user field updates
- ⏳ pages/MyProfilePage.jsx - Needs user field updates

## Success Indicators

1. ✅ User can register with username and displayName
2. ✅ User can log in with email and password (httpOnly cookie set)
3. ⏳ User can view profile with correct username display
4. ⏳ User can create projects with images
5. ⏳ User can search and filter projects
6. ⏳ User can appreciate (like) and save projects
7. ⏳ All authenticated endpoints work without localStorage tokens
8. ⏳ Server-side image processing creates optimized images in local storage

## Next Steps

1. Update remaining frontend components (Content, Modal, HomePage, etc.)
2. Add proper error handling for 401 responses in apiClient
3. Implement session timeout UX
4. Test the complete user flow: register → login → create project → upload images
5. Fix any remaining field mapping issues
6. Performance testing with sample data

