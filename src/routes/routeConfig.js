// Centralized route configuration
// Each route defines: path, component (lazy-loadable), protection rules

import { lazy } from 'react';

// Lazy-loaded page components for code splitting
const Landing = lazy(() => import('../pages/Landing/Landing'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const VictimDashboard = lazy(() => import('../pages/Dashboard/VictimDashboard'));
const VolunteerDashboard = lazy(() => import('../pages/Dashboard/VolunteerDashboard'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const CrisisMap = lazy(() => import('../pages/Map/CrisisMap'));
const PreAlerts = lazy(() => import('../pages/PreAlerts/PreAlerts'));
const CommunityHub = lazy(() => import('../pages/Community/CommunityHub'));

export const publicRoutes = [
  { path: '/map', component: CrisisMap },
  { path: '/pre-alerts', component: PreAlerts },
  { path: '/community', component: CommunityHub },
];

export const authRoutes = [
  { path: '/login', component: Login, guestOnly: true },
  { path: '/register', component: Register, guestOnly: true },
];

export const protectedRoutes = [
  { path: '/victim', component: VictimDashboard, roles: ['victim'] },
  { path: '/volunteer', component: VolunteerDashboard, roles: ['volunteer'] },
  { path: '/admin', component: AdminDashboard, roles: ['admin'] },
];

export const landingRoute = {
  path: '/',
  component: Landing,
};

export const getDashboardPath = (role) => {
  switch (role) {
    case 'admin': return '/admin';
    case 'volunteer': return '/volunteer';
    default: return '/victim';
  }
};
