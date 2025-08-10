"use client";
import React, { useState } from "react";
import { StyleData } from "@/types/style.types";

interface StyleCardProps {
  style: StyleData;
  onClick?: (style: StyleData) => void;
  index?: number;
}

export const StyleCard: React.FC<StyleCardProps> = ({ style, onClick, index }) => {
  // State to handle image loading error
  const [imgError, setImgError] = useState(false);
  // State to track if the card is being clicked (active)
  const [isActive, setIsActive] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick(style);
    }
  };

  // Remove focus ring when mouse is used to click
  const handleMouseDown = () => setIsActive(true);
  const handleMouseUp = () => setIsActive(false);
  const handleMouseLeave = () => setIsActive(false);

  // Compose className to conditionally remove focus:ring when active (clicked)
  const baseClass =
    "relative flex aspect-[4/5] w-40 max-w-[10rem] shrink-0 cursor-pointer flex-col justify-end overflow-hidden rounded-lg border border-white/15 bg-white/10 whitespace-nowrap shadow-lg backdrop-blur-md transition-transform duration-200 hover:scale-105 hover:shadow-xl focus:outline-none";
  const focusRingClass = isActive ? "" : "focus:ring-2 focus:ring-primary";
  const className = `${baseClass} ${focusRingClass}`;

  return (
    <div
      className={className}
      tabIndex={0}
      role="button"
      aria-label={`Select style: ${style.name}`}
      data-style-id={style.id}
      data-style-index={typeof index === "number" ? index : undefined}
      onClick={() => onClick && onClick(style)}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 z-0">
        {!imgError ? (
          <img
            src={style.image}
            alt={style.name}
            className="h-full w-full object-cover object-center"
            loading="eager"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-800 text-white text-xs">
            Image not available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 w-full px-2 pt-1.5 pb-2">
        <h3 className="selection:bg-primary/50 mb-0.5 truncate text-base leading-tight font-bold text-white drop-shadow selection:text-white">
          {style.name}
        </h3>
        <span className="selection:bg-primary/50 bg-primary/20 text-primary/90 inline-block rounded px-2 py-0.5 text-[11px] font-medium shadow-sm selection:text-white">
          Trending
        </span>
      </div>
    </div>
  );
};
