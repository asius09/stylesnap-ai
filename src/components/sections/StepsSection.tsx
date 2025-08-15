import { stepsContent } from "@/data";
import React from "react";

export const StepsSection = () => {
  return (
    <section
      id="steps-section"
      className="mt-24 flex w-full max-w-7xl flex-col items-center justify-center"
      aria-labelledby="steps-section-title"
      role="region"
    >
      <h2
        id="steps-section-title"
        className="pb-8 text-center text-2xl font-semibold text-text-color md:text-3xl md:text-nowrap lg:text-4xl"
      >
        Convert Your Image in 4 Simple Steps
      </h2>
      <ol
        className="mt-12 grid w-full grid-cols-1 items-center justify-center gap-8 px-4 sm:grid-cols-2 sm:px-6"
        aria-label="Image conversion steps"
      >
        {stepsContent.map((step, idx) => (
          <li
            id={step.id}
            key={step.id}
            className="bg-background/60 hover:shadow-primary/30 focus-ring-primary selection-primary relative z-0 w-full rounded-xl p-6 hover:shadow-md"
            aria-label={`Step ${idx + 1}: ${step.heading}`}
            tabIndex={0}
          >
            {/* Glossy effect overlay for steps */}
            <div
              aria-hidden="true"
              className="glossy-effect pointer-events-none absolute inset-0 z-0 rounded-[0.75rem]"
            />
            <div
              className="border-primary/40 from-primary/80 via-primary/60 to-background/80 absolute -top-6 -left-2 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border-2 bg-gradient-to-br shadow-[0_2px_16px_0_rgba(120,90,255,0.35),0_0_0_2px_rgba(255,255,255,0.12)_inset]"
              aria-hidden="true"
            >
              <svg
                className="absolute z-[1] h-12 w-12"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <defs>
                  <radialGradient
                    id={`glossy-bg-${idx}`}
                    cx="50%"
                    cy="40%"
                    r="70%"
                  >
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
                    <stop
                      offset="60%"
                      stopColor="currentColor"
                      stopOpacity="0.18"
                    />
                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity="0.08"
                    />
                  </radialGradient>
                  <linearGradient
                    id={`shine-${idx}`}
                    x1="0"
                    y1="0"
                    x2="48"
                    y2="24"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                    <stop offset="80%" stopColor="#fff" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <rect
                  x="0.2"
                  y="0.2"
                  width="47.6"
                  height="47.6"
                  rx="12"
                  fill={`url(#glossy-bg-${idx})`}
                />
                {/* Glossy shine overlay */}
                <rect
                  x="0.2"
                  y="0.2"
                  width="47.6"
                  height="18"
                  rx="12"
                  fill={`url(#shine-${idx})`}
                />
              </svg>
              <span
                className="selection:bg-primary/50 relative z-10 text-2xl font-bold text-text-color drop-shadow-[0_2px_8px_rgba(120,90,255,0.25)] [filter:brightness(1.15)] [text-shadow:0_2px_8px_rgba(120,90,255,0.25),0_1px_0_#fff8] selection:text-text-color"
                aria-label={`Step ${idx + 1}`}
              >
                {idx + 1}
              </span>
            </div>
            <h3
              className="selection:bg-primary/50 relative z-10 mt-4 text-left text-lg font-semibold text-text-color selection:text-text-color"
              tabIndex={-1}
            >
              {step.heading}
            </h3>
            <p className="selection:bg-primary/50 relative z-10 text-left text-base font-medium text-text-color/60 selection:text-text-color">
              {step.detail}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
};
