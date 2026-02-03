# Quick Reference - Backend-Frontend Integration

## 🔐 Authentication Flow

### Registration
```javascript
// Frontend
apiClient.register(username, email, password, displayName)

// Backend validates:
- Username: 3-30 chars, alphanumeric + underscore
- Email: valid email format
- Password: 6+ chars, hashed with bcrypt
- DisplayName: 2+ chars

// Returns:
{ success: true, user: { _id, username, email, displayName, ... } }
```

### Login
```javascript
// Frontend
apiClient.login(email, password)

// Backend:
- Validates email exists
- Compares password hash
- Generates JWT (7-day expiration)
- Sets httpOnly cookie

// Returns:
{ success: true, user: { _id, username, email, ... } }

// Cookie automatically sent in all future requests
```

### Logout
```javascript
// Frontend
apiClient.logout()

// Backend:
- Clears httpOnly cookie
- Returns success

// Result:
- No more authenticated requests
- Auto-redirect to login on 401
```

---

## 👤 User Model

```javascript
{
  _id: ObjectId,
  username: String (3-30, unique, alphanumeric),
  email: String (unique),
  password: String (hashed),
  displayName: String (2+),
  bio: String,
  avatar: {
    url: String,
    filename: String
  },
  coverImage: {
    url: String,
    filename: String,
    width: Number,
    height: Number
  },
  followers: [ObjectId],
  following: [ObjectId],
  followersCount: Number,
  followingCount: Number,
  projectsCount: Number,
  appreciationsReceived: Number,
  projectViews: Number,
  savedProjects: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📁 Project Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  slug: String (unique, auto-generated),
  owner: ObjectId (ref: User),
  description: String (2000 max),
  coverImage: {
    url: String,
    filename: String,
    width: Number,
    height: Number,
    dominantColor: String (hex)
  },
  modules: [
    {
      type: 'image'|'text'|'video'|'embed',
      content: String,
      image: {
        url: String,
        filename: String,
        width: Number,
        height: Number
      },
      caption: String,
      order: Number
    }
  ],
  appreciations: [ObjectId],
  appreciationsCount: Number,
  views: Number,
  viewedBy: [
    { userId: ObjectId, ip: String, timestamp: Date }
  ],
  published: Boolean,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Quick Reference

### Auth Endpoints
```javascript
POST   /api/auth/register       // Create account
POST   /api/auth/login          // Get cookie
POST   /api/auth/logout         // Clear cookie
GET    /api/auth/me             // Check auth
```

### User Endpoints
```javascript
GET    /api/users                    // List users
GET    /api/users/{username}         // Get profile
PUT    /api/users/profile            // Update own
POST   /api/users/{userId}/follow    // Follow
DELETE /api/users/{userId}/follow    // Unfollow
```

### Project Endpoints
```javascript
GET    /api/projects                      // List (paginated)
POST   /api/projects                      // Create
GET    /api/projects/{slug}               // Get one
PUT    /api/projects/{id}                 // Update
DELETE /api/projects/{id}                 // Delete
POST   /api/projects/{id}/appreciate      // Like
DELETE /api/projects/{id}/appreciate      // Unlike
POST   /api/projects/{id}/save            // Save
DELETE /api/projects/{id}/save            // Unsave
POST   /api/projects/{id}/view            // Record view
```

### Upload Endpoints
```javascript
POST   /api/upload/avatar         // Single file
POST   /api/upload/cover          // Single file
POST   /api/upload/project        // Multiple (20 max)
DELETE /api/upload                // Delete file
```

---

## 🚀 Frontend API Client Usage

```javascript
import apiClient from '@/services/apiClient';

// Authentication
await apiClient.register(username, email, password, displayName);
await apiClient.login(email, password);
await apiClient.logout();
const profile = await apiClient.getProfile();

// Users
const user = await apiClient.getUserByUsername('john');
await apiClient.followUser(userId);
await apiClient.unfollowUser(userId);

// Projects
const projects = await apiClient.getAllProjects(1, 12, { filters });
const project = await apiClient.getProjectBySlug('my-project');
await apiClient.createProject(data);
await apiClient.appreciateProject(projectId);
await apiClient.saveProject(projectId);

// Uploads
const form = new FormData();
form.append('file', fileInput.files[0]);
await apiClient.uploadAvatar(form);
```

---

## 🎨 Component Field Mapping

### User Display
```javascript
// OLD (broken)
${user.firstName} ${user.lastName}

// NEW (working)
${user.displayName}
@${user.username}
```

### Project Display
```javascript
// OLD (broken)
project.imageTitle         // → NEW: project.title
project.images[0]          // → NEW: project.coverImage.url
project.likes              // → NEW: project.appreciationsCount
project.category           // → NEW: project.description
project.views              // → NEW: project.views
```

### Profile Stats
```javascript
// OLD (broken)
followers: random        // → NEW: user.followersCount
following: random        // → NEW: user.followingCount
likes: computed          // → NEW: appreciationsCount (project)

// Aggregation
totalAppreciations = projects.reduce((sum, p) => sum + p.appreciationsCount, 0)
totalViews = projects.reduce((sum, p) => sum + p.views, 0)
```

---

## ✅ Critical Checklist

### Before Deployment
- [ ] Backend running on localhost:5000
- [ ] MongoDB connected
- [ ] Seed data loaded
- [ ] Frontend running on localhost:3000
- [ ] No console errors
- [ ] No network errors (F12 → Network)

### Registration Test
- [ ] Can create account with valid username
- [ ] Username validation works (3-30 chars)
- [ ] Password strength indicator visible
- [ ] Success message appears
- [ ] Modal closes after registration

### Login Test
- [ ] Can login with email/password
- [ ] httpOnly cookie set (check DevTools)
- [ ] User context updates
- [ ] Redirected to home
- [ ] Navbar shows username

### Profile Test
- [ ] My Profile loads without errors
- [ ] Shows displayName and @username
- [ ] Avatar and cover images display
- [ ] Stats are calculated correctly
- [ ] Projects listed with correct fields

### Session Test
- [ ] Page refresh maintains login
- [ ] User data persists
- [ ] Profile still shows after refresh
- [ ] Logout clears session
- [ ] Login modal appears on logout

---

## 🐛 Common Issues & Fixes

### "User not found" on login
```
Issue: Database connection problem
Fix: 
1. Check MongoDB running (mongod)
2. Check MONGODB_URI in .env
3. Check database name matches
```

### "Cannot read property of undefined"
```
Issue: Trying to access deleted field
Example: user.firstName (now user.displayName)
Fix: Search all files for old field names, replace with new
```

### Cookies not being sent
```
Issue: Missing credentials: 'include'
Fix: All fetch calls must have:
  { credentials: 'include' }
```

### "401 Unauthorized" on protected routes
```
Issue: No valid httpOnly cookie
Cause: 
1. Not logged in
2. Session expired (7 days)
3. Backend restarted (server-side cookie invalid)
Fix: Login again
```

### Avatar/Cover not displaying
```
Issue: Wrong image path
Check: user.avatar.url (not user.avatarUrl)
Check: user.coverImage.url (not user.cover)
```

---

## 📊 Data Flow Diagram

```
User Registration
├─ Form input validation (frontend)
├─ POST /api/auth/register
├─ Backend: hash password, create user
├─ Response: { user: {...} }
└─ Store in context.user

User Login
├─ Form input validation
├─ POST /api/auth/login
├─ Backend: verify, generate JWT
├─ Set-Cookie: Authorization=<jwt>; HttpOnly
├─ Response: { user: {...} }
├─ Store in context.user
└─ All future requests auto-include cookie

Protected Request
├─ fetch(..., { credentials: 'include' })
├─ Browser auto-includes Authorization cookie
├─ Backend extracts from req.cookies
├─ Validates JWT
├─ Attaches user to req.user
├─ Proceeds with request
└─ Return data

Page Refresh
├─ App mounts
├─ useEffect in Context
├─ GET /api/auth/me
├─ httpOnly cookie auto-sent
├─ Backend returns user data
├─ Context updates with user
└─ Protected content visible
```

---

## 🔗 Important Links

**Backend:**
- Server: http://localhost:5000
- MongoDB: mongodb://localhost:27017/behance_clone
- Documentation: `/backend/INTEGRATION_FIXES.md`

**Frontend:**
- App: http://localhost:3000
- API Base: http://localhost:5000/api
- ApiClient: `/frontend/src/services/apiClient.js`

**Database:**
- Seed Users: See `/backend/seeds/seedData.js`
- Collections: users, projects, comments, collections, notifications

---

## 🎯 Next Steps

1. **Test Current Setup**
   ```bash
   npm run dev  # Frontend
   npm run dev  # Backend (in another terminal)
   # Test register and login flows
   ```

2. **Update HomePage**
   - Change `/cards/all` → `/projects`
   - Update field mappings
   - Test project listing

3. **Add CreateProjectPage**
   - Form for title, description
   - Image upload for cover
   - Module system (image, text, video)

4. **Complete Content Component**
   - Update project display
   - Add appreciate functionality
   - Add comments

5. **Add Error Handling**
   - Catch 401 responses
   - Show re-login prompt
   - Handle network errors

---

**Last Updated:** 2024
**Status:** Integration 70% Complete
**Ready for:** Testing and additional component development
