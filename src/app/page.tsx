"use client";

import { AppHeader } from "@/components/ui/AppHeader";
import { HeroSection } from "@/components/sections/HeroSection";
import { Footer } from "@/components/ui/Footer";
import { StepsSection } from "@/components/sections/StepsSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import Paywall from "@/components/pay/Paywall";

export default function UploadPage() {
  return (
    <main
      className="from-background via-primary/20 to-background relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br"
      itemScope
      itemType="https://schema.org/WebPage"
    >
      <AppHeader />
      {/* Global glossy overlay */}
      <div
        aria-hidden="true"
        className="background-glossy-effect pointer-events-none absolute inset-0 z-[1]"
      />
      <Paywall />

      {/* Hero Section */}
      <HeroSection />

      {/* Steps */}
      <StepsSection />

      {/* Feature Section */}
      <FeatureSection />

      <Footer />
    </main>
  );
}
