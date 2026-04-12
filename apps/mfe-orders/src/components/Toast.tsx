import { useEffect, useState, useCallback } from 'react';
import './Toast.css';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="toast-container" role="region" aria-label="Уведомления" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const duration = toast.duration || 4000;
    const timeoutId = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, duration);

    return () => clearTimeout(timeoutId);
  }, [toast, onRemove]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  }, [onRemove, toast.id]);

  const icons: Record<string, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div
      className={`toast toast-${toast.type} ${isVisible ? 'toast-visible' : ''} ${isExiting ? 'toast-exit' : ''}`}
      role="alert"
    >
      <span className="toast-icon" aria-hidden="true">{icons[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close"
        onClick={handleClose}
        aria-label="Закрыть уведомление"
        type="button"
      >
        ×
      </button>
    </div>
  );
}

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info', duration?: number) => {
    const id = `toast-${++toastIdCounter}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message: string) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message: string) => addToast(message, 'error'), [addToast]);
  const info = useCallback((message: string) => addToast(message, 'info'), [addToast]);
  const warning = useCallback((message: string) => addToast(message, 'warning'), [addToast]);

  return { toasts, addToast, removeToast, success, error, info, warning };
}