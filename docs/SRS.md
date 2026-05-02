# CrisisConnect — Software Requirements Specification (SRS)

**Version:** 2.0 | **Date:** April 29, 2026 | **Standard:** IEEE 830 Adapted

---

## 1. Introduction

### 1.1 Purpose
This SRS defines the functional and non-functional requirements for CrisisConnect, a community crisis management web application built for the HTF 3.0 Hackathon.

### 1.2 Scope
CrisisConnect is a single-page React application providing:
- Instant crisis reporting (no login required) with rescue team discovery
- Live crisis news ticker via GNews API
- SOS emergency reporting with geolocation
- Live interactive crisis map
- Proactive pre-alert notification system
- Community Hub with full lifecycle management
- Role-based dashboards (Victim, Volunteer, Admin)
- Authentication and authorization
- In-app notification system

### 1.3 Definitions & Acronyms

| Term | Definition |
|------|-----------|
| SOS | Emergency distress request submitted by an authenticated victim |
| Crisis Report | Public emergency report submitted without login |
| Pre-Alert | Proactive notification issued before a predicted crisis |
| Community Hub | Module for creating, joining, and managing crisis response communities |
| RBAC | Role-Based Access Control |
| SPA | Single-Page Application |
| NDRF | National Disaster Response Force |

### 1.4 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 (JSX) |
| Build Tool | Vite 8 |
| Routing | React Router DOM v7 |
| Maps | Leaflet + React-Leaflet v5 |
| Charts | Recharts v3 |
| Animations | Framer Motion v12 |
| Icons | Lucide React |
| News API | GNews API (free tier) |
| Backend (planned) | Firebase (Auth, Firestore, Storage) |
| Language | JavaScript (ES2024+) |
| Styling | Vanilla CSS (glassmorphism dark theme) |

---

## 2. Overall Description

### 2.1 Product Perspective
CrisisConnect is a standalone web application designed as a real-time crisis coordination platform. The MVP uses mock data with a Firebase-ready architecture for production deployment.

### 2.2 Product Functions Summary
1. Public Crisis Report Submission (no auth)
2. Nearby Rescue Team Discovery
3. Live Crisis News Ticker
4. User Registration and Authentication
5. SOS Emergency Request Creation and Management
6. Real-time Crisis Map Visualization
7. Pre-Alert Weather Warning System
8. Community Hub (create, join, manage resources, resolve)
9. Role-specific Dashboard Views
10. In-app Notification Management
11. Volunteer Availability and Task Management
12. Admin Analytics and User Management

### 2.3 User Classes

| Role | Access Level | Dashboard |
|------|-------------|-----------|
| Guest | Public | Landing page — crisis report form, news ticker |
| Victim | Standard | VictimDashboard — SOS form, request tracking |
| Volunteer | Standard | VolunteerDashboard — task queue, community creation |
| Admin | Elevated | AdminDashboard — analytics, user management |

### 2.4 Operating Environment
- **Client:** Modern web browser (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+)
- **Server:** Static hosting (Vercel, Netlify, Firebase Hosting)
- **Device:** Desktop, tablet, mobile (responsive from 360px)

---

## 3. Functional Requirements

### 3.1 Crisis Report Module — Landing Page (FR-CR)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-CR-01 | System shall allow guests to submit a crisis report without authentication | P0 |
| FR-CR-02 | System shall collect: full name, phone number | P0 |
| FR-CR-03 | System shall support geo-tagged photo upload with camera capture | P0 |
| FR-CR-04 | System shall auto-detect user's GPS coordinates | P0 |
| FR-CR-05 | System shall provide address fields: State (29 Indian states), City, Pincode | P0 |
| FR-CR-06 | System shall discover nearby rescue teams using Haversine distance (50km radius) | P0 |
| FR-CR-07 | System shall display rescue team cards with name, type, distance, and call button | P0 |
| FR-CR-08 | System shall persist the report via ReportContext | P0 |
| FR-CR-09 | System shall display success confirmation with reference ID | P0 |
| FR-CR-10 | System shall support 4 rescue team types: Fire, Ambulance, Police, NDRF | P0 |

### 3.2 News Ticker Module (FR-NEWS)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-NEWS-01 | System shall fetch live crisis news from GNews API | P0 |
| FR-NEWS-02 | System shall display news in an auto-scrolling horizontal ticker | P0 |
| FR-NEWS-03 | System shall pause auto-scroll on mouse hover | P1 |
| FR-NEWS-04 | System shall cache news for 15 minutes | P0 |
| FR-NEWS-05 | System shall fallback to 12 curated mock news items on API failure | P0 |

### 3.3 Authentication Module (FR-AUTH)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-AUTH-01 | System shall allow users to register with email, name, phone, and role selection | P0 |
| FR-AUTH-02 | System shall allow users to log in with email and password | P0 |
| FR-AUTH-03 | System shall auto-detect user role from email pattern (demo mode) | P1 |
| FR-AUTH-04 | System shall persist user session in localStorage | P0 |
| FR-AUTH-05 | System shall redirect authenticated users away from login/register pages | P0 |
| FR-AUTH-06 | System shall provide logout functionality that clears session | P0 |
| FR-AUTH-07 | System shall provide demo login buttons for Volunteer and Admin roles | P0 |

### 3.4 SOS Reporting Module (FR-SOS)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-SOS-01 | System shall present a prominent SOS button on the victim dashboard | P0 |
| FR-SOS-02 | System shall open a modal form for emergency reporting | P0 |
| FR-SOS-03 | System shall provide 8 crisis type options with icons and colors | P0 |
| FR-SOS-04 | System shall allow multi-selection of 7 help types | P0 |
| FR-SOS-05 | System shall provide a 5-level severity slider with color coding | P0 |
| FR-SOS-06 | System shall auto-attach user's GPS coordinates to the request | P0 |
| FR-SOS-07 | System shall validate: crisis type and ≥1 help type are required | P0 |
| FR-SOS-08 | System shall display toast confirmation on successful SOS submission | P0 |

### 3.5 Crisis Map Module (FR-MAP)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-MAP-01 | System shall render a full-screen Leaflet map with dark CartoDB tiles | P0 |
| FR-MAP-02 | System shall display SOS markers for active requests | P0 |
| FR-MAP-03 | System shall display volunteer markers for available volunteers | P0 |
| FR-MAP-04 | System shall display safe zone markers for shelters | P0 |
| FR-MAP-05 | System shall render danger radius circles for severity ≥ 4 | P1 |
| FR-MAP-06 | System shall provide filter pills: All, SOS, Volunteers, Safe Zones | P0 |
| FR-MAP-07 | System shall display a collapsible sidebar listing active requests | P1 |
| FR-MAP-08 | System shall show popups with details on marker click | P0 |
| FR-MAP-09 | System shall auto-center on user's current geolocation | P0 |

### 3.6 Pre-Alert Module (FR-PA)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-PA-01 | System shall display current weather conditions | P0 |
| FR-PA-02 | System shall display a 5-day weather forecast | P0 |
| FR-PA-03 | System shall display weather alert banners | P0 |
| FR-PA-04 | System shall render pre-alert cards with severity and region | P0 |
| FR-PA-05 | System shall display interactive preparation checklists per alert | P0 |
| FR-PA-06 | System shall display crisis community cards with join functionality | P1 |

### 3.7 Community Hub Module (FR-COMM)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-COMM-01 | System shall display a browseable grid of active communities | P0 |
| FR-COMM-02 | System shall support search by community name | P0 |
| FR-COMM-03 | System shall support filter by type: All, Pre-Crisis, Post-Crisis | P0 |
| FR-COMM-04 | System shall allow authenticated volunteers to create communities | P0 |
| FR-COMM-05 | System shall collect: name, type, crisis type, description, phone, location, members | P0 |
| FR-COMM-06 | System shall support auto-detect GPS for community location | P0 |
| FR-COMM-07 | System shall allow adding/removing members during creation | P0 |
| FR-COMM-08 | System shall allow authenticated users to join communities | P0 |
| FR-COMM-09 | System shall display community detail modal with members and resources | P0 |
| FR-COMM-10 | System shall allow leaders to raise resource requests (7 types × 4 urgency levels) | P0 |
| FR-COMM-11 | System shall allow leaders to close communities with proof upload | P0 |
| FR-COMM-12 | System shall display a "My Communities" tab | P1 |
| FR-COMM-13 | System shall persist communities to localStorage | P0 |

### 3.8 Dashboard Module (FR-DASH)

#### 3.8.1 Victim Dashboard
| ID | Requirement | Priority |
|----|------------|----------|
| FR-DASH-V01 | System shall display welcome header with user's name | P0 |
| FR-DASH-V02 | System shall display active geolocation coordinates | P1 |
| FR-DASH-V03 | System shall display a prominent SOS trigger button | P0 |
| FR-DASH-V04 | System shall list user's SOS requests with status | P0 |

#### 3.8.2 Volunteer Dashboard
| ID | Requirement | Priority |
|----|------------|----------|
| FR-DASH-VL01 | System shall display availability toggle | P0 |
| FR-DASH-VL02 | System shall display stats: tasks completed, active, rating | P0 |
| FR-DASH-VL03 | System shall provide tabbed view: Incoming, Active, Completed | P0 |
| FR-DASH-VL04 | System shall allow accepting and completing requests | P0 |

#### 3.8.3 Admin Dashboard
| ID | Requirement | Priority |
|----|------------|----------|
| FR-DASH-A01 | System shall display KPI stat cards | P0 |
| FR-DASH-A02 | System shall display analytics charts (area/pie/line) | P0 |
| FR-DASH-A03 | System shall display recent activity timeline | P1 |
| FR-DASH-A04 | System shall display volunteer directory table | P0 |

### 3.9 Notification Module (FR-NOTIF)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-NOTIF-01 | System shall display notification bell with unread count | P0 |
| FR-NOTIF-02 | System shall support 4 toast types: success, error, warning, info | P0 |
| FR-NOTIF-03 | System shall auto-dismiss toasts after 4 seconds | P0 |
| FR-NOTIF-04 | System shall support notification types: alert, request, update, community, prealert | P0 |

### 3.10 Routing & Navigation (FR-NAV)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-NAV-01 | System shall use client-side routing with React Router v7 | P0 |
| FR-NAV-02 | System shall lazy-load all page components | P0 |
| FR-NAV-03 | System shall protect routes based on user role | P0 |
| FR-NAV-04 | System shall redirect unauthenticated users to /login for protected routes | P0 |
| FR-NAV-05 | System shall redirect authenticated users from / to role-based dashboard | P0 |
| FR-NAV-06 | System shall display role-based nav links including Communities | P0 |

---

## 4. Non-Functional Requirements

### 4.1 Performance (NFR-PERF)
| ID | Requirement |
|----|------------|
| NFR-PERF-01 | First Contentful Paint shall be under 2 seconds on 4G |
| NFR-PERF-02 | All page transitions shall use lazy loading with Suspense |
| NFR-PERF-03 | Map shall render within 3 seconds of page load |
| NFR-PERF-04 | News API responses shall be cached for 15 minutes |

### 4.2 Usability (NFR-USE)
| ID | Requirement |
|----|------------|
| NFR-USE-01 | UI shall follow a dark glassmorphism design with consistent tokens |
| NFR-USE-02 | All interactive elements shall have hover/focus states |
| NFR-USE-03 | Typography shall use Inter (headings) and DM Sans (body) |
| NFR-USE-04 | Animations shall use CSS keyframes and Framer Motion |

### 4.3 Reliability (NFR-REL)
| ID | Requirement |
|----|------------|
| NFR-REL-01 | Geolocation shall fall back to Delhi coordinates (28.6139, 77.2090) |
| NFR-REL-02 | Firebase shall fail gracefully in demo mode |
| NFR-REL-03 | News API shall fall back to curated mock data on failure |
| NFR-REL-04 | Communities and reports shall persist to localStorage |

### 4.4 Security (NFR-SEC)
| ID | Requirement |
|----|------------|
| NFR-SEC-01 | Protected routes shall verify authentication and role before rendering |
| NFR-SEC-02 | User session data shall be stored in localStorage (demo mode) |

### 4.5 Portability (NFR-PORT)
| ID | Requirement |
|----|------------|
| NFR-PORT-01 | Application shall be responsive from 360px to 1920px+ |
| NFR-PORT-02 | Application shall support Chrome, Firefox, Safari, and Edge |

---

## 5. Data Models

### 5.1 User Object
```
{ id, email, name, role, volunteerType, verified, available, phone, joinedDate, tasksCompleted, rating, avatar }
```

### 5.2 SOS Request Object
```
{ id, victimName, crisisType, helpTypes[], description, severity, status, lat, lng, address, timestamp, photo, peopleAffected, assignedVolunteer }
```

### 5.3 Crisis Report Object (Public)
```
{ id, name, phone, photo, lat, lng, state, city, pincode, address, timestamp, status, forwarded }
```

### 5.4 Community Object
```
{ id, name, type, crisisType, description, createdBy, location{lat,lng,address,state,city,pincode}, members[], resourceNeeds[], status, createdAt, closedAt, proofPhotos[], memberCount, victimsHelped }
```

### 5.5 Rescue Team Object
```
{ id, name, type, phone, altPhone, lat, lng, address, icon, available }
```

### 5.6 Pre-Alert Object
```
{ id, type, title, description, severity, region, issueDate, expiryDate, status, preparationTasks[], communityMembers }
```

### 5.7 Notification Object
```
{ id, type, title, message, time, read }
```

---

## 6. Interface Requirements

### 6.1 External Interfaces
| Interface | Description | Status |
|-----------|------------|--------|
| Geolocation API | Browser navigator.geolocation | Active |
| CartoDB Tiles | Dark map tile layer for Leaflet | Active |
| Google Fonts | Inter + DM Sans font loading | Active |
| GNews API | Live crisis news for India | Active |
| Firebase SDK | Auth, Firestore, Storage | Placeholder |

### 6.2 Route Map

| Route | Component | Access | Footer |
|-------|-----------|--------|--------|
| `/` | Landing / Dashboard redirect | Public | Yes |
| `/login` | Login | Guest only | Yes |
| `/register` | Register | Guest only | Yes |
| `/victim` | VictimDashboard | Victim role | Yes |
| `/volunteer` | VolunteerDashboard | Volunteer role | Yes |
| `/admin` | AdminDashboard | Admin role | Yes |
| `/map` | CrisisMap | Public | No |
| `/pre-alerts` | PreAlerts | Public | Yes |
| `/community` | CommunityHub | Public | Yes |

---

## 7. Constraints
- MVP uses mock data; no live backend
- Firebase credentials are placeholders
- No real SMS/push notifications
- GNews API free tier rate limits
- Rescue team data is pre-configured for Delhi (demo)
- Hackathon time constraint (48 hours)

---

*End of SRS*
