"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

/**
 * ArrowIndicator
 * Purely visual animated chevrons to indicate flow.
 * Marked aria-hidden and role="presentation" for accessibility.
 */
export function ArrowIndicator({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.div
      key="arrow-indicator"
      className={`flex w-full flex-col items-center justify-center md:w-auto ${show ? "mt-2 md:mt-0" : ""} `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-hidden="true"
      role="presentation"
      tabIndex={-1}
      data-visual-indicator
    >
      {/* Mobile: Downward arrow with opacity animation */}
      <div
        className="mb-2 block md:hidden"
        aria-hidden="true"
        role="presentation"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3, y: 0, scale: 1 }}
            animate={{
              opacity: [0.3, 1, 0.7, 0.3],
              y: [0, -6, 0, 0],
              scale: [1, 1.15, 1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              times: [0, 0.3, 0.6, 1],
              ease: "easeInOut",
            }}
            aria-hidden="true"
            role="presentation"
            tabIndex={-1}
          >
            <ChevronDown
              className="text-primary h-6 w-6"
              aria-hidden="true"
              focusable="false"
              role="presentation"
            />
          </motion.div>
        ))}
      </div>
      {/* Desktop: Chevrons */}
      <div
        className="hidden items-center justify-center gap-2 px-6 md:flex"
        aria-hidden="true"
        role="presentation"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3, y: 0, scale: 1 }}
            animate={{
              opacity: [0.3, 1, 0.7, 0.3],
              y: [0, -6, 0, 0],
              scale: [1, 1.15, 1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              times: [0, 0.3, 0.6, 1],
              ease: "easeInOut",
            }}
            aria-hidden="true"
            role="presentation"
            tabIndex={-1}
          >
            <ChevronRight
              className="text-primary h-6 w-6"
              aria-hidden="true"
              focusable="false"
              role="presentation"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
