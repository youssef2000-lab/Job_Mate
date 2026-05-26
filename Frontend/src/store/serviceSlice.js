// src/store/serviceSlice.js
// ─────────────────────────────────────────────────────────────
// All service data comes from the Laravel API.
// Zero localStorage. Pagination handled by backend.
// ─────────────────────────────────────────────────────────────

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getServicesApi,
  getServiceApi,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
} from '../api/serviceApi';

// ── Thunks ────────────────────────────────────────────────────

export const fetchServices = createAsyncThunk(
  'services/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await getServicesApi(params);
      return data; // { data: [...], current_page, last_page, total }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Erreur chargement.');
    }
  }
);

export const fetchService = createAsyncThunk(
  'services/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await getServiceApi(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Service introuvable.');
    }
  }
);

export const createService = createAsyncThunk(
  'services/create',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await createServiceApi(formData);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data?.errors ?? {})[0]?.[0]
        || 'Erreur création.';
      return rejectWithValue(msg);
    }
  }
);

export const updateService = createAsyncThunk(
  'services/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const { data: updated } = await updateServiceApi(id, data);
      return updated;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Erreur mise à jour.');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteServiceApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Erreur suppression.');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────
const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    services     : [],
    currentService: null,
    pagination   : { current_page: 1, last_page: 1, total: 0 },
    loading      : false,
    error        : null,
  },
  reducers: {
    clearCurrentService: (state) => { state.currentService = null; },
    clearServiceError  : (state) => { state.error = null; },
  },
  extraReducers: (builder) => {

    // fetchAll
    builder
      .addCase(fetchServices.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchServices.fulfilled, (s, { payload }) => {
        s.loading    = false;
        s.services   = payload.data;
        s.pagination = {
          current_page: payload.current_page,
          last_page   : payload.last_page,
          total       : payload.total,
        };
      })
      .addCase(fetchServices.rejected,  (s, { payload }) => {
        s.loading = false; s.error = payload;
      });

    // fetchOne
    builder
      .addCase(fetchService.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchService.fulfilled, (s, { payload }) => {
        s.loading = false; s.currentService = payload;
      })
      .addCase(fetchService.rejected,  (s, { payload }) => {
        s.loading = false; s.error = payload;
      });

    // create
    builder
      .addCase(createService.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(createService.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.services.unshift(payload);
      })
      .addCase(createService.rejected,  (s, { payload }) => {
        s.loading = false; s.error = payload;
      });

    // update
    builder
      .addCase(updateService.fulfilled, (s, { payload }) => {
        s.loading = false;
        const idx = s.services.findIndex((sv) => sv.id === payload.id);
        if (idx !== -1) s.services[idx] = payload;
        if (s.currentService?.id === payload.id) s.currentService = payload;
      });

    // delete
    builder
      .addCase(deleteService.fulfilled, (s, { payload: id }) => {
        s.services = s.services.filter((sv) => sv.id !== id);
        if (s.currentService?.id === id) s.currentService = null;
      });
  },
});

export const { clearCurrentService, clearServiceError } = serviceSlice.actions;
export default serviceSlice.reducer;
