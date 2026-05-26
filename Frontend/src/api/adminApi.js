// src/api/adminApi.js

import client from './client';

export const getDashboardStatsApi   = ()           => client.get('/admin/dashboard');
export const getAdminUsersApi       = (params = {}) => client.get('/admin/users', { params });
export const getAdminServicesApi    = (params = {}) => client.get('/admin/services', { params });
export const getAdminBookingsApi    = (params = {}) => client.get('/admin/bookings', { params });
export const deleteAdminUserApi     = (id)          => client.delete(`/admin/users/${id}`);
export const deleteAdminServiceApi  = (id)          => client.delete(`/admin/services/${id}`);
export const verifyAdminUserApi     = (id)          => client.put(`/admin/users/${id}/verify`);
export const updateServiceStatusApi = (id, status)  =>
  client.put(`/admin/services/${id}/status`, { status });
