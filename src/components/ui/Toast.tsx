"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Info, AlertTriangle } from "lucide-react";

// Toast variant styles with icons
const variant = {
  error: {
    bg: "bg-gradient-to-br from-red-900/90 via-orange-700/80 to-red-800/80 backdrop-blur-md border border-white/10",
    text: "text-text-color",
    icon: (
      <AlertTriangle
        className="h-5 w-5 rounded-full bg-red-900/30 p-0.5 text-red-300"
        aria-hidden="true"
      />
    ),
    accent: "border-red-500/80",
  },
  info: {
    bg: "bg-gradient-to-br from-indigo-900/90 via-purple-700/80 to-indigo-800/80 backdrop-blur-md border border-white/10",
    text: "text-text-color",
    icon: (
      <Info
        className="h-5 w-5 rounded-full bg-indigo-900/30 p-0.5 text-indigo-300"
        aria-hidden="true"
      />
    ),
    accent: "border-indigo-500/80",
  },
  success: {
    bg: "bg-gradient-to-br from-emerald-900/90 via-lime-700/80 to-emerald-800/80 backdrop-blur-md border border-white/10",
    text: "text-text-color",
    icon: (
      <CheckCircle2
        className="h-5 w-5 rounded-full bg-emerald-900/30 p-0.5 text-emerald-300"
        aria-hidden="true"
      />
    ),
    accent: "border-emerald-500/80",
  },
};

// Toast context types
type ToastType = keyof typeof variant;
type ToastData = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastContextType = {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: number) => void;
};

// Create context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast Provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Add toast with unique id, prevent duplicate toasts with same type and message
  // Only one toast at a time (compact, single message)
  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    setToasts((prev) => {
      // If the same toast is already shown, do nothing
      if (
        prev.length > 0 &&
        prev[0].type === toast.type &&
        prev[0].message === toast.message
      ) {
        return prev;
      }
      // Only show one toast at a time
      return [{ ...toast, id: Date.now() + Math.floor(Math.random() * 10000) }];
    });
  }, []);

  // Remove toast by id
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  // Only show the first toast (compact, single message)
  const toast = toasts[0];
  return (
    <div className="pointer-events-none fixed top-[72px] left-1/2 z-50 flex w-full max-w-xs -translate-x-1/2 flex-col items-center px-2">
      <AnimatePresence initial={true}>
        {toast && (
          <motion.div
            key={toast.id}
            className="w-full"
            initial={{
              opacity: 0,
              y: -16,
              scale: 0.98,
              boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              boxShadow: "0 8px 24px 0 rgba(0,0,0,0.18)",
            }}
            exit={{
              opacity: 0,
              y: -16,
              scale: 0.98,
              boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
            }}
            transition={{
              duration: 0.35,
              ease: "easeInOut",
            }}
          >
            <ToastItem
              id={toast.id}
              type={toast.type}
              message={toast.message}
              onRemove={removeToast}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Individual Toast
type ToastItemProps = {
  id: number;
  type: ToastType;
  message: string;
  onRemove: (id: number) => void;
};

const ToastItem = ({ id, type, message, onRemove }: ToastItemProps) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onRemove(id);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [id, onRemove]);

  const style = variant[type] || variant.info;

  return (
    <div
      className={`flex w-full items-center gap-2 rounded-lg ${style.bg} ${style.text} pointer-events-auto border-l-4 p-2 shadow-2xl ${style.accent} min-h-[40px]`}
      role="alert"
      aria-live="polite"
    >
      <span className="flex flex-shrink-0 items-center">{style.icon}</span>
      <span className="selection-primary flex-1 text-xs font-medium break-words md:text-sm">
        {message}
      </span>
      <button
        className="ml-1 cursor-pointer rounded-full p-1 text-xs font-bold opacity-70 transition hover:bg-white/10 hover:opacity-100"
        onClick={() => onRemove(id)}
        aria-label="Dismiss notification"
        tabIndex={0}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
