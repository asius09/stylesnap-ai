import { stepsContent } from "@/data";
import React from "react";

export const StepsSection = () => {
  return (
    <section
      id="steps-section"
      className="mt-24 flex w-full max-w-7xl flex-col items-center justify-center"
    >
      <h2 className="pb-8 text-center text-2xl font-semibold text-white md:text-3xl md:text-nowrap lg:text-4xl">
        Convert Your Image in 4 Simple Steps
      </h2>
      <div className="mt-12 grid w-full grid-cols-1 items-center justify-center gap-8 px-4 sm:grid-cols-2 sm:px-6">
        {stepsContent.map((step, idx) => (
          <div
            id={step.id}
            key={step.id}
            className="bg-background/60 hover:shadow-primary/30 relative w-full rounded-xl px-16 py-6 hover:shadow-md"
            style={{
              position: "relative",
              zIndex: 0,
            }}
          >
            {/* Glossy effect overlay for steps */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.02) 100%)",
                WebkitMaskImage:
                  "linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%)",
                maskImage:
                  "linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%)",
                borderRadius: "0.75rem",
              }}
            />
            <div
              className="shadow-[0_2px_16px_0_theme(colors.primary/60)] from-primary/80 via-primary/60 to-background/80 border-primary/40 absolute -top-4 left-0 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border-2 bg-gradient-to-br"
              style={{
                boxShadow:
                  "0 2px 16px 0 rgba(120, 90, 255, 0.35), 0 0 0 2px rgba(255,255,255,0.12) inset",
                position: "absolute",
                top: "-1.5rem",
                left: "-0.5rem",
              }}
            >
              <svg
                className="absolute z-[1] h-12 w-12"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
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
                className="relative z-10 text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(120,90,255,0.25)]"
                style={{
                  textShadow: "0 2px 8px rgba(120,90,255,0.25), 0 1px 0 #fff8",
                  filter: "brightness(1.15)",
                }}
              >
                {idx + 1}
              </span>
            </div>
            <p className="relative z-10 text-left text-lg font-semibold text-white">
              {step.heading}
            </p>
            <span className="relative z-10 text-left text-base font-medium text-white/60">
              {step.detail}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
