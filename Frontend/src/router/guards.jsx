// src/router/guards.jsx

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
