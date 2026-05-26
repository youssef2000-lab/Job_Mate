// src/store/authSlice.js
// ─────────────────────────────────────────────────────────────
// Replaces the fake localStorage auth with real Sanctum API.
// Token is stored in localStorage (key: jobmate_token).
// ─────────────────────────────────────────────────────────────

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi, logoutApi, getMeApi } from '../api/authApi';

// ── Helpers ───────────────────────────────────────────────────
const TOKEN_KEY = 'jobmate_token';
const USER_KEY  = 'jobmate_user';

const saveSession  = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY,  JSON.stringify(user));
};
const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
const loadUser  = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); }
  catch { return null; }
};

// ── Async thunks ──────────────────────────────────────────────

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await loginApi(credentials);
      saveSession(data.token, data.user);
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data?.errors ?? {})[0]?.[0]
        || 'Connexion échouée.';
      return rejectWithValue(msg);
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await registerApi(formData);
      saveSession(data.token, data.user);
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data?.errors ?? {})[0]?.[0]
        || 'Inscription échouée.';
      return rejectWithValue(msg);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (_e) {
      // Even if request fails, clear local session
    } finally {
      clearSession();
    }
  }
);

export const fetchMeThunk = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getMeApi();
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      return data;
    } catch (err) {
      clearSession();
      return rejectWithValue('Session expirée.');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser : loadUser(),
    isLoggedIn  : !!localStorage.getItem(TOKEN_KEY),
    loading     : false,
    error       : null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    // Optimistic update after avatar upload
    setAvatar:  (state, { payload }) => {
      if (state.currentUser) {
        state.currentUser.avatar_url = payload;
        localStorage.setItem(USER_KEY, JSON.stringify(state.currentUser));
      }
    },
  },
  extraReducers: (builder) => {
    const pending  = (state) => { state.loading = true;  state.error = null; };
    const rejected = (state, { payload }) => {
      state.loading = false;
      state.error   = payload ?? 'Une erreur est survenue.';
    };

    // ── login ────────────────────────────────────────────────
    builder
      .addCase(loginThunk.pending,   pending)
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.loading     = false;
        state.currentUser = payload;
        state.isLoggedIn  = true;
        state.error       = null;
      })
      .addCase(loginThunk.rejected,  rejected);

    // ── register ─────────────────────────────────────────────
    builder
      .addCase(registerThunk.pending,   pending)
      .addCase(registerThunk.fulfilled, (state, { payload }) => {
        state.loading     = false;
        state.currentUser = payload;
        state.isLoggedIn  = true;
        state.error       = null;
      })
      .addCase(registerThunk.rejected,  rejected);

    // ── logout ───────────────────────────────────────────────
    builder
      .addCase(logoutThunk.fulfilled, (state) => {
        state.currentUser = null;
        state.isLoggedIn  = false;
        state.error       = null;
      });

    // ── me ───────────────────────────────────────────────────
    builder
      .addCase(fetchMeThunk.fulfilled, (state, { payload }) => {
        state.currentUser = payload;
        state.isLoggedIn  = true;
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.currentUser = null;
        state.isLoggedIn  = false;
      });
  },
});

export const { clearError, setAvatar } = authSlice.actions;
export default authSlice.reducer;
