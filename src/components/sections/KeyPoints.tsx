import React from "react";
import { keyPoints } from "@/data";
import { Check } from "lucide-react";

export const KeyPoints = () => {
  return (
    <section
      id="key-points"
      className="mt-8 flex w-full max-w-7xl flex-col items-center justify-center gap-4 px-4 text-white sm:px-6 lg:flex-row"
    >
      {keyPoints.map((point) => (
        <div
          className="bg-background/60 hover:shadow-primary/20 relative w-full overflow-hidden rounded-lg p-6 hover:shadow-md"
          key={point.id}
          id={point.id}
          style={{ position: "relative" }}
        >
          {/* Glossy effect overlay for key points */}
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
              zIndex: 1,
            }}
          />
          <div className="relative z-10">
            <p className="flex w-full shrink-0 flex-row items-center justify-start gap-2 text-lg font-semibold text-nowrap">
              <Check className="text-lg text-green-500" />
              <span>{point.heading}</span>
            </p>
            <span className="mt-2 ml-8 text-base font-medium text-nowrap text-white/60">
              {point.subHeading}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};
