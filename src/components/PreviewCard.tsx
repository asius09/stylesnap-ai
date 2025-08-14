"use client";
import React from "react";
import { X, RefreshCw } from "lucide-react";
import Image from "next/image";
import { ImageData } from "@/types/style.types";
import { motion } from "motion/react";

interface PreviewCardProps extends ImageData {
  disableRemoveButton?: boolean;
  showRemoveButton?: boolean; // optional, default true
  showSwitchButton?: boolean; // optional, default false
  onRemove: () => void;
  onSwitchStyle?: () => void;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  title,
  imageUrl,
  fileSize,
  convertedStyleLabel,
  disableRemoveButton = false,
  showRemoveButton = true,
  showSwitchButton = false,
  onRemove,
  onSwitchStyle,
}) => {
  // If convertedStyleLabel is present, treat as download image: no action buttons
  const isDownloadImage = !!convertedStyleLabel;

  // Only use style prop in initial, not in animate/exit, to avoid hydration mismatch
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.95,
        // Only set style at initial, not in animate/exit
      }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex h-[400px] w-full flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative mb-3 flex aspect-[4/5] h-[300px] w-[240px] items-center justify-center overflow-hidden rounded-xl border shadow-lg">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={
              convertedStyleLabel ? "Converted style image" : title || "Image"
            }
            className="z-0 aspect-[4/5] h-full w-full object-cover"
            fill
            sizes="176px"
            priority
          />
        )}
        {/* Top-right button group */}
        {!isDownloadImage &&
          (showRemoveButton || (showSwitchButton && onSwitchStyle)) && (
            <div className="absolute top-2 right-2 z-30 flex flex-row gap-2">
              {/* Switch button first, then remove button last */}
              {showSwitchButton && onSwitchStyle && (
                <button
                  type="button"
                  aria-label="Switch style"
                  onClick={onSwitchStyle}
                  className="bg-secondary/50 hover:bg-secondary focus:bg-secondary focus:ring-secondary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white shadow-lg backdrop-blur-md transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none active:text-white "
                  tabIndex={0}
                  title="Switch style"
                  style={{
                    boxShadow: "0 2px 8px 0 rgba(120,90,255,0.10)",
                  }}
                >
                  <span className="sr-only">Switch style</span>
                  <RefreshCw
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                </button>
              )}
              {showRemoveButton && (
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={onRemove}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/60 shadow-lg backdrop-blur-md transition-colors duration-200 hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  tabIndex={0}
                  disabled={disableRemoveButton}
                  title="Remove image"
                  style={{
                    boxShadow: "0 2px 8px 0 rgba(255,0,0,0.10)",
                  }}
                >
                  <span className="sr-only">Remove image</span>
                  <X className="h-5 w-5 text-white" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
      </div>
      <div className="text-center">
        <p className="selection:bg-primary/50 text-xs font-semibold break-all text-white selection:text-white sm:text-sm">
          {convertedStyleLabel ? convertedStyleLabel : title}
        </p>
        <p className="selection:bg-primary/50 mb-1 text-[11px] text-white/55 selection:text-white">
          {fileSize ? fileSize : "Selected Style"}
        </p>
      </div>
    </motion.div>
  );
};
