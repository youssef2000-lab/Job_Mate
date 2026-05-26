// src/api/bookingApi.js

import client from './client';

// ── Create booking ────────────────────────────────────────────
// payload: { service_id, client_message }
export const createBookingApi = (payload) =>
  client.post('/bookings', payload);

// ── Get bookings (scoped by role on backend) ──────────────────
export const getBookingsApi = () =>
  client.get('/bookings');

// ── Update booking status ─────────────────────────────────────
// payload: { status } or { payment_status }
export const updateBookingStatusApi = (id, payload) =>
  client.put(`/bookings/${id}/status`, payload);


// ─────────────────────────────────────────────────────────────
// src/api/reviewApi.js
// ─────────────────────────────────────────────────────────────

import client from './client';

// ── Submit review ─────────────────────────────────────────────
// payload: { booking_id, rating, comment }
export const createReviewApi = (payload) =>
  client.post('/reviews', payload);

// ── Get reviews for a provider ────────────────────────────────
export const getProviderReviewsApi = (providerId) =>
  client.get(`/providers/${providerId}/reviews`);
