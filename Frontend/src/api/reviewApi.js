// src/api/reviewApi.js

import client from './client';

export const createReviewApi = (payload) =>
  client.post('/reviews', payload);

export const getProviderReviewsApi = (providerId) =>
  client.get(`/providers/${providerId}/reviews`);
