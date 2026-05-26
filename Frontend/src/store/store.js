// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer    from './authSlice';
import serviceReducer from './serviceSlice';
import bookingReducer from './bookingSlice';
import reviewReducer  from './reviewSlice';

export const store = configureStore({
  reducer: {
    auth    : authReducer,
    services: serviceReducer,
    bookings: bookingReducer,
    reviews : reviewReducer,
  },
  // Allows non-serializable values only in specific paths if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
