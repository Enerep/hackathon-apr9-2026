import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ToastContext = createContext(null);
export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, ms = 2500) => { setToast(msg); setTimeout(() => setToast(null), ms); }, []);
  const value = useMemo(() => ({ showToast }), [showToast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed bottom-[140px] left-1/2 -translate-x-1/2 z-[300] toast-in pointer-events-none">
          <div className="bg-dark text-cream px-5 py-2.5 rounded-full text-sm font-medium shadow-xl whitespace-nowrap">{toast}</div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export default function Toast() { return null; }
