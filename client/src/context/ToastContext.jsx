/**
 * context/ToastContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Global toast / notification system.
 * Wrap <App> with <ToastProvider> and call `useToast()` anywhere in the tree.
 *
 * Usage:
 *   const { showToast } = useToast();
 *   showToast('Clinic saved!', 'success');
 *   showToast('Something went wrong.', 'error');
 */

import { createContext, useContext, useState, useCallback } from 'react';
import styles from './ToastContext.module.css';

const ToastContext = createContext(null);

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.toastContainer} role="region" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type]}`}
          >
            <span className={styles.toastIcon}>
              {toast.type === 'success' && '✓'}
              {toast.type === 'error'   && '✕'}
              {toast.type === 'info'    && 'ℹ'}
              {toast.type === 'warning' && '⚠'}
            </span>
            <span className={styles.toastMessage}>{toast.message}</span>
            <button
              className={styles.toastDismiss}
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** @returns {{ showToast: (message: string, type?: 'success'|'error'|'info'|'warning', duration?: number) => void }} */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
