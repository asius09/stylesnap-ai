"use client";
import React from "react";
import clsx from "clsx";

// Color references from globals.css
// --primary: oklch(0.6082 0.2508 300.25);
// --primary-hover: oklch(0.6 0.25 280);
// --secondary: oklch(0.7 0.2 40);
// --secondary-hover: oklch(0.65 0.2 40);

type ButtonVariant =
  | "filled"
  | "outline"
  | "gradient"
  | "gradient-outline"
  | "glossy";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

// Use fully rounded classes for a pill/rounded look
const baseClasses =
  "inline-flex items-center justify-center font-semibold rounded-full transition-colors duration-150 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed selection:bg-primary/50 selection:text-white cursor-pointer relative overflow-hidden";

// Responsive size classes
const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm",
  md: "px-4 py-2 text-sm md:px-5 md:py-2.5 md:text-base",
  lg: "px-5 py-2.5 text-base md:px-7 md:py-3.5 md:text-lg",
};

function getVariantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "filled":
      // Use brand primary and primary-hover from globals.css
      return "bg-primary text-white shadow-md hover:bg-primary-hover";
    case "outline":
      return "border-2 border-primary text-primary bg-transparent hover:bg-primary/10";
    case "gradient":
      // Use primary and secondary from globals.css
      return "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:from-primary-hover hover:to-secondary-hover";
    case "glossy":
      // Use bg-primary as base, shadow, and handle hover with primary-hover
      return "bg-primary text-white shadow-lg hover:bg-primary-hover";
    default:
      return "";
  }
}

export const Button: React.FC<ButtonProps> = ({
  variant = "filled",
  size = "md",
  children,
  className,
  ...props
}) => {
  const isGradientOutline = variant === "gradient-outline";
  const isGlossy = variant === "glossy";

  const buttonClassName = clsx(
    baseClasses,
    sizeClasses[size],
    getVariantClasses(variant),
    className,
  );

  // For gradient-outline, apply border-image via style prop
  const gradientOutlineStyle = isGradientOutline
    ? {
        borderImage:
          "linear-gradient(to right, var(--primary), var(--secondary)) 1",
      }
    : undefined;

  return (
    <button className={buttonClassName} style={gradientOutlineStyle} {...props}>
      {isGlossy && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            borderRadius: "9999px",
            overflow: "hidden",
            display: "block",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              borderRadius: "9999px",
              display: "block",
            }}
          >
            <defs>
              <linearGradient id="glossy-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#fff" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {/* Top glossy shine */}
            <rect
              x="0"
              y="0"
              width="100"
              height="18"
              rx="20"
              fill="url(#glossy-gradient)"
            />
            {/* Subtle bottom shine */}
            <ellipse
              cx="50"
              cy="38"
              rx="40"
              ry="6"
              fill="#fff"
              opacity="0.08"
            />
          </svg>
        </span>
      )}
      <span
        className={
          (isGlossy ? "relative z-10 " : "") +
          "flex items-center justify-center"
        }
      >
        {children}
      </span>
    </button>
  );
};
