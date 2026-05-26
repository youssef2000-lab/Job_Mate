// src/api/serviceApi.js

import client from './client';

// ── List services (with filters) ─────────────────────────────
// params: { category, search, city, country, max_price, page }
export const getServicesApi = (params = {}) =>
  client.get('/services', { params });

// ── Single service ───────────────────────────────────────────
export const getServiceApi = (id) =>
  client.get(`/services/${id}`);

// ── Create service (multipart for images/certificates) ───────
export const createServiceApi = (data) => {
  const form = buildServiceForm(data);
  return client.post('/services', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ── Update service ───────────────────────────────────────────
export const updateServiceApi = (id, data) => {
  const form = buildServiceForm(data);
  form.append('_method', 'PUT');           // Laravel method spoofing
  return client.post(`/services/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ── Delete service ───────────────────────────────────────────
export const deleteServiceApi = (id) =>
  client.delete(`/services/${id}`);

// ── Helpers ──────────────────────────────────────────────────
function buildServiceForm(data) {
  const form = new FormData();
  const scalars = ['title', 'category', 'description', 'price', 'city', 'country', 'video_url'];
  scalars.forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      form.append(key, data[key]);
    }
  });

  // Gallery: array of File objects
  if (Array.isArray(data.gallery)) {
    data.gallery.forEach((file) => form.append('gallery[]', file));
  }

  // Certificates: array of File objects
  if (Array.isArray(data.certificates)) {
    data.certificates.forEach((file) => form.append('certificates[]', file));
  }

  return form;
}
