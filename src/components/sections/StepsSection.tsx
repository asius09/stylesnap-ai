import { stepsContent } from "@/data";
import React from "react";
import { Button } from "../Button";
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
      initial={{ opacity: 0, filter: "blur(8px)" }}
      whileInView={{
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.5, ease: "easeOut", delay: 0.7 },
      }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.h2
        id="steps-section-title"
        className="text-text-color text-center text-2xl font-semibold md:text-3xl md:text-nowrap lg:text-4xl"
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: "easeOut", delay: 0.8 },
        }}
      >
        Convert Your Image in 4 Simple Steps
      </motion.h2>
      <motion.ol
        className="mt-12 grid w-full grid-cols-1 items-center justify-center gap-8 px-6 sm:grid-cols-2"
        aria-label="Image conversion steps"
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: "easeOut", delay: 0.9 },
        }}
      >
        {stepsContent.map((step, idx) => (
          <motion.li
            id={step.id}
            key={step.id}
            className="bg-background/60 hover:shadow-primary/30 focus-ring-primary selection-primary relative z-0 w-full rounded-xl p-4 hover:shadow-md md:p-6"
            aria-label={`Step ${idx + 1}: ${step.heading}`}
            tabIndex={0}
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.6,
                delay: 1.0 + idx * 0.15,
                ease: "easeOut",
              },
            }}
          >
            <motion.div
              className="border-primary/40 from-primary/90 via-primary/60 to-background/80 absolute -top-4 -left-2 z-10 flex h-8 w-8 items-center justify-center rounded-xl border-2 bg-gradient-to-br shadow-sm md:h-12 md:w-12 md:rounded-2xl"
              aria-hidden="true"
              initial={{ scale: 0.7, opacity: 0, filter: "blur(8px)" }}
              animate={{
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
                transition: {
                  delay: 1.03 + idx * 0.15,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 180,
                },
              }}
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
              initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
              animate={{
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                transition: {
                  delay: 1.13 + idx * 0.15,
                  duration: 0.4,
                  ease: "easeOut",
                },
              }}
            >
              {step.heading}
            </motion.h3>
            <motion.p
              className="text-text-color/60 selection-primary relative z-10 text-left text-base font-normal"
              initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
              animate={{
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                transition: {
                  delay: 1.21 + idx * 0.15,
                  duration: 0.4,
                  ease: "easeOut",
                },
              }}
            >
              {step.detail}
            </motion.p>
          </motion.li>
        ))}
      </motion.ol>

      <motion.div
        className="flex w-full justify-center"
        initial={{ opacity: 0, y: 30, scale: 0.98, filter: "blur(8px)" }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.7, delay: 1.7, ease: "easeOut" },
        }}
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
              initial={{ x: 0 }}
              whileHover={{ x: 6 }}
              whileFocus={{ x: 6 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
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
