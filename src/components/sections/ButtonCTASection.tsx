import React from "react";
import { Button } from "../Button";
import { ArrowRight } from "lucide-react";

export const ButtonCTASection = () => {
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
      id="create-new-cta"
      className="mx-auto my-16 flex w-full items-center justify-center"
      aria-label="Call to action: Start creating your stylized image"
      role="region"
    >
      <Button
        variant="glossy"
        size="lg"
        className="focus-ring-primary group hover:bg-primary/90 flex flex-row items-center justify-center rounded-full px-8 py-4 text-lg font-bold shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none"
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
