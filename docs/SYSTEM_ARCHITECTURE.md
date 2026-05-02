# CrisisConnect — System Architecture Document

**Version:** 2.0 | **Date:** April 29, 2026

---

## 1. Architecture Overview

CrisisConnect follows a **modular, component-based frontend architecture** built with React and Vite. The application is structured as a Single-Page Application (SPA) with lazy-loaded routes, centralized state management via 4 React Context providers, and a clear separation of concerns across feature directories.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              PRESENTATION LAYER                   │   │
│  │  ┌─────────┐  ┌──────────┐  ┌────────────────┐  │   │
│  │  │  Pages   │  │Components│  │  Layout (Nav/  │  │   │
│  │  │(Landing, │  │ (Common) │  │   Footer)      │  │   │
│  │  │Dash,Map, │  │          │  │                │  │   │
│  │  │Community)│  │          │  │                │  │   │
│  │  └────┬─────┘  └────┬─────┘  └───────┬────────┘  │   │
│  └───────┼──────────────┼────────────────┼───────────┘   │
│          │              │                │               │
│  ┌───────▼──────────────▼────────────────▼───────────┐   │
│  │             STATE MANAGEMENT LAYER                 │   │
│  │  ┌─────────────┐  ┌──────────────────────────┐    │   │
│  │  │ AuthContext  │  │ NotificationContext       │    │   │
│  │  │ (user, role) │  │ (notifs, toasts)          │    │   │
│  │  └─────────────┘  └──────────────────────────┘    │   │
│  │  ┌─────────────────┐  ┌───────────────────────┐   │   │
│  │  │CommunityContext  │  │ ReportContext          │   │   │
│  │  │(communities,     │  │ (reports, rescue teams)│   │   │
│  │  │ lifecycle mgmt)  │  │                        │   │   │
│  │  └─────────────────┘  └───────────────────────┘   │   │
│  └───────┬───────────────────────────────────────────┘   │
│          │                                               │
│  ┌───────▼───────────────────────────────────────────┐   │
│  │                SERVICE LAYER                       │   │
│  │  ┌──────────┐ ┌───────────┐ ┌──────────────────┐ │   │
│  │  │ Firebase  │ │Geolocation│ │  News Service    │ │   │
│  │  │ (planned) │ │  Service  │ │ (GNews API)      │ │   │
│  │  └──────────┘ └───────────┘ └──────────────────┘ │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │  Custom Hooks (useRequests, useGeolocation)│   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  └───────┬───────────────────────────────────────────┘   │
│          │                                               │
│  ┌───────▼───────────────────────────────────────────┐   │
│  │                 DATA LAYER                         │   │
│  │  ┌──────────────┐ ┌──────────┐ ┌──────────────┐  │   │
│  │  │ Mock Data     │ │Constants │ │  Utilities   │  │   │
│  │  │(requests,     │ │(crisis/  │ │(formatters,  │  │   │
│  │  │ communities,  │ │ help)    │ │ geo calc)    │  │   │
│  │  │ rescue teams, │ │          │ │              │  │   │
│  │  │ news)         │ │          │ │              │  │   │
│  │  └──────────────┘ └──────────┘ └──────────────┘  │   │
│  └───────────────────────────────────────────────────┘   │
│                                                          │
│  ┌───────────────────────────────────────────────────┐   │
│  │              EXTERNAL SERVICES                     │   │
│  │  Geolocation │ CartoDB │ Google Fonts │ GNews API │   │
│  └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
src/
├── App.jsx                  # Root component with Router + Routes
├── main.jsx                 # Entry point (ReactDOM.createRoot)
│
├── pages/                   # Feature-based page components
│   ├── Landing/             # Public landing + crisis report form + CSS
│   ├── Auth/                # Login, Register + CSS
│   ├── Dashboard/           # VictimDashboard, VolunteerDashboard + CSS
│   ├── Admin/               # AdminDashboard + CSS
│   ├── Map/                 # CrisisMap + CSS
│   ├── PreAlerts/           # PreAlerts + CSS
│   └── Community/           # CommunityHub + CSS
│
├── components/              # Shared reusable components
│   ├── common/              # LoadingSpinner, Modal, RequestCard,
│   │                        # StatCounter, StatusBadge
│   ├── layout/              # Navbar/, Footer/
│   └── index.js             # Barrel export
│
├── context/                 # React Context providers
│   ├── AuthContext.jsx       # Authentication state
│   ├── NotificationContext.jsx # Notifications + toasts
│   ├── CommunityContext.jsx  # Community lifecycle management
│   ├── ReportContext.jsx     # Crisis reports + rescue team finder
│   └── index.js
│
├── hooks/                   # Custom React hooks
│   ├── useGeolocation.js    # GPS position hook
│   ├── useRequests.js       # SOS request CRUD hook
│   └── index.js
│
├── services/                # External service integrations
│   ├── firebase.js          # Firebase SDK init (demo)
│   ├── geolocation.js       # Browser Geolocation API wrapper
│   ├── newsService.js       # GNews API + mock fallback
│   └── index.js
│
├── routes/                  # Routing configuration
│   ├── routeConfig.js       # Centralized route definitions
│   ├── ProtectedRoute.jsx   # RBAC route guard
│   └── index.js
│
├── data/                    # Mock data for demo mode
│   ├── mockAlerts.js        # Pre-alerts, weather
│   ├── mockCommunities.js   # Communities, INDIAN_STATES, RESOURCE_TYPES
│   ├── mockNews.js          # Fallback news items (12)
│   ├── mockNotifications.js # Sample notifications
│   ├── mockRequests.js      # SOS request samples
│   ├── mockRescueTeams.js   # 12 rescue teams + RESCUE_TEAM_TYPES
│   ├── mockStats.js         # Dashboard statistics
│   ├── mockUsers.js         # Volunteer user profiles
│   └── index.js
│
├── constants/               # Application constants
│   ├── crisisTypes.js       # CRISIS_TYPES, HELP_TYPES enums
│   ├── volunteerTypes.js    # Volunteer categories
│   └── index.js
│
├── utils/                   # Pure utility functions
│   ├── formatters.js        # formatTimeAgo, etc.
│   ├── geo.js               # Distance calculations
│   └── index.js
│
├── styles/                  # CSS Architecture
│   ├── variables.css        # Design tokens
│   ├── reset.css            # Browser reset
│   ├── typography.css       # Font styles
│   ├── layout.css           # Layout utilities
│   ├── components.css       # Shared component styles
│   ├── animations.css       # Keyframe animations
│   ├── responsive.css       # Media queries
│   ├── vendor.css           # Leaflet overrides
│   └── index.css            # CSS barrel import
│
└── assets/                  # Static assets
```

---

## 3. Component Architecture

### 3.1 Component Hierarchy

```
App.jsx
├── BrowserRouter
│   └── AppRoutes
│       ├── Navbar (role-aware navigation)
│       ├── <Suspense fallback={LoadingSpinner}>
│       │   └── Routes
│       │       ├── / → Landing OR Dashboard redirect
│       │       ├── /login → Login (guest only)
│       │       ├── /register → Register (guest only)
│       │       ├── /victim → ProtectedRoute → VictimDashboard
│       │       ├── /volunteer → ProtectedRoute → VolunteerDashboard
│       │       ├── /admin → ProtectedRoute → AdminDashboard
│       │       ├── /map → CrisisMap (public)
│       │       ├── /pre-alerts → PreAlerts (public)
│       │       ├── /community → CommunityHub (public)
│       │       └── /* → Redirect to /
│       └── Footer (conditional, hidden on /map)
```

### 3.2 Provider Wrapping (main.jsx)

```
<AuthProvider>
  <NotificationProvider>
    <CommunityProvider>
      <ReportProvider>
        <App />
      </ReportProvider>
    </CommunityProvider>
  </NotificationProvider>
</AuthProvider>
```

---

## 4. State Management

### 4.1 AuthContext
- **State:** `user` (object | null), `loading` (boolean)
- **Actions:** `login(email, password)`, `register(userData)`, `logout()`, `updateProfile(updates)`
- **Persistence:** localStorage key `crisisconnect_user`
- **Role Detection:** Email pattern matching (demo mode)

### 4.2 NotificationContext
- **State:** `notifications[]`, `toasts[]`, `unreadCount`
- **Actions:** `addNotification()`, `markAsRead(id)`, `markAllAsRead()`, `showToast(msg, type, duration)`
- **Toast Types:** success (green), error (red), warning (orange), info (blue)
- **Notification Types:** alert, request, update, community, prealert
- **Auto-Dismiss:** 4 second default via `setTimeout`

### 4.3 CommunityContext
- **State:** `communities[]` (persisted to localStorage)
- **Derived:** `activeCommunities`, `resolvedCommunities`
- **Actions:** `createCommunity()`, `joinCommunity()`, `leaveCommunity()`, `raiseResourceRequest()`, `fulfillResource()`, `closeCommunity()`, `getCommunity()`
- **Persistence:** localStorage key `crisisconnect_communities`
- **Lifecycle:** Active → Resolved (with proof photos)

### 4.4 ReportContext
- **State:** `reports[]` (persisted to localStorage)
- **Actions:** `submitReport(data)`, `getNearbyTeams(lat, lng, maxDistance)`
- **Persistence:** localStorage key `crisisconnect_reports`
- **Distance Calc:** Haversine formula for rescue team proximity (default 50km radius)

### 4.5 useRequests Hook (Local State)
- **State:** `requests[]`
- **Derived:** `pending`, `active`, `completed` (filtered arrays)
- **Actions:** `addRequest()`, `updateRequest()`, `acceptRequest()`, `completeRequest()`, `getByStatus()`
- **Lifecycle:** `pending → accepted → active → completed`

### 4.6 useGeolocation Hook
- **State:** `location` (lat/lng), `loading`, `error`
- **Fallback:** Delhi coordinates (28.6139, 77.2090)
- **Options:** High accuracy, 10s timeout, 60s max age

---

## 5. Routing Architecture

### 5.1 Route Categories

```
┌──────────────┬─────────────────┬──────────────────┐
│  PUBLIC       │  GUEST-ONLY     │  PROTECTED       │
│  (any user)   │  (unauth only)  │  (role-based)    │
├──────────────┼─────────────────┼──────────────────┤
│  /map         │  /login          │  /victim  [victim]│
│  /pre-alerts  │  /register       │  /volunteer [vol] │
│  /community   │                  │  /admin   [admin] │
└──────────────┴─────────────────┴──────────────────┘
```

### 5.2 Route Protection Flow

```
User requests protected route
  → ProtectedRoute checks auth
    → Not logged in? → Redirect to /login
    → Logged in but wrong role? → Redirect to /
    → Authorized? → Render component
```

### 5.3 Code Splitting
All page components are lazy-loaded via `React.lazy()` + dynamic `import()`:
```
const Landing = lazy(() => import('../pages/Landing/Landing'));
const CrisisMap = lazy(() => import('../pages/Map/CrisisMap'));
const CommunityHub = lazy(() => import('../pages/Community/CommunityHub'));
// ...etc (9 lazy-loaded components)
```

---

## 6. Data Flow Architecture

### 6.1 Public Crisis Report Flow

```
Guest (Landing Page)                ReportContext              Rescue Teams
     │                                  │                          │
     │ 1. Fill name, phone              │                          │
     │ 2. Upload geo-tagged photo       │                          │
     │ 3. Click "Auto-detect location"  │                          │
     │──────────────────────────────►│  │                          │
     │                               │  4. getCurrentPosition()    │
     │◄──────────────────────────────│  │                          │
     │ 5. GPS coordinates shown      │  │                          │
     │                               │  6. getNearbyTeams(lat,lng)│
     │                               │──────────────────────────►│
     │                               │  7. Haversine distance     │
     │◄──────────────────────────────│  8. Sorted by proximity   │
     │ 9. Nearby teams displayed     │                            │
     │ 10. Fill address (state/city) │                            │
     │ 11. Submit report             │                            │
     │──────────────────────────────►│                            │
     │                               │ 12. submitReport()         │
     │ 13. Success + Reference ID    │ 13. Persist to localStorage│
     │◄──────────────────────────────│                            │
```

### 6.2 SOS Request Flow (Authenticated)

```
Victim Dashboard                     System                    Volunteer Dashboard
     │                                 │                              │
     │ 1. Click "SEND SOS"             │                              │
     │──────────────────────►│         │                              │
     │                       │ 2. Open Modal                          │
     │ 3. Fill form + submit │         │                              │
     │──────────────────────►│         │                              │
     │                       │ 4. addRequest()                        │
     │                       │ 5. showToast() + addNotification()     │
     │                       │──────────────────────────────►│        │
     │                       │    6. Request in "Incoming" tab        │
     │                       │    7. Volunteer clicks "Accept"        │
     │                       │◄─────────────────────────────│         │
     │                       │ 8. acceptRequest(id, volId)            │
     │ 9. Status → accepted  │    10. Moves to "Active" tab          │
     │                       │    11. Volunteer clicks "Complete"     │
     │                       │◄─────────────────────────────│         │
     │ 12. Status → completed│    13. Moves to "Completed" tab       │
```

### 6.3 Community Lifecycle Flow

```
Volunteer                    CommunityContext                  Other Users
    │                              │                               │
    │ 1. Create Community          │                               │
    │─────────────────────────►│  │                               │
    │                           │ 2. createCommunity()             │
    │                           │ 3. Persist to localStorage       │
    │◄─────────────────────────│  │                               │
    │                           │  │   4. Browse communities       │
    │                           │  │◄──────────────────────────────│
    │                           │  │   5. Click "Join"             │
    │                           │  │◄──────────────────────────────│
    │                           │ 6. joinCommunity(id, user)       │
    │                           │  │   7. Member added             │
    │ 8. Raise Resource Request │  │                               │
    │─────────────────────────►│  │                               │
    │                           │ 9. raiseResourceRequest()        │
    │ 10. Close Community       │                                  │
    │─────────────────────────►│                                   │
    │                           │ 11. closeCommunity() + proof     │
    │                           │ 12. Status → 'resolved'          │
```

### 6.4 News Service Flow

```
Landing Page Mount → fetchCrisisNews()
  → Check cache (15min TTL)
    → Cache valid? → Return cached news
    → Cache expired? → Fetch from GNews API
      → Success? → Map articles, cache, return
      → Failure? → Return mock news fallback
```

### 6.5 Authentication Flow

```
Guest visits /
  → Landing page shown (with crisis report form)
  → Clicks "Get Started" → /register
  → Fills form (email, name, role, etc.)
  → register() → user stored in localStorage
  → Redirect to role-based dashboard

Returning user visits /
  → AuthContext reads localStorage
  → user found → redirect to getDashboardPath(user.role)
```

---

## 7. CSS Architecture

### 7.1 Design System (variables.css)
- **Theme:** Dark glassmorphism with 6 accent colors
- **Fonts:** Inter (headings), DM Sans (body)
- **Spacing:** 8px-based scale (4px to 96px)
- **Borders:** Glass effect borders with hover variants
- **Shadows:** 4 depth levels + 3 glow variants
- **Z-index:** 6-tier system (dropdown → SOS)
- **Transitions:** 4 timing presets (fast → spring)

### 7.2 Import Order (index.css)
```css
@import './variables.css';    /* 1. Design tokens */
@import './reset.css';        /* 2. Browser reset */
@import './typography.css';   /* 3. Font styles */
@import './layout.css';       /* 4. Layout utilities */
@import './components.css';   /* 5. Shared components */
@import './animations.css';   /* 6. Keyframes */
@import './responsive.css';   /* 7. Media queries */
@import './vendor.css';       /* 8. Leaflet overrides */
```

### 7.3 Component-Level CSS
Each page directory contains its own CSS file co-located with the component:
- `Landing/Landing.css`
- `Auth/Auth.css`
- `Dashboard/Dashboard.css`
- `Admin/AdminDashboard.css`
- `Map/CrisisMap.css`
- `PreAlerts/PreAlerts.css`
- `Community/CommunityHub.css`

---

## 8. External Service Integration

### 8.1 Firebase (Planned Production)
```
Firebase SDK v12
├── Auth         → User authentication (email/password, Google)
├── Firestore    → Real-time database for SOS requests, users
└── Storage      → Photo uploads for SOS reports
```
**Current Status:** Demo mode with placeholder credentials. Initialization wrapped in try/catch.

### 8.2 GNews API (Active)
- **Endpoint:** `https://gnews.io/api/v4/search`
- **Query:** `crisis OR disaster OR flood OR earthquake OR cyclone India`
- **Params:** lang=en, country=in, max=10
- **Caching:** 15-minute in-memory cache
- **Fallback:** 12 curated mock news items (`mockNews.js`)

### 8.3 Leaflet + React-Leaflet
- **Tiles:** CartoDB Dark (`dark_all`) theme
- **Markers:** Custom `L.divIcon` with emoji-based styled markers
- **Layers:** Markers (SOS, Volunteer, Shelter) + Circles (danger radius)
- **Controls:** Zoom control, auto-center via `useMap()` hook

### 8.4 Recharts (Admin Dashboard)
- **AreaChart:** Requests over time (with gradient fills)
- **PieChart:** Requests by crisis type (donut variant)
- **LineChart:** Response time trends
- **Custom Tooltip:** Glassmorphism-styled tooltip component

---

## 9. Security Architecture

### 9.1 Route-Level Protection
```
ProtectedRoute component:
  1. Check if user is authenticated (AuthContext)
  2. Check if user.role is in allowedRoles[]
  3. Deny → redirect to /login or /
  4. Allow → render children
```

### 9.2 Session Management
- **Storage:** localStorage (`crisisconnect_user` key)
- **Hydration:** AuthContext reads on mount, sets loading=true until complete
- **Cleanup:** `logout()` removes localStorage entry and clears state

### 9.3 Data Persistence
- **Communities:** localStorage (`crisisconnect_communities`)
- **Reports:** localStorage (`crisisconnect_reports`)
- **Hydration:** Each context reads from localStorage on init with JSON.parse try/catch

### 9.4 Production Security (Planned)
- Firebase Auth with JWT tokens
- Firestore Security Rules per user role
- HTTPS enforcement
- Rate limiting on SOS submissions

---

## 10. Deployment Architecture

### 10.1 Build Pipeline
```
Source (JSX/CSS) → Vite Build (esbuild) → Static Bundle → CDN Hosting
```

### 10.2 Hosting Options
| Option | Suitability |
|--------|------------|
| Firebase Hosting | Best for Firebase backend integration |
| Vercel | Best for CI/CD and preview deployments |
| Netlify | Good for static SPA hosting |

### 10.3 Environment Configuration
```
Development:  vite dev server (HMR, port 5173)
Production:   vite build → dist/ → static hosting
```

---

*End of System Architecture Document*
