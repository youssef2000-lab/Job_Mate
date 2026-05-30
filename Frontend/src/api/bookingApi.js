// Frontend/src/api/bookingApi.js
// ✅ FIX 9: Removed dead review code appended at bottom from previous concatenation error.
//   The real reviewApi.js already exists as a separate file.

import client from './client';

// ── Create booking ────────────────────────────────────────────
// payload: { service_id, client_message }
export const createBookingApi = (payload) =>
  client.post('/bookings', payload);

// ── Get bookings (scoped by role on backend) ──────────────────
export const getBookingsApi = () =>
  client.get('/bookings');

// ── Update booking status ─────────────────────────────────────
// payload: { status } OR { payment_status } OR both
export const updateBookingStatusApi = (id, payload) =>
  client.put(`/bookings/${id}/status`, payload);
