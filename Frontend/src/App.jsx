// src/App.jsx
// ─────────────────────────────────────────────────────────────
// FIX C — Removed useToast() call from AppContent.
//   App.jsx was calling useToast() to pass toasts/removeToast props
//   down to ToastContainer. But since ToastProvider is now in main.jsx,
//   ToastContainer can consume the context directly itself — no prop
//   drilling needed. This also eliminates the circular dependency risk.
// ─────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMeThunk } from './store/authSlice';

// ── Layout ────────────────────────────────────────────────────
import Navbar    from './components/common/Navbar';
import Footer    from './components/common/Footer';
import AuthModal from './components/auth/AuthModal';
import { ToastContainer } from './components/ui/Toast';  // FIX C: no more useToast here

// ── Pages ─────────────────────────────────────────────────────
import HomePage    from './pages/HomePage';
import BrowsePage  from './pages/BrowsePage';
import ProfilePage from './pages/ProfilePage';
import Dashboard   from './pages/Dashboard';
import CheckoutPage from './pages/CheckoutPage';
import HowItWorks  from './pages/HowItWorks';

// ── Admin pages ───────────────────────────────────────────────
import AdminLayout    from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminServices  from './pages/admin/AdminServices';
import AdminBookings  from './pages/admin/AdminBookings';

// ── Route guards ──────────────────────────────────────────────
import { ProtectedRoute, AdminRoute } from './router/guards';

// ─────────────────────────────────────────────────────────────

function AppContent() {
  const dispatch = useDispatch();

  // Re-hydrate user on hard refresh if a token exists
  useEffect(() => {
    if (localStorage.getItem('jobmate_token')) {
      dispatch(fetchMeThunk());
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <AuthModal />
      {/* FIX C: ToastContainer reads context internally — no props needed */}
      <ToastContainer />

      <Routes>
        {/* ── Public ──────────────────────────────────── */}
        <Route path="/"             element={<HomePage />} />
        <Route path="/browse"       element={<BrowsePage />} />
        <Route path="/profile/:id"  element={<ProfilePage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        {/* ── Protected ───────────────────────────────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/checkout/:id" element={
          <ProtectedRoute><CheckoutPage /></ProtectedRoute>
        } />

        {/* ── Admin (nested) ──────────────────────────── */}
        <Route path="/admin" element={
          <AdminRoute><AdminLayout /></AdminRoute>
        }>
          <Route index           element={<AdminDashboard />} />
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
