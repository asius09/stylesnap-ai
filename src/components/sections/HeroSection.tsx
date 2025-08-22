"use client";
import { Check } from "lucide-react";
import { keyPoints } from "@/data";
import { motion } from "framer-motion";
import { MainContent } from "@/components/MainContent";

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      id="hero-section"
      aria-label="AI Photo Style Transfer - Instantly Apply Art Styles to Your Photos"
    >
      <div className="flex h-full w-full flex-col items-center justify-center px-6 pt-16 md:pt-30">
        <HeroTitles />
        <MainContent />
      </div>

      <KeyFeaturesSection />
    </section>
  );
}

function HeroTitles() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 50, y: 40, filter: "blur(8px)" }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.6, ease: "easeOut" },
        }}
        exit={{
          opacity: 0,
          y: -40,
          filter: "blur(8px)",
          transition: { duration: 0.4, ease: "easeIn" },
        }}
        className="selection-primary focus-ring-primary from-text-color to-primary via-text-color relative z-10 rounded bg-gradient-to-r bg-clip-text text-center text-4xl font-semibold tracking-tighter text-pretty text-transparent drop-shadow-lg md:px-4 md:py-2 md:text-6xl md:tracking-tight md:text-nowrap"
        id="hero-title"
        tabIndex={0}
        aria-label="Turn Photos Into Art Instantly"
        onMouseDown={(e) => e.preventDefault()}
      >
        Turn Photos Into <br className="hidden md:block" />
        Art Instantly
      </motion.h1>
      <motion.p
        initial={{ opacity: 50, y: 40, filter: "blur(8px)" }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: "easeOut" },
        }}
        exit={{
          opacity: 0,
          y: 40,
          filter: "blur(8px)",
          transition: { duration: 0.3, ease: "easeIn" },
        }}
        className="selection-primary text-text-color/80 focus-ring-primary relative z-10 mb-8 rounded text-center text-[10px] font-normal md:mb-16 md:px-3 md:text-base"
        id="hero-subtitle"
        tabIndex={0}
        aria-label="Upload a photo and apply a style in seconds."
        onMouseDown={(e) => e.preventDefault()}
      >
        Upload a photo and apply a style in seconds.
      </motion.p>
    </>
  );
}

function KeyFeaturesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: "easeOut" },
      }}
      exit={{
        opacity: 0,
        y: -40,
        filter: "blur(8px)",
        transition: { duration: 0.4, ease: "easeIn" },
      }}
      id="key-points"
      className="text-text-color flex w-full max-w-7xl flex-col items-center justify-center gap-4 px-6 pt-32 sm:px-6 lg:flex-row"
      aria-labelledby="key-points-title"
      role="region"
    >
      <h2 id="key-points-title" className="sr-only">
        Key Features
      </h2>
      {keyPoints.map((point, idx) => (
        <motion.div
          key={point.id}
          className="bg-background/60 hover:shadow-primary/20 focus-visible:ring-primary focus-visible:ring-offset-background relative w-full overflow-hidden rounded-lg p-4 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          id={point.id}
          tabIndex={0}
          role="listitem"
          aria-label={`${point.heading}: ${point.subHeading}`}
          aria-describedby={`key-point-desc-${point.id}`}
          style={{ position: "relative" }}
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
        >
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
              <p className="text-base font-semibold text-nowrap md:text-lg">
                {point.heading}
              </p>
            </div>
            <span
              id={`key-point-desc-${point.id}`}
              className="selection-primary focus-ring-primary text-text-color/60 mt-2 ml-8 text-xs font-normal text-nowrap sm:text-sm md:text-base md:font-medium"
            >
              {point.subHeading}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
