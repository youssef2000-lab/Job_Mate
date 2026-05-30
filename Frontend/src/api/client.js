// Frontend/src/api/client.js
// ✅ FIX 10: Removed `withCredentials: true`.
//   The app uses Bearer token auth, not Sanctum cookie sessions.
//   withCredentials + wildcard CORS origin can cause browser pre-flight rejections.

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Accept': 'application/json' },
  // ✅ FIX 10: removed withCredentials: true (not needed for Bearer token auth)
});

// ── Request: attach Bearer token ─────────────────────────────
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobmate_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response: handle 401 globally ────────────────────────────
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jobmate_token');
      localStorage.removeItem('jobmate_user');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
