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

  // Compose className to conditionally remove focus:ring when active (clicked)
  const baseClass =
    "relative flex aspect-[4/5] w-40 sm:w-44 md:w-48 lg:w-52 xl:w-56 max-w-[90vw] sm:max-w-[11rem] shrink-0 flex-col justify-end overflow-hidden rounded-xl border border-white/15 bg-white/10 whitespace-nowrap shadow-lg backdrop-blur-md transition-transform duration-200";
  const pointerClass = disabled
    ? "cursor-not-allowed opacity-60 grayscale"
    : "cursor-pointer hover:shadow-2xl";
  const selectedClass = selected
    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
    : "";
  const className = `${baseClass} ${pointerClass} ${selectedClass}`;

  // Accessibility: handle keyboard and click
  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && onClick) onClick(style);
  };

  const handleDivKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick(style);
    }
  };

  const handleMouseDown = () => {
    if (!disabled) setIsActive(true);
  };
  const handleMouseUp = () => {
    if (!disabled) setIsActive(false);
  };
  const handleMouseLeave = () => {
    if (!disabled) setIsActive(false);
  };

  return (
    <div
      className={className}
      tabIndex={disabled ? -1 : 0}
      aria-label={`Style card: ${style.title}`}
      aria-disabled={disabled}
      data-style-id={style.id}
      data-style-index={typeof index === "number" ? index : undefined}
      data-selected={selected ? "true" : undefined}
      onClick={handleDivClick}
      onKeyDown={handleDivKeyDown}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      role="button"
      style={{
        outline: isActive ? "none" : undefined,
        userSelect: "none",
      }}
    >
      {/* All badges at the top */}
      <div className="pointer-events-none absolute top-2 right-2 left-2 z-30 flex flex-row items-start justify-between">
        <span className="selection:bg-primary/50 bg-primary/20 text-primary/90 selection:text-text-color inline-block rounded px-2 py-0.5 text-[10px] font-medium shadow-sm sm:text-[11px]">
          Trending
        </span>
        {selected && !disabled && (
          <span className="bg-primary text-text-color ml-2 rounded px-2 py-0.5 text-[10px] font-semibold shadow ring-1 ring-white/70 sm:text-[11px]">
            Selected
          </span>
        )}
        {disabled && (
          <span className="text-text-color ml-2 rounded bg-gray-900/80 px-2 py-0.5 text-[10px] font-semibold shadow sm:text-[11px]">
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
            sizes="(max-width: 640px) 90vw, 176px"
            priority
            onError={() => setImgError(true)}
            unoptimized
            draggable={false}
          />
        ) : (
          <div className="text-text-color flex h-full w-full items-center justify-center bg-gray-800 text-xs">
            Image not available
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      <div className="relative z-10 flex w-full flex-col items-center gap-2 px-2 pt-2 pb-3 sm:px-3">
        <div className="mb-0.5 flex w-full items-center justify-center gap-2">
          <h3 className="selection:bg-primary/50 text-text-color selection:text-text-color flex-1 truncate text-center text-sm leading-tight font-bold drop-shadow sm:text-base">
            {style.title}
          </h3>
        </div>
        <Button
          variant="gradient"
          size="sm"
          className="border-primary/40 pointer-events-none mt-1 w-[90%] border text-xs font-semibold shadow-lg hover:scale-105 sm:text-sm"
          disabled={disabled}
          aria-label={`Choose style: ${style.title}`}
          tabIndex={-1}
          style={{ paddingTop: "0.2rem", paddingBottom: "0.2rem" }}
        >
          <span className="px-4 py-1">{selected ? "Selected" : "Select"}</span>
        </Button>
      </div>
    </div>
  );
};
