"use client";
import React from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface PreviewCardProps {
  style: boolean;
  name: string;
  image: string;
  prompt?: string;
  size?: string;
  convertedStyleName?: string;
  isRemoveBtnDisabled: boolean;
  onRemove: () => void;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  style: isStyle,
  name,
  image,
  prompt,
  size,
  convertedStyleName,
  onRemove,
  isRemoveBtnDisabled = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`bg-background relative mb-4 flex h-[300px] w-[240px] items-center justify-center overflow-hidden rounded-lg border ${
          isStyle ? "border-primary" : "border-gray-300"
        }`}
      >
        {image && (
          <Image
            src={image}
            alt={
              convertedStyleName
                ? "Download image"
                : name || (isStyle ? "Style" : "Uploaded image")
            }
            className="aspect-[4/5] h-full w-full object-cover"
            fill
            sizes="240px"
            priority
            unoptimized
          />
        )}
        {isStyle && prompt && (
          <div className="bg-primary/80 absolute top-0 left-0 w-full truncate rounded-t-lg px-2 py-1 text-center text-[10px] font-medium text-white">
            {prompt}
          </div>
        )}
        {!isStyle && convertedStyleName && (
          <div className="bg-primary/80 absolute top-0 left-0 w-full truncate rounded-t-lg px-2 py-1 text-center text-[10px] font-medium text-white">
            {`Converted Style: ${convertedStyleName}`}
          </div>
        )}
        <button
          type="button"
          aria-label="Remove image"
          onClick={onRemove}
          className="absolute top-2 right-2 z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/60 shadow-lg backdrop-blur-md transition-colors duration-150 hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:text-white disabled:cursor-not-allowed disabled:opacity-60"
          tabIndex={0}
          disabled={isRemoveBtnDisabled}
          title="Remove image"
        >
          <span className="sr-only">Remove image</span>
          <X className="h-4 w-4 text-white" aria-hidden="true" />
        </button>
      </div>
      <div className="text-center">
        <p className="selection:bg-primary/50 text-sm font-semibold break-all text-white selection:text-white sm:text-base">
          {name}
        </p>
        <p className="selection:bg-primary/50 mb-2 text-xs text-white/55 selection:text-white">
          {size ? size : "Selected Style"}
        </p>
      </div>
    </div>
  );
};
