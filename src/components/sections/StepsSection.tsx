import { stepsContent } from "@/data";
import React from "react";
import { Button } from "../ui/Button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const StepsSection = () => {
  // Accessibility: Focus and scroll to upload section
  function handleCTAClick() {
    const uploadSection =
      document.getElementById("upload-section") ||
      document.getElementById("hero-upload-section");
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: "smooth", block: "center" });
      // Try to focus the first focusable element inside upload section
      const focusable = uploadSection.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable && typeof (focusable as HTMLElement).focus === "function") {
        (focusable as HTMLElement).focus();
      } else {
        uploadSection.focus?.();
      }
    }
  }

  return (
    <motion.section
      id="steps-section"
      className="flex w-full max-w-7xl flex-col items-center justify-center py-20"
      aria-labelledby="steps-section-title"
      role="region"
      initial={{ opacity: 0, filter: "blur(16px)" }}
      whileInView={{
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
      }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.h2
        id="steps-section-title"
        className="text-text-color text-center text-2xl font-semibold md:text-3xl md:text-nowrap lg:text-4xl"
        initial={{ opacity: 0, y: 32, filter: "blur(12px)" }}
        whileInView={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 },
        }}
        viewport={{ once: true }}
      >
        Convert Your Image in 4 Simple Steps
      </motion.h2>
      <motion.ol
        className="mt-12 grid w-full grid-cols-1 items-center justify-center gap-8 px-6 sm:grid-cols-2"
        aria-label="Image conversion steps"
        initial={{ opacity: 0, y: 32, filter: "blur(12px)" }}
        whileInView={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.6 },
        }}
        viewport={{ once: true }}
      >
        {stepsContent.map((step, idx) => (
          <motion.li
            id={step.id}
            key={step.id}
            className="bg-background/60 hover:shadow-primary/30 focus-ring-primary selection-primary relative z-0 w-full rounded-xl p-4 hover:shadow-md md:p-6"
            aria-label={`Step ${idx + 1}: ${step.heading}`}
            tabIndex={0}
            initial={{ opacity: 0, y: 48, scale: 0.96, filter: "blur(16px)" }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: {
                duration: 0.7,
                delay: 0.8 + idx * 0.18,
                type: "spring",
                bounce: 0.18,
                stiffness: 120,
              },
            }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Animated blurred accent */}
            <motion.div
              className="bg-primary/30 pointer-events-none absolute -top-8 -left-8 z-0 h-24 w-24 rounded-full opacity-60 blur-2xl"
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.7, filter: "blur(32px)" }}
              whileInView={{
                opacity: 0.7,
                scale: 1.1,
                filter: "blur(32px)",
                transition: {
                  delay: 0.9 + idx * 0.18,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              viewport={{ once: true }}
            />
            <motion.div
              className="border-primary/40 from-primary/90 via-primary/60 to-background/80 absolute -top-4 -left-2 z-10 flex h-8 w-8 items-center justify-center rounded-xl border-2 bg-gradient-to-br shadow-sm md:h-12 md:w-12 md:rounded-2xl"
              aria-hidden="true"
              initial={{ scale: 0.7, opacity: 0, filter: "blur(8px)" }}
              whileInView={{
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
                transition: {
                  delay: 1.0 + idx * 0.18,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 180,
                },
              }}
              viewport={{ once: true }}
            >
              <span
                className="drop-shadow-[0_0_8px_theme(colors.primary)] pointer-events-none relative z-10 text-lg font-extrabold text-white md:text-2xl"
                aria-label={`Step ${idx + 1}`}
                aria-hidden="true"
              >
                {idx + 1}
              </span>
              <span
                className="bg-primary pointer-events-none absolute inset-0 z-0 rounded-xl opacity-60 blur-[6px] md:rounded-2xl"
                aria-hidden="true"
              />
            </motion.div>
            <motion.h3
              className="text-text-color selection-primary relative z-10 mt-2 text-left text-base font-semibold md:mt-4"
              tabIndex={-1}
              initial={{ opacity: 0, x: -18, filter: "blur(8px)" }}
              whileInView={{
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                transition: {
                  delay: 1.18 + idx * 0.18,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              viewport={{ once: true }}
            >
              {step.heading}
            </motion.h3>
            <motion.p
              className="text-text-color/60 selection-primary relative z-10 text-left text-base font-normal"
              initial={{ opacity: 0, x: 18, filter: "blur(8px)" }}
              whileInView={{
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                transition: {
                  delay: 1.28 + idx * 0.18,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              viewport={{ once: true }}
            >
              {step.detail}
            </motion.p>
          </motion.li>
        ))}
      </motion.ol>

      <motion.div
        className="flex w-full justify-center"
        initial={{ opacity: 0, y: 32, scale: 0.98, filter: "blur(12px)" }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.7, delay: 1.7, ease: [0.22, 1, 0.36, 1] },
        }}
        viewport={{ once: true }}
      >
        <Button
          variant="filled"
          size="lg"
          className="group mt-20"
          onClick={handleCTAClick}
          aria-label="Start creating your stylized image now"
          tabIndex={0}
        >
          <span className="sr-only">
            Start creating your stylized image now
          </span>
          <span aria-hidden="true" className="flex items-center">
            Start Creating Now
            <motion.span
              initial={{ x: 0, filter: "blur(0px)" }}
              whileHover={{ x: 8, filter: "blur(0px)" }}
              whileFocus={{ x: 8, filter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 320, damping: 16 }}
              className="inline-flex"
            >
              <ArrowRight
                className="ml-3 h-6 w-6 transition-transform duration-200"
                aria-hidden="true"
                focusable="false"
              />
            </motion.span>
          </span>
        </Button>
      </motion.div>
    </motion.section>
  );
};
