"use client";
import React, { useState } from "react";
import { ImageData } from "@/types/style.types";
import Image from "next/image";
import { Button } from "./Button";

interface StyleCardProps {
  style: ImageData;
  onClick: (style: ImageData) => void;
  index?: number;
  disabled?: boolean;
  selected?: boolean;
}

export const StyleCard: React.FC<StyleCardProps> = ({
  style,
  onClick,
  index,
  disabled = false,
  selected = false,
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
    "relative flex aspect-[4/5] w-44 max-w-[11rem] shrink-0 flex-col justify-end overflow-hidden rounded-xl border border-white/15 bg-white/10 whitespace-nowrap shadow-lg backdrop-blur-md transition-transform duration-200 focus:outline-none";
  const focusRingClass =
    isActive || disabled ? "" : "focus:ring-2 focus:ring-primary";
  const pointerClass = disabled
    ? "cursor-not-allowed opacity-60 grayscale"
    : "cursor-pointer hover:scale-[1.045] hover:shadow-2xl";
  const selectedClass = selected
    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
    : "";
  const className = `${baseClass} ${focusRingClass} ${pointerClass} ${selectedClass}`;

  return (
    <div
      className={className}
      tabIndex={disabled ? -1 : 0}
      role="group"
      aria-label={`Style card: ${style.title}`}
      aria-disabled={disabled}
      data-style-id={style.id}
      data-style-index={typeof index === "number" ? index : undefined}
      data-selected={selected ? "true" : undefined}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* All badges at the top */}
      <div className="pointer-events-none absolute top-2 right-2 left-2 z-30 flex flex-row items-start justify-between">
        <span className="selection:bg-primary/50 bg-primary/20 text-primary/90 inline-block rounded px-2 py-0.5 text-[11px] font-medium shadow-sm selection:text-white">
          Trending
        </span>
        {selected && !disabled && (
          <span className="bg-primary ml-2 rounded px-2 py-0.5 text-[11px] font-semibold text-white shadow ring-1 ring-white/70">
            Selected
          </span>
        )}
        {disabled && (
          <span className="ml-2 rounded bg-gray-900/80 px-2 py-0.5 text-[11px] font-semibold text-white shadow">
            Disabled
          </span>
        )}
      </div>
      <div className="absolute inset-0 z-0">
        {!imgError ? (
          <Image
            src={style.imageUrl}
            alt={style.title}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            fill
            sizes="176px"
            priority
            onError={() => setImgError(true)}
            unoptimized
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-800 text-xs text-white">
            Image not available
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      <div className="relative z-10 flex w-full flex-col items-center gap-2 px-3 pt-2 pb-3">
        <div className="mb-0.5 flex w-full items-center justify-center gap-2">
          <h3 className="selection:bg-primary/50 flex-1 truncate text-center text-base leading-tight font-bold text-white drop-shadow selection:text-white">
            {style.title}
          </h3>
        </div>
        <Button
          variant="gradient"
          size="sm"
          className="border-primary/40 mt-1 w-[90%] border text-xs font-semibold shadow-lg hover:scale-105"
          disabled={disabled}
          aria-label={`Choose style: ${style.title}`}
          onClick={() => {
            if (!disabled && onClick) onClick(style);
          }}
          tabIndex={disabled ? -1 : 0}
          style={{ paddingTop: "0.2rem", paddingBottom: "0.2rem" }}
        >
          <span className="px-4 py-1">{selected ? "Selected" : "Select"}</span>
        </Button>
      </div>
    </div>
  );
};
