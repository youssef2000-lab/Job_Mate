// src/components/ui/Toast.jsx
// ─────────────────────────────────────────────────────────────
// FIX C (cont.) — ToastContainer now reads toasts/removeToast
//   from context directly instead of receiving them as props.
//   This makes it work with the ToastProvider in main.jsx and
//   removes the need for App.jsx to call useToast().
// ─────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast glass ${type} fade-in-right`}>
      <div className="toast-content">
        {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
        <span>{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

// FIX C: reads from context — no props needed, works anywhere in the tree
export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
