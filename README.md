# 🛡️ CrisisConnect — Community Crisis Management Platform

> **Real-time emergency coordination platform connecting communities with verified volunteers and rescue teams. Featuring live crisis maps, instant crisis reporting, community hub, and a proactive pre-alert notification system.**

[![HTF 3.0](https://img.shields.io/badge/HTF_3.0-Hackathon-8b5cf6?style=for-the-badge)](https://htf3.devfolio.co)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Ready-ffca28?style=for-the-badge&logo=firebase)](https://firebase.google.com)

---

## 🌟 Overview

**CrisisConnect** transforms scattered crisis responses into structured, life-saving action. The platform enables **anyone** — even without an account — to report a crisis instantly and get connected to nearby rescue teams. For registered users, it provides role-based dashboards for **Volunteers** and **Administrators**, along with a full-featured Community Hub for organizing relief efforts.

### 🎯 What Makes It Different?

Unlike reactive-only platforms, CrisisConnect features a **Pre-Alert Notification System** — our core USP — that mobilizes communities **before** disasters strike:

| Timeline | Action |
|----------|--------|
| 🔴 72h Before | Weather systems detected → initial alert issued |
| 🟣 48h Before | Community formed → volunteers mobilized |
| 🔵 24h Before | Evacuation plans activated → shelters prepared |
| 🟢 During Crisis | Real-time response coordination |
| ✅ After Crisis | Recovery support & impact assessment |

---

## ✨ Features

### 🆘 Instant Crisis Reporting (No Login Required)
- Public-facing crisis report form on the landing page
- Enter name, phone, and address details (state, city, pincode)
- Auto-detect GPS location with one click
- Upload geo-tagged photos of the situation
- **Nearby rescue teams** (Fire, Police, Ambulance, NDRF) auto-discovered based on location
- One-tap call buttons to contact rescue teams directly
- Reports forwarded to authorities with reference ID

### 📰 Live Crisis News Ticker
- Real-time crisis news from India via GNews API integration
- Auto-scrolling ticker bar on the landing page
- Fallback to curated mock news data when API is unavailable
- 15-minute cache for optimal performance

### 🗺️ Live Crisis Map
- Interactive dark-themed Leaflet map with real-time markers
- SOS requests (🆘), volunteers (🦺), rescue teams (🚒🚑🚔🦺), and safe zones (🏠)
- Danger radius visualization for high-severity events
- Filter pills, collapsible request sidebar, and map legend

### 🔔 Pre-Alert System (USP)
- Weather-based early warnings with severity levels
- 5-day forecast with rain probability
- Interactive preparation checklists
- Join crisis-specific communities

### 👥 Community Hub
- **Browse** active communities with search and type filters (Pre-Crisis / Post-Crisis)
- **Create** communities with full location details (state, city, pincode, GPS)
- **Join** communities as a volunteer
- **Raise resource requests** (food, shelter, medical, transport, rescue, clothing, financial aid) with urgency levels
- **Close communities** with geo-tagged proof of recovery
- Full lifecycle: create → join → manage resources → resolve
- Leader and member role management

### 📊 Role-Based Dashboards

| Role | Dashboard Features |
|------|-------------------|
| **Victim** | SOS button, request history, location display |
| **Volunteer** | Task queue (Incoming/Active/Completed), availability toggle, stats |
| **Admin** | KPI cards, analytics charts, volunteer directory, activity timeline |

### 🔐 Authentication & Authorization
- Email-based login with role auto-detection
- Registration with role & volunteer type selection (Rescue, On-Ground, Fundraiser)
- Aadhaar & PAN document validation for volunteer verification
- Protected routes with role-based access control
- Demo accounts for Volunteer and Admin roles

### 🔔 Notification System
- In-app notification bell with unread count
- Toast notifications (success, error, warning, info)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework (JSX) |
| **Vite 8** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **Leaflet + React-Leaflet** | Interactive crisis maps |
| **Recharts** | Admin analytics charts |
| **Framer Motion** | Animations |
| **Lucide React** | Icon library |
| **Firebase** | Backend-ready (Auth, Firestore, Storage) |
| **GNews API** | Live crisis news integration |
| **Vanilla CSS** | Dark glassmorphism theme |

---

## 📁 Project Structure

```
src/
├── pages/                    # Feature-based pages
│   ├── Landing/              # Public landing + crisis report form
│   ├── Auth/                 # Login & Register
│   ├── Dashboard/            # Victim & Volunteer dashboards
│   ├── Admin/                # Admin dashboard with analytics
│   ├── Map/                  # Live crisis map
│   ├── PreAlerts/            # Pre-alert notification system
│   └── Community/            # Community Hub (create/join/manage)
├── components/               # Shared components
│   ├── common/               # Modal, RequestCard, StatCounter,
│   │                         # StatusBadge, LoadingSpinner
│   └── layout/               # Navbar, Footer
├── context/                  # React Context providers
│   ├── AuthContext.jsx       # Authentication state
│   ├── NotificationContext.jsx # Notifications & toasts
│   ├── CommunityContext.jsx  # Community lifecycle management
│   └── ReportContext.jsx     # Crisis report & rescue team finder
├── hooks/                    # Custom hooks
│   ├── useGeolocation.js     # GPS position
│   └── useRequests.js        # SOS request CRUD
├── services/                 # External integrations
│   ├── firebase.js           # Firebase SDK
│   ├── geolocation.js        # Browser Geolocation API
│   └── newsService.js        # GNews API + fallback
├── routes/                   # Route configuration
│   ├── routeConfig.js        # Centralized route definitions
│   └── ProtectedRoute.jsx    # Role-based route guard
├── data/                     # Mock data (demo mode)
│   ├── mockAlerts.js         # Pre-alerts, weather
│   ├── mockCommunities.js    # Community data + INDIAN_STATES
│   ├── mockNews.js           # Fallback news items
│   ├── mockNotifications.js  # Sample notifications
│   ├── mockRequests.js       # SOS request samples
│   ├── mockRescueTeams.js    # Fire/Police/Ambulance/NDRF teams
│   ├── mockStats.js          # Dashboard statistics
│   └── mockUsers.js          # Volunteer user profiles
├── constants/                # Crisis types, help types, volunteer types
├── utils/                    # Formatters, geo calculations
└── styles/                   # CSS architecture
    ├── variables.css          # Design tokens
    ├── reset.css              # Browser reset
    ├── typography.css         # Font styles
    ├── layout.css             # Layout utilities
    ├── components.css         # Shared component styles
    ├── animations.css         # Keyframe animations
    ├── responsive.css         # Media queries
    └── vendor.css             # Leaflet overrides
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ installed
- **npm** or **yarn** package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/crisisconnect.git
cd crisisconnect

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🧪 Demo Mode

The app runs in **demo mode** with mock data. Use these accounts to test different roles:

| Email Pattern | Role | Dashboard |
|---------------|------|-----------|
| `admin@test.com` | Admin | `/admin` |
| `vol@test.com` | Volunteer | `/volunteer` |

> Any password works in demo mode. Demo login buttons are available on the login page.

> 💡 **Crisis reporting does NOT require login.** Anyone can report a crisis from the landing page.

---

## 📐 Architecture Highlights

- **Lazy Loading:** All pages are code-split via `React.lazy()` for optimal performance
- **4 Context Providers:** AuthContext, NotificationContext, CommunityContext, ReportContext
- **Custom Hooks:** `useRequests` for SOS CRUD, `useGeolocation` for GPS
- **Route Protection:** RBAC with `ProtectedRoute` component
- **Design System:** CSS variables for consistent theming (dark glassmorphism)
- **News Integration:** GNews API with 15-min cache and mock fallback
- **Rescue Team Finder:** Haversine distance-based proximity search
- **Community Lifecycle:** Create → Join → Manage Resources → Resolve with proof
- **Graceful Fallbacks:** Geolocation falls back to Delhi coordinates; Firebase & News API fail silently
- **Persistent State:** Communities and reports persisted in localStorage

---

## 🗺️ Route Map

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public / Redirect | Landing page with crisis report form (guest) or dashboard redirect (auth) |
| `/login` | Guest only | Login form with demo accounts |
| `/register` | Guest only | Registration with role selection & document validation |
| `/victim` | Victim role | SOS reporting & request tracking |
| `/volunteer` | Volunteer role | Task queue & management |
| `/admin` | Admin role | Analytics & user management |
| `/map` | Public | Live interactive crisis map |
| `/pre-alerts` | Public | Weather warnings & community prep |
| `/community` | Public | Community Hub — browse, create, join, manage |

---

## 📄 Documentation

Detailed documentation is available in the `docs/` directory:

| Document | Description |
|----------|-------------|
| [PRD.md](docs/PRD.md) | Product Requirements Document |
| [SRS.md](docs/SRS.md) | Software Requirements Specification |
| [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) | System Architecture Document |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is built for the **HTF 3.0 Hackathon**. All rights reserved.

---

## 👥 Team

Built with ❤️ by **Team CrisisConnect** for HTF 3.0 Hackathon.

---

> *"Connecting Communities, Saving Lives."*
