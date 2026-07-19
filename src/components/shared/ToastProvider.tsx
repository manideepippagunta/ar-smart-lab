import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Toast {
  id: string;
  title: string;
  type?: 'success' | 'info' | 'warning';
}

interface ToastContextType {
  showToast: (title: string, type?: 'success' | 'info' | 'warning') => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (title: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, title, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-auto bg-[#18181B] text-white border border-zinc-800 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 max-w-sm"
            >
              {toast.type === 'success' && <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />}
              {toast.type === 'warning' && <AlertCircle size={15} className="text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info size={15} className="text-blue-400 shrink-0" />}
              <span className="text-xs font-medium">{toast.title}</span>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-zinc-500 hover:text-white ml-2"
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
