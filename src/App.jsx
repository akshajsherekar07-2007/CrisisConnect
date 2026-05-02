import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar, Footer, LoadingSpinner } from './components';
import { ProtectedRoute, publicRoutes, authRoutes, protectedRoutes, landingRoute, getDashboardPath } from './routes';

const AppRoutes = () => {
  const { user } = useAuth();
  const Landing = landingRoute.component;

  // Pages that don't show footer (full-screen layouts)
  const noFooterPaths = ['/map'];
  const currentPath = window.location.pathname;
  const showFooter = !noFooterPaths.includes(currentPath);

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
          <Routes>
            {/* Landing / Home */}
            <Route path="/" element={user ?
              <Navigate to={getDashboardPath(user.role)} replace /> :
              <Landing />
            } />

            {/* Auth routes (guest only) */}
            {authRoutes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={user ? <Navigate to="/" replace /> : <Component />} />
            ))}

            {/* Protected routes (role-based) */}
            {protectedRoutes.map(({ path, component: Component, roles }) => (
              <Route key={path} path={path} element={
                <ProtectedRoute allowedRoles={roles}><Component /></ProtectedRoute>
              } />
            ))}

            {/* Public routes */}
            {publicRoutes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {showFooter && currentPath !== '/map' && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
