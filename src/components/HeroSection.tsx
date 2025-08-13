import React from "react";
import { Button } from "./Button";
import { Image, FileImage, UploadCloud } from "lucide-react";
import { HeroDropZone } from "./HeroDropZone";

export function HeroSection({ onUploadClick }: { onUploadClick?: () => void }) {
  return (
    <section className="relative mt-0 flex h-1/2 w-full flex-col items-center justify-center md:mt-4">
      <h1 className="selection:bg-primary/60 from-primary to-primary relative z-10 mb-3 bg-gradient-to-r via-white bg-clip-text text-center text-2xl font-bold text-nowrap text-transparent drop-shadow-lg selection:text-white sm:text-5xl md:text-6xl lg:text-7xl">
        Transform your photos
        <br />
        in seconds
      </h1>
      <p className="selection:bg-primary/40 relative z-10 mb-4 max-w-xl text-center text-xs font-medium text-white/70 selection:text-white sm:text-sm md:mb-6 md:text-base">
        One free image. Just ₹9 for more. No subscription needed.
      </p>
      <div className="relative z-10 w-full">
        <HeroDropZone />
      </div>
    </section>
  );
}
