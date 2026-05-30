// src/main.jsx
// ─────────────────────────────────────────────────────────────
// BUG A — ToastProvider was never mounted.
//   useToast() in App.jsx throws: "useToast must be used within a ToastProvider"
//   This throws before anything renders → blank white screen.
//
// BUG B — AuthModalProvider was never mounted.
//   Navbar, AuthModal, ProfilePage all call useAuthModal().
//   Throws: "useAuthModal must be used within an AuthModalProvider"
//   Second crash after BUG A would be fixed.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToastProvider }     from './hooks/useToast';          // FIX A
import { AuthModalProvider } from './context/AuthModalContext'; // FIX B
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <AuthModalProvider>
          <App />
        </AuthModalProvider>
      </ToastProvider>
    </Provider>
  </React.StrictMode>,
);
