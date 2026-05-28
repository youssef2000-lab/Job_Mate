// src/store/reviewSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createReviewApi, getProviderReviewsApi } from '../api/reviewApi';

// ── Thunks ────────────────────────────────────────────────────

export const fetchProviderReviews = createAsyncThunk(
  'reviews/fetchProvider',
  async (providerId, { rejectWithValue }) => {
    try {
      const { data } = await getProviderReviewsApi(providerId);
      return { providerId, reviews: data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Erreur chargement avis.');
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/add',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await createReviewApi(payload);
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors ?? {})[0]?.[0] ||
        'Erreur soumission avis.';
      return rejectWithValue(msg);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    // Keyed by providerId for fast lookup: { [providerId]: Review[] }
    byProvider: {},
    loading:    false,
    error:      null,
  },
  reducers: {
    clearReviewError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // fetchProvider
    builder
      .addCase(fetchProviderReviews.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchProviderReviews.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.byProvider[payload.providerId] = payload.reviews;
      })
      .addCase(fetchProviderReviews.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload;
      });

    // addReview
    builder
      .addCase(addReview.fulfilled, (s, { payload }) => {
        const pid = payload.provider_id;
        if (s.byProvider[pid]) {
          s.byProvider[pid].unshift(payload);
        }
      })
      .addCase(addReview.rejected, (s, { payload }) => {
        s.error = payload;
      });
  },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
