// components/ui/Toast.jsx
// Toast context + provider tanpa dependency tambahan.
// Posisi: kanan atas di desktop (sm+), bawah tengah di mobile. Auto-dismiss 4 detik.

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext(null);

const AUTO_DISMISS_MS = 4000;

const TONES = {
  success: {
    icon: FiCheckCircle,
    iconClass: "text-emerald-500",
    bar: "border-l-emerald-500",
  },
  error: {
    icon: FiAlertCircle,
    iconClass: "text-red-500",
    bar: "border-l-red-500",
  },
  info: {
    icon: FiInfo,
    iconClass: "text-brand-500",
    bar: "border-l-brand-500",
  },
};

function ToastItem({ toast, onDismiss }) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timerRef.current);
  }, [toast.id, onDismiss]);

  const tone = TONES[toast.variant] ?? TONES.info;
  const Icon = toast.icon ?? tone.icon;

  return (
    <div
      role="status"
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-slate-200 border-l-4 bg-white px-4 py-3 shadow-overlay ${tone.bar} sm:w-80`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone.iconClass}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {toast.title ? (
          <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
        ) : null}
        {toast.message ? (
          <p className="mt-0.5 break-words text-sm text-slate-600">
            {toast.message}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Tutup notifikasi"
        className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      >
        <FiX className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((input) => {
    const toast =
      typeof input === "string"
        ? { message: input }
        : input ?? {};
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
    setToasts((list) => [...list, { ...toast, id }]);
    return id;
  }, []);

  const api = useMemo(
    () => ({
      show,
      dismiss,
      success: (message, opts = {}) => show({ message, variant: "success", ...opts }),
      error: (message, opts = {}) => show({ message, variant: "error", ...opts }),
      info: (message, opts = {}) => show({ message, variant: "info", ...opts }),
    }),
    [show, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:top-20 sm:bottom-auto sm:items-end sm:px-0"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast harus dipakai di dalam <ToastProvider>");
  }
  return ctx;
}

export default ToastProvider;
