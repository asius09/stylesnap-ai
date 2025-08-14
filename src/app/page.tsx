"use client";

import { AppHeader } from "@/components/AppHeader";
import { useTrialId } from "@/hooks/useTrialId";
import { HeroSection } from "@/components/sections/HeroSection";
import { Footer } from "@/components/Footer";
import { KeyPoints } from "@/components/sections/KeyPoints";
import { StepsSection } from "@/components/sections/StepsSection";
import { ButtonCTASection } from "@/components/sections/ButtonCTASection";
import { FeatureSection } from "@/components/sections/FeatureSection";

export default function UploadPage() {
  const { trialId, freeUsed } = useTrialId();
  return (
    <div
      id="upload-page"
      className="from-background via-primary/20 to-background relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br"
    >
      {/* Global glossy overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.01) 100%)",
          WebkitMaskImage:
            "linear-gradient(120deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0) 100%)",
          maskImage:
            "linear-gradient(120deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <AppHeader freeUsed={!!freeUsed} />

      {/* Hero Section */}
      <HeroSection />

      {/* Key Points */}
      <KeyPoints />

      {/* Steps */}
      <StepsSection />

      {/* Start Creating Now Button */}
      <ButtonCTASection />
      {/* Feature Section */}
      <FeatureSection />

      <Footer />
    </div>
  );
}
