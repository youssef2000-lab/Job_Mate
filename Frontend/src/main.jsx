// src/main.jsx
// ─────────────────────────────────────────────────────────────
// ROOT CAUSE FIXES APPLIED HERE:
//
// FIX A — ToastProvider was NEVER mounted.
//   App.jsx calls useToast() inside AppContent, but ToastProvider
//   only lives in useToast.jsx and was never placed in the tree.
//   useToast() throws: "useToast must be used within a ToastProvider"
//   This error is thrown before ANY component renders → blank screen.
//
// FIX B — AuthModalProvider was NEVER mounted.
//   Navbar, AuthModal and ProfilePage all call useAuthModal().
//   AuthModalProvider is defined in context/AuthModalContext.jsx
//   but was never wrapped around the app.
//   useAuthModal() throws: "useAuthModal simple must be used within an AuthModalProvider"
//   This crashes the render immediately after FIX A would be resolved.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToastProvider } from './hooks/useToast';          // FIX A
import { AuthModalProvider } from './context/AuthModalContext'; // FIX B
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>          {/* FIX A: useToast() now has a valid context */}
        <AuthModalProvider>    {/* FIX B: useAuthModal() now has a valid context */}
          <App />
        </AuthModalProvider>
      </ToastProvider>
    </Provider>
  </React.StrictMode>,
);
