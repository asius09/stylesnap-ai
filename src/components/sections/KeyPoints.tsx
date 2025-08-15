import React from "react";
import { keyPoints } from "@/data";
import { Check } from "lucide-react";

export const KeyPoints = () => {
  return (
    <section
      id="key-points"
      className="mt-8 flex w-full max-w-7xl flex-col items-center justify-center gap-4 px-4 text-text-color sm:px-6 lg:flex-row"
      aria-labelledby="key-points-title"
      role="region"
    >
      <h2 id="key-points-title" className="sr-only">
        Key Features
      </h2>
      {keyPoints.map((point, idx) => (
        <div
          className="bg-background/60 hover:shadow-primary/20 focus-visible:ring-primary focus-visible:ring-offset-background relative w-full overflow-hidden rounded-lg p-6 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          key={point.id}
          id={point.id}
          tabIndex={0}
          role="listitem"
          aria-label={`${point.heading}: ${point.subHeading}`}
          aria-describedby={`key-point-desc-${point.id}`}
          style={{ position: "relative" }}
        >
          {/* Glossy effect overlay for key points */}
          <div
            aria-hidden="true"
            className="glossy-effect pointer-events-none absolute inset-0 z-[1]"
          />
          <div className="relative z-10">
            <div className="selection-primary focus-ring-primary flex w-full shrink-0 flex-row items-center justify-start gap-2 text-lg font-semibold text-nowrap">
              <Check
                className="text-lg text-green-500"
                aria-hidden="true"
                focusable="false"
                role="presentation"
              />
              <span>{point.heading}</span>
            </div>
            <span
              id={`key-point-desc-${point.id}`}
              className="selection-primary focus-ring-primary mt-2 ml-8 text-base font-medium text-nowrap text-text-color/60"
            >
              {point.subHeading}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};
