"use client";
import { Step } from "@/types/style.types";
import { motion } from "motion/react";
import { MoveRight } from "lucide-react";
// --- Progress Bar Component ---
export function ProgressBar({ steps }: { steps: Step[] }) {
  return (
    <nav
      aria-label="Progress"
      className="mb-5 flex flex-row items-center gap-0.5 text-xs text-white/55 md:mb-3 md:gap-2 md:text-sm"
    >
      {steps.map((step, idx) => (
        <motion.div
          key={step.id}
          id={step.id}
          className="flex items-center gap-0.5 md:gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.08 }}
        >
          <span
            className={`selection:bg-primary/50 text-nowrap selection:text-white ${
              step.status ? "text-primary font-semibold" : ""
            }`}
          >
            {step.label}
          </span>
          {idx < steps.length - 1 && (
            <MoveRight
              className={`h-5 w-5 ${step.status ? "text-primary" : ""}`}
            />
          )}
        </motion.div>
      ))}
    </nav>
  );
}
