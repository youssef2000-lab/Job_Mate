// src/store/bookingSlice.js
// ─────────────────────────────────────────────────────────────

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createBookingApi,
  getBookingsApi,
  updateBookingStatusApi,
} from '../api/bookingApi';

// ── Thunks ────────────────────────────────────────────────────

export const fetchBookings = createAsyncThunk(
  'bookings/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getBookingsApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Erreur chargement.');
    }
  }
);

export const requestBooking = createAsyncThunk(
  'bookings/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await createBookingApi(payload);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data?.errors ?? {})[0]?.[0]
        || 'Erreur réservation.';
      return rejectWithValue(msg);
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ bookingId, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await updateBookingStatusApi(bookingId, payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Erreur mise à jour.');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────
const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings : [],
    loading  : false,
    error    : null,
  },
  reducers: {
    clearBookingError: (s) => { s.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchBookings.fulfilled, (s, { payload }) => {
        s.loading = false; s.bookings = payload;
      })
      .addCase(fetchBookings.rejected,  (s, { payload }) => {
        s.loading = false; s.error = payload;
      });

    builder
      .addCase(requestBooking.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(requestBooking.fulfilled, (s, { payload }) => {
        s.loading = false; s.bookings.unshift(payload);
      })
      .addCase(requestBooking.rejected,  (s, { payload }) => {
        s.loading = false; s.error = payload;
      });

    builder
      .addCase(updateBookingStatus.fulfilled, (s, { payload }) => {
        const idx = s.bookings.findIndex((b) => b.id === payload.id);
        if (idx !== -1) s.bookings[idx] = payload;
      })
      .addCase(updateBookingStatus.rejected, (s, { payload }) => {
        s.error = payload;
      });
  },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;


// ═════════════════════════════════════════════════════════════
// src/store/reviewSlice.js
// ═════════════════════════════════════════════════════════════

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createReviewApi, getProviderReviewsApi } from '../api/reviewApi';

export const fetchProviderReviews = createAsyncThunk(
  'reviews/fetchProvider',
  async (providerId, { rejectWithValue }) => {
    try {
      const { data } = await getProviderReviewsApi(providerId);
      return { providerId, reviews: data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Erreur avis.');
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
      const msg = err.response?.data?.message
        || Object.values(err.response?.data?.errors ?? {})[0]?.[0]
        || 'Erreur soumission avis.';
      return rejectWithValue(msg);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    // keyed by providerId for fast lookup: { [providerId]: Review[] }
    byProvider: {},
    loading   : false,
    error     : null,
  },
  reducers: {
    clearReviewError: (s) => { s.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviderReviews.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProviderReviews.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.byProvider[payload.providerId] = payload.reviews;
      })
      .addCase(fetchProviderReviews.rejected,  (s, { payload }) => {
        s.loading = false; s.error = payload;
      });

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
