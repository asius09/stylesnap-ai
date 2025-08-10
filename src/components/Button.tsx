"use client";
import React from "react";

type ButtonVariant = "filled" | "outline" | "gradient" | "gradient-outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

// Use fully rounded classes for a pill/rounded look
const baseClasses =
  "inline-flex items-center justify-center font-semibold rounded-full transition-colors duration-150 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed selection:bg-primary/50 selection:text-white cursor-pointer";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

function getVariantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "filled":
      return "bg-primary text-white hover:bg-primary-hover shadow-md";
    case "outline":
      return "border-2 border-primary text-primary bg-transparent hover:bg-primary/10";
    case "gradient":
      return "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:from-primary-hover hover:to-secondary-hover";
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
  const buttonClassName = [
    baseClasses,
    sizeClasses[size],
    getVariantClasses(variant),
    className,
    isGradientOutline ? "" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // For gradient-outline, apply border-image via style prop
  const gradientOutlineStyle = isGradientOutline
    ? {
        borderImage: "linear-gradient(to right, #6A5BFF, #FF7D45) 1",
      }
    : undefined;

  return (
    <button className={buttonClassName} style={gradientOutlineStyle} {...props}>
      {children}
    </button>
  );
};
