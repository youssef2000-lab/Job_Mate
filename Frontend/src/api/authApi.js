// src/api/authApi.js

import client from './client';

// ── Register ─────────────────────────────────────────────────
// Accepts FormData (supports avatar file upload)
export const registerApi = (formData) =>
  client.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ── Login ────────────────────────────────────────────────────
export const loginApi = ({ email, password }) =>
  client.post('/auth/login', { email, password });

// ── Logout ───────────────────────────────────────────────────
export const logoutApi = () =>
  client.post('/auth/logout');

// ── Current user ─────────────────────────────────────────────
export const getMeApi = () =>
  client.get('/auth/me');

// ── Avatar upload (standalone) ───────────────────────────────
export const uploadAvatarApi = (file) => {
  const form = new FormData();
  form.append('avatar', file);
  return client.post('/upload/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
