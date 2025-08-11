"use client";
import React from "react";
import { X, RefreshCw } from "lucide-react";
import Image from "next/image";
import { ImageData } from "@/types/style.types";

interface PreviewCardProps extends ImageData {
  isStyleCard: boolean;
  disableRemoveButton?: boolean;
  showRemoveButton?: boolean; // optional, default true
  showSwitchButton?: boolean; // optional, default false
  onRemove: () => void;
  onSwitchStyle?: () => void;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  isStyleCard,
  title,
  imageUrl,
  fileSize,
  convertedStyleLabel,
  disableRemoveButton = false,
  showRemoveButton = true,
  showSwitchButton = true,
  onRemove,
  onSwitchStyle,
}) => {
  // If convertedStyleLabel is present, treat as download image: no action buttons
  const isDownloadImage = !!convertedStyleLabel;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`bg-background relative mb-4 flex h-[300px] w-[240px] items-center justify-center overflow-hidden rounded-lg border ${
          isStyleCard ? "border-primary" : "border-gray-300"
        }`}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={
              convertedStyleLabel
                ? "Converted style image"
                : title || (isStyleCard ? "Style" : "Uploaded image")
            }
            className="aspect-[4/5] h-full w-full object-cover"
            fill
            sizes="240px"
            priority
            unoptimized
          />
        )}
        {/* No prompt or converted style label on card */}
        {/* Remove Button */}
        {!isDownloadImage && showRemoveButton && (
          <button
            type="button"
            aria-label="Remove image"
            onClick={onRemove}
            className="absolute top-2 right-2 z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/60 shadow-lg backdrop-blur-md transition-colors duration-150 hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:text-white disabled:cursor-not-allowed disabled:opacity-60"
            tabIndex={0}
            disabled={disableRemoveButton}
            title="Remove image"
          >
            <span className="sr-only">Remove image</span>
            <X className="h-4 w-4 text-white" aria-hidden="true" />
          </button>
        )}
        {/* Switch Style Button */}
        {!isDownloadImage && showSwitchButton && onSwitchStyle && (
          <button
            type="button"
            aria-label="Switch style"
            onClick={onSwitchStyle}
            className="bg-secondary/80 hover:bg-secondary focus:bg-secondary focus:ring-secondary absolute bottom-2 left-2 z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/30 text-white shadow-lg backdrop-blur-md transition-colors duration-150 focus:ring-2 focus:ring-offset-2 focus:outline-none active:text-white"
            tabIndex={0}
            title="Switch style"
          >
            <span className="sr-only">Switch style</span>
            <RefreshCw className="h-4 w-4 text-white" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="text-center">
        <p className="selection:bg-primary/50 text-sm font-semibold break-all text-white selection:text-white sm:text-base">
          {convertedStyleLabel ? convertedStyleLabel : title}
        </p>
        <p className="selection:bg-primary/50 mb-2 text-xs text-white/55 selection:text-white">
          {fileSize ? fileSize : "Selected Style"}
        </p>
      </div>
    </div>
  );
};
