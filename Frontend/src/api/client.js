// src/api/client.js
// ─────────────────────────────────────────────────────────────
// Central Axios instance. Every API module imports from here.
// ─────────────────────────────────────────────────────────────

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,          // needed for Sanctum cookie sessions (optional)
  headers: { 'Accept': 'application/json' },
});

// ── Request interceptor: attach Bearer token ────────────────
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobmate_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 globally ───────────────
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jobmate_token');
      localStorage.removeItem('jobmate_user');
      // Redirect to home — avoids circular import with store
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
