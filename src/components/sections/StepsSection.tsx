import { stepsContent } from "@/data";
import React from "react";
import { Button } from "../Button";
import { ArrowRight } from "lucide-react";

export const StepsSection = () => {
  // Accessibility: Focus and scroll to upload section
  const handleCTAClick = () => {
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
  };
  return (
    <section
      id="steps-section"
      className="flex w-full max-w-7xl flex-col items-center justify-center py-20"
      aria-labelledby="steps-section-title"
      role="region"
    >
      <h2
        id="steps-section-title"
        className="text-text-color text-center text-2xl font-semibold md:text-3xl md:text-nowrap lg:text-4xl"
      >
        Convert Your Image in 4 Simple Steps
      </h2>
      <ol
        className="mt-12 grid w-full grid-cols-1 items-center justify-center gap-8 px-6 sm:grid-cols-2"
        aria-label="Image conversion steps"
      >
        {stepsContent.map((step, idx) => (
          <li
            id={step.id}
            key={step.id}
            className="bg-background/60 hover:shadow-primary/30 focus-ring-primary selection-primary relative z-0 w-full rounded-xl p-4 hover:shadow-md md:p-6"
            aria-label={`Step ${idx + 1}: ${step.heading}`}
            tabIndex={0}
          >
            <div
              className="border-primary/40 from-primary/90 via-primary/60 to-background/80 absolute -top-4 -left-2 z-10 flex h-8 w-8 items-center justify-center rounded-xl border-2 bg-gradient-to-br shadow-sm md:h-12 md:w-12 md:rounded-2xl"
              aria-hidden="true"
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
            </div>
            <h3
              className="text-text-color selection-primary relative z-10 mt-2 text-left text-base font-semibold md:mt-4"
              tabIndex={-1}
            >
              {step.heading}
            </h3>
            <p className="text-text-color/60 selection-primary relative z-10 text-left text-base font-normal">
              {step.detail}
            </p>
          </li>
        ))}
      </ol>

      <Button
        variant="filled"
        size="lg"
        className="mt-20"
        onClick={handleCTAClick}
        aria-label="Start creating your stylized image now"
        tabIndex={0}
      >
        <span className="sr-only">Start creating your stylized image now</span>
        <span aria-hidden="true" className="flex items-center">
          Start Creating Now
          <ArrowRight
            className="ml-3 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1 group-focus:translate-x-1"
            aria-hidden="true"
            focusable="false"
          />
        </span>
      </Button>
    </section>
  );
};
