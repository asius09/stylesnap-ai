"use client";
/**
 * Problem:
 * If you use <Toast /> in multiple places (e.g. in two different files/components),
 * each instance will have its own state and will render its own toasts.
 * This leads to overlapping toasts and no global array management.
 *
 * Solution:
 * Use a global Toast context/provider and a single ToastContainer at the root of your app.
 * Expose a function (e.g. toast()) to add toasts from anywhere.
 * This way, all toasts are managed in a single array and rendered in one place.
 *
 * Example implementation below:
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// Toast variant styles
const variant = {
  error: {
    bg: "bg-gradient-to-br from-red-900/90 via-orange-700/80 to-red-800/80 backdrop-blur-md",
    text: "text-white",
    title: "Error",
  },
  info: {
    bg: "bg-gradient-to-br from-indigo-900/90 via-purple-700/80 to-indigo-800/80 backdrop-blur-md",
    text: "text-white",
    title: "Info",
  },
  success: {
    bg: "bg-gradient-to-br from-emerald-900/90 via-lime-700/80 to-emerald-800/80 backdrop-blur-md",
    text: "text-white",
    title: "Success",
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
  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    setToasts((prev) => {
      // Check if a toast with the same type and message already exists
      const isDuplicate = prev.some(
        (t) => t.type === toast.type && t.message === toast.message,
      );
      if (isDuplicate) {
        return prev;
      }
      return [
        ...prev,
        { ...toast, id: Date.now() + Math.floor(Math.random() * 10000) },
      ];
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

// Custom hook to use toast
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};

// ToastContainer renders all toasts
export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed top-16 left-1/2 z-50 flex w-full max-w-xs -translate-x-1/2 flex-col items-center">
      <div
        className={`relative flex w-full flex-col items-center min-h-[${toasts.length * 32}px]`}
      >
        <AnimatePresence initial={true}>
          {toasts.map((toast, idx) => (
            <motion.div
              key={toast.id}
              className={`absolute right-0 left-0 flex w-full justify-center z-[${toasts.length - idx}]`}
              initial={{
                opacity: 0,
                y: 0,
                scale: 0.95,
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
              }}
              animate={{
                opacity: 1,
                y: idx === 0 ? 0 : idx * 10,
                scale: 1 - idx * 0.04,
                boxShadow: `0 ${8 + idx * 4}px ${24 + idx * 8}px 0 rgba(0,0,0,${0.15 + idx * 0.05})`,
              }}
              exit={{
                opacity: 0,
                y: 0,
                scale: 0.95,
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                delay: idx * 0.7,
              }}
            >
              <ToastItem
                id={toast.id}
                type={toast.type}
                message={toast.message}
                onRemove={removeToast}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
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
    }, 3500);
    return () => clearTimeout(timeout);
  }, [id, onRemove]);

  const style = variant[type] || variant.info;

  return (
    <div
      className={`flex w-full flex-col items-start rounded-lg ${style.bg} p-2 md:p-4 ${style.text} pointer-events-auto shadow-2xl`}
    >
      <div className="flex w-full items-center justify-between">
        <p className="text-xs leading-5 font-bold md:text-sm md:leading-6">
          {style.title} Message:
        </p>
        <button
          className="ml-1 cursor-pointer text-sm font-bold opacity-70 hover:opacity-100 md:ml-2 md:text-base"
          onClick={() => onRemove(id)}
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      </div>
      <span className="text-[10px] leading-relaxed font-medium md:text-xs">
        {message}
      </span>
    </div>
  );
};

/**
 * Usage:
 * 1. Wrap your app with <ToastProvider> at the root (e.g. in _app.tsx or layout.tsx).
 * 2. Use the useToast() hook anywhere to add a toast:
 *    const { addToast } = useToast();
 *    addToast({ type: "success", message: "Hello!" });
 * 3. Only one ToastContainer will render all toasts, no overlap.
 */
