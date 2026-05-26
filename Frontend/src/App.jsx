// src/router/guards.jsx
// ─────────────────────────────────────────────────────────────
// Route guard components for protected and role-gated routes.
// ─────────────────────────────────────────────────────────────

import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ── Authenticated users only ──────────────────────────────────
export function ProtectedRoute({ children }) {
  const { isLoggedIn } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

// ── Admin only ────────────────────────────────────────────────
export function AdminRoute({ children }) {
  const { isLoggedIn, currentUser } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  if (currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

// ── Provider only ─────────────────────────────────────────────
export function ProviderRoute({ children }) {
  const { isLoggedIn, currentUser } = useSelector((s) => s.auth);

  if (!isLoggedIn || currentUser?.role !== 'provider') {
    return <Navigate to="/" replace />;
  }
  return children;
}


// ─────────────────────────────────────────────────────────────
// src/App.jsx
// Full routing config — drop-in replacement.
// ─────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeThunk } from './store/authSlice';

// Layout
import Navbar       from './components/Navbar/Navbar';
import Footer       from './components/Footer/Footer';
import AuthModal    from './components/AuthModal/AuthModal';
import { ToastContainer } from './components/Toast/Toast';
import { useToast } from './hooks/useToast';

// Pages
import HomePage     from './pages/HomePage/HomePage';
import BrowsePage   from './pages/BrowsePage/BrowsePage';
import ProfilePage  from './pages/ProfilePage/ProfilePage';
import Dashboard    from './pages/Dashboard/Dashboard';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import HowItWorks   from './pages/HowItWorks/HowItWorks';

// Admin
import AdminLayout  from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminPages';
import { AdminUsers }     from './pages/admin/AdminPages';
import { AdminServices }  from './pages/admin/AdminPages';
import { AdminBookings }  from './pages/admin/AdminPages';

// Guards
import { ProtectedRoute, AdminRoute } from './router/guards';

function AppContent() {
  const dispatch = useDispatch();
  const { toasts, removeToast } = useToast();
  const { isLoggedIn } = useSelector((s) => s.auth);

  // Re-hydrate user on mount if token exists
  useEffect(() => {
    if (localStorage.getItem('jobmate_token')) {
      dispatch(fetchMeThunk());
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <AuthModal />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <Routes>
        {/* ── Public ──────────────────────────────────── */}
        <Route path="/"            element={<HomePage />} />
        <Route path="/browse"      element={<BrowsePage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        {/* ── Protected ───────────────────────────────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/checkout/:id" element={
          <ProtectedRoute><CheckoutPage /></ProtectedRoute>
        } />

        {/* ── Admin ───────────────────────────────────── */}
        <Route path="/admin" element={
          <AdminRoute><AdminLayout /></AdminRoute>
        }>
          <Route index         element={<AdminDashboard />} />
          <Route path="users"    element={<AdminUsers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>

        {/* ── 404 ─────────────────────────────────────── */}
        <Route path="*" element={
          <div style={{ padding: '5rem', textAlign: 'center' }}>
            <h2>404 — Page introuvable</h2>
          </div>
        } />
      </Routes>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
