# CrisisConnect — Product Requirements Document (PRD)

**Version:** 2.0 | **Date:** April 29, 2026 | **Event:** HTF 3.0 Hackathon

---

## 1. Executive Summary

**CrisisConnect** is a real-time community crisis management platform that bridges the gap between people in distress and verified volunteers and rescue teams during emergencies. It enables instant crisis reporting (no login required), live crisis visualization, a full-featured Community Hub, and — uniquely — a **proactive pre-alert notification system** that mobilizes communities *before* disasters strike.

---

## 2. Problem Statement

During emergencies, crisis response is fragmented:
- **Affected individuals** lack a streamlined, barrier-free way to report their exact location and reach rescue teams.
- **Volunteers** have no centralized system to discover nearby requests matching their skills.
- **Communities** cannot organize proactively before predictable disasters, nor manage resources during active relief.
- **Administrators** have no real-time visibility into platform activity or analytics.
- **Rescue teams** (Fire, Police, Ambulance, NDRF) are not easily discoverable by those in need.

**Core Differentiators:**
1. **Zero-friction crisis reporting** — no account needed; report from the landing page with auto-location and photo upload.
2. **Pre-alert system** triggers community formation and volunteer mobilization 24–72 hours before predicted impact.
3. **Community Hub** with full lifecycle management — create, join, raise resource requests, and resolve with proof.
4. **Live news integration** — real-time crisis news from India via GNews API.

---

## 3. Goals & Objectives

| # | Goal | Metric |
|---|------|--------|
| G1 | Enable anyone to report a crisis in under 60 seconds without login | Report form completion < 60s |
| G2 | Auto-discover nearest rescue teams based on geolocation | Teams displayed within 3s of location detection |
| G3 | Connect affected individuals with verified volunteers | Avg response time < 5 min |
| G4 | Real-time situational awareness via live crisis map | All active markers rendered |
| G5 | Proactive disaster preparedness via pre-alerts | Communities formed 24–72h early |
| G6 | Full community lifecycle management | Create → Join → Resources → Resolve |
| G7 | Full platform visibility for administrators | Real-time KPI dashboard |

---

## 4. Target Users & Personas

### 4.1 General Public (Guest)
Anyone affected by a crisis — can report emergencies instantly without creating an account. Gets connected to nearby rescue teams.

### 4.2 Registered User (Victim Role)
Authenticated user who needs to send SOS alerts — can submit detailed emergency requests with crisis type, help needed, severity, and track request status.

### 4.3 Volunteer
Verified individuals (Rescue, On-Ground, Fundraiser) — validated via Aadhaar & PAN documents. Manages real-time task queue, accept/complete workflows, availability toggle, and community leadership.

### 4.4 Administrator
Platform operators — manages analytics dashboards, volunteer verification, request moderation, and activity logs.

---

## 5. User Stories

### General Public (Landing Page)
- **G1:** Report a crisis with my name, phone, photo, and location — no signup required. (P0)
- **G2:** Auto-detect my GPS location so rescue teams know where I am. (P0)
- **G3:** See nearby rescue teams (Fire, Police, Ambulance, NDRF) with call buttons. (P0)
- **G4:** View live crisis news ticker for India-specific disaster updates. (P1)
- **G5:** Upload a geo-tagged photo of the situation. (P1)
- **G6:** Receive a reference ID after submitting a report. (P1)

### Victim (Authenticated)
- **V1:** Send SOS with live location so volunteers can find me immediately. (P0)
- **V2:** Select crisis type (flood, fire, earthquake, etc.) so responders know what to prepare. (P0)
- **V3:** Specify help needed (food, shelter, medical, rescue, transport). (P0)
- **V4:** Rate severity (1–5) so critical requests are prioritized. (P1)
- **V5:** Upload a photo of the situation. (P1)
- **V6:** Track request status (pending → accepted → completed) in real-time. (P0)

### Volunteer
- **VL1:** See incoming SOS requests near me. (P0)
- **VL2:** Accept a request and navigate to the victim. (P0)
- **VL3:** Mark tasks as completed. (P0)
- **VL4:** Toggle my availability status. (P1)
- **VL5:** View my rating, completed tasks, and active tasks. (P1)
- **VL6:** Create crisis response communities. (P0)
- **VL7:** Lead a community and manage members. (P0)
- **VL8:** Raise resource requests on behalf of the community. (P0)
- **VL9:** Close a community with geo-tagged proof of recovery. (P0)

### Admin
- **A1:** View total users, verified volunteers, active requests, response times. (P0)
- **A2:** View analytics charts (requests over time, by type, response trends). (P0)
- **A3:** Manage volunteer verifications. (P0)
- **A4:** View recent activity timeline. (P1)

### Community Hub
- **CH1:** Browse active communities with search and type filters. (P0)
- **CH2:** View community details — members, resources, location, stats. (P0)
- **CH3:** Join communities as a volunteer. (P0)
- **CH4:** Create communities with full location details and member management. (P0)
- **CH5:** Raise resource requests with type, quantity, and urgency. (P0)
- **CH6:** Close communities with proof of recovery. (P0)
- **CH7:** Track "My Communities" separately. (P1)

### Pre-Alert
- **PA1:** Receive pre-alert notifications based on weather forecasts. (P0)
- **PA2:** See preparation checklists per alert type. (P0)
- **PA3:** Join crisis-specific communities. (P1)
- **PA4:** View live weather data for my region. (P1)

---

## 6. Core Features

### 6.1 Instant Crisis Reporting (Landing Page)
- No authentication required — open to all
- Fields: Full name, phone number, geo-tagged photo upload
- Auto-detect GPS location with one click
- Address fields: State (29 Indian states), City, Pincode, Additional address
- Nearby rescue team discovery via Haversine distance calculation
- Auto-forward report to rescue teams
- Reference ID confirmation on submission

### 6.2 Nearby Rescue Team Finder
- 12 pre-configured rescue teams (Delhi region): Fire Stations, Hospitals/Ambulances, Police Stations, NDRF
- Distance-based proximity search (Haversine formula, 50km radius)
- Direct call buttons for emergency contact
- Team types: 🚒 Fire, 🚑 Ambulance, 🚔 Police, 🦺 NDRF

### 6.3 Live Crisis News Ticker
- GNews API integration for real-time India crisis news
- Search query: crisis, disaster, flood, earthquake, cyclone India
- Auto-scrolling ticker bar with pause-on-hover
- 15-minute cache for API rate limiting
- Fallback to 12 curated mock news items

### 6.4 SOS Reporting System (Authenticated)
- 8 crisis types (Flood, Earthquake, Fire, Cyclone, Accident, Medical, Landslide, Other)
- 7 help types (Food & Water, Shelter, Medical Aid, Transport, Rescue, Clothing, Financial Aid)
- Severity slider (1–5), auto-geolocation, photo upload, free-text description

### 6.5 Live Crisis Map
- Leaflet map with dark CartoDB tiles
- Real-time markers: SOS (🆘), Volunteers (🦺), Safe Zones (🏠)
- Danger radius circles (severity ≥ 4), filter pills, sidebar with request cards, legend

### 6.6 Pre-Alert System *(USP)*
- Weather-based early warnings (medium/high/critical severity)
- 5-day forecast, weather alert banners, interactive preparation checklists
- Crisis communities with join functionality
- Timeline: 72h → 48h → 24h → During → After

### 6.7 Community Hub
- Browse active communities with search and pre-crisis/post-crisis type filters
- Create communities with: name, type, crisis type, description, contact phone, location (GPS auto-detect, state, city, pincode), member management
- Join communities as a volunteer
- Resource request system: 7 resource types × 4 urgency levels (low/medium/high/critical)
- Community closure with geo-tagged proof upload
- Full lifecycle management: Active → Resolved
- Persistent state via localStorage

### 6.8 Role-Based Dashboards
- **Victim:** SOS button, request history, location display
- **Volunteer:** Incoming/Active/Completed tabs, availability toggle, stats
- **Admin:** KPI cards, Recharts analytics (area/pie/line), volunteer directory, activity timeline

### 6.9 Auth & Authorization
- Email login with role auto-detection, registration with role selection
- Aadhaar & PAN document validation for volunteer verification
- Role-based route protection, persistent localStorage sessions
- Demo accounts: Volunteer and Admin

### 6.10 Notification System
- In-app bell with unread count, toast notifications (4 types), mark-as-read

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | FCP < 2s; lazy-loaded code splitting |
| Responsiveness | Mobile (360px+), tablet, desktop |
| UI/UX | Premium dark glassmorphism theme with animations |
| Security | Role-based access control; protected routes |
| Scalability | Firebase-ready architecture |
| Offline Support | LocalStorage persistence for communities and reports |

---

## 8. Unique Selling Proposition (USP) — Pre-Alert System

Unlike reactive-only platforms, CrisisConnect integrates a **proactive pre-alert system**:

1. **72h Before:** Weather systems detected → initial alert issued
2. **48h Before:** Community formed → volunteers mobilized
3. **24h Before:** Evacuation plans activated → shelters prepared
4. **During Crisis:** Real-time response coordination active
5. **After Crisis:** Recovery support and impact assessment

---

## 9. Roadmap

**Phase 1 (MVP — Hackathon):** Crisis report form, Rescue team finder, Live news, SOS, Map, Pre-Alerts, Community Hub, Dashboards, Auth, Notifications, Demo mode ✅  
**Phase 2 (Production):** Live Firebase Auth, Firestore, push notifications, weather API, SMS alerts, real rescue team API  
**Phase 3 (Scale):** AI disaster prediction, NLP severity classification, government APIs, multi-language, PWA offline support

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| No internet during crisis | Offline-first PWA with service workers |
| Fake SOS reports | Community validation + admin moderation |
| Location inaccuracy | High-accuracy mode + manual address fallback |
| Data privacy | End-to-end encryption; GDPR compliance |
| News API rate limits | 15-minute cache + curated mock fallback |

---

*End of PRD*
