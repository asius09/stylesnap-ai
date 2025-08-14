"use client";
import React, { useState } from "react";
import { ImageData } from "@/types/style.types";
import Image from "next/image";

interface StyleCardProps {
  style: ImageData;
  onClick: (style: ImageData) => void;
  index?: number;
  disabled?: boolean;
}

export const StyleCard: React.FC<StyleCardProps> = ({
  style,
  onClick,
  index,
  disabled = false,
}) => {
  // State to handle image loading error
  const [imgError, setImgError] = useState(false);
  // State to track if the card is being clicked (active)
  const [isActive, setIsActive] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick(style);
    }
  };

  // Remove focus ring when mouse is used to click
  const handleMouseDown = () => {
    if (!disabled) setIsActive(true);
  };
  const handleMouseUp = () => {
    if (!disabled) setIsActive(false);
  };
  const handleMouseLeave = () => {
    if (!disabled) setIsActive(false);
  };

  // Compose className to conditionally remove focus:ring when active (clicked)
  const baseClass =
    "relative flex aspect-[4/5] w-40 max-w-[10rem] shrink-0 flex-col justify-end overflow-hidden rounded-lg border border-white/15 bg-white/10 whitespace-nowrap shadow-lg backdrop-blur-md transition-transform duration-200 focus:outline-none";
  const focusRingClass =
    isActive || disabled ? "" : "focus:ring-2 focus:ring-primary";
  const pointerClass = disabled
    ? "cursor-not-allowed opacity-60 grayscale"
    : "cursor-pointer hover:scale-105 hover:shadow-xl";
  const className = `${baseClass} ${focusRingClass} ${pointerClass}`;

  return (
    <div
      className={className}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`Select style: ${style.title}`}
      aria-disabled={disabled}
      data-style-id={style.id}
      data-style-index={typeof index === "number" ? index : undefined}
      onClick={() => {
        if (!disabled && onClick) onClick(style);
      }}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 z-0">
        {!imgError ? (
          <Image
            src={style.imageUrl}
            alt={style.title}
            className="h-full w-full object-cover object-center"
            fill
            sizes="160px"
            priority
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-800 text-xs text-white">
            Image not available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        {disabled && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-gray-900/40 select-none">
            <span className="text-xs font-semibold text-white">Disabled</span>
          </div>
        )}
      </div>
      <div className="relative z-10 w-full px-2 pt-1.5 pb-2">
        <h3 className="selection:bg-primary/50 mb-0.5 truncate text-base leading-tight font-bold text-white drop-shadow selection:text-white">
          {style.title}
        </h3>
        <span className="selection:bg-primary/50 bg-primary/20 text-primary/90 inline-block rounded px-2 py-0.5 text-[11px] font-medium shadow-sm selection:text-white">
          Trending
        </span>
      </div>
    </div>
  );
};
