"use client";
import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "filled" | "outline" | "gradient" | "gradient-outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

// Responsive size classes for inner content
const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm",
  md: "px-6 py-2 text-sm md:px-6 md:py-2 md:text-base",
  lg: "px-7 py-3 text-base md:px-8 md:py-3.5 md:text-lg",
};

function getVariantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "filled":
      return "bg-primary text-text-color shadow-md hover:bg-primary-hover";
    case "outline":
      return "border-2 border-primary text-primary bg-transparent hover:bg-primary/10";
    case "gradient":
      return (
        "bg-gradient-to-r from-primary via-pink-500 to-secondary text-white shadow-lg " +
        "hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 " +
        "active:from-purple-700 active:via-pink-700 active:to-orange-600 " +
        "focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 " +
        "disabled:from-purple-300 disabled:via-pink-200 disabled:to-orange-200 " +
        "disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200"
      );
    default:
      return "bg-primary text-text-color shadow-md hover:bg-primary-hover";
  }
}

export const Button: React.FC<ButtonProps> = ({
  variant = "filled",
  size = "md",
  children,
  className,
  type = "button",
  ...props
}) => {
  const isGradientOutline = variant === "gradient-outline";
  const isGradient = variant === "gradient";

  // All className variables are now text only (no clsx)
  const baseClassName =
    "inline-flex items-center justify-center font-semibold rounded-full transition-colors duration-150 focus:outline-none focus-ring-primary disabled:opacity-60 disabled:cursor-not-allowed selection:bg-primary/50 selection:text-text-color cursor-pointer relative overflow-hidden";

  if (isGradientOutline) {
    return (
      <button
        type={type}
        className={cn(
          "focus-visible:ring-primary bg-inset relative cursor-pointer items-center rounded-3xl font-medium text-white transition duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        tabIndex={props.disabled ? -1 : (props.tabIndex ?? undefined)}
        aria-disabled={props.disabled ? true : undefined}
        disabled={props.disabled}
        {...props}
        data-variant="gradient-outline"
      >
        {/* Gradient border background */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -z-0 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-[2px] opacity-90 transition-opacity duration-200",
            props.disabled && "opacity-50",
          )}
        />
        {/* Button content with solid background */}
        <span
          className={cn(
            "relative flex w-full items-center justify-center bg-transparent",
            sizeClasses[size],
          )}
        >
          {children}
        </span>
      </button>
    );
  }

  if (isGradient) {
    return (
      <button
        type={type}
        className={cn(
          "relative inline-flex cursor-pointer items-center overflow-hidden rounded-xl font-medium text-white transition duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          getVariantClasses("gradient"),
          sizeClasses[size],
          className,
        )}
        tabIndex={props.disabled ? -1 : (props.tabIndex ?? undefined)}
        aria-disabled={props.disabled ? true : undefined}
        disabled={props.disabled}
        {...props}
        data-variant="gradient"
      >
        <span className="flex w-full items-center justify-center">
          {children}
        </span>
      </button>
    );
  }

  // Accessibility: ensure role, tabIndex, and aria-disabled are set appropriately
  const { disabled, ...restProps } = props;
  const tabIndex = disabled ? -1 : (props.tabIndex ?? undefined);
  const ariaDisabled = disabled ? true : undefined;

  return (
    <button
      className={cn(
        baseClassName,
        sizeClasses[size],
        getVariantClasses(variant),
        className,
      )}
      type={type}
      tabIndex={tabIndex}
      aria-disabled={ariaDisabled}
      disabled={disabled}
      {...restProps}
      data-variant={variant}
    >
      <span className="flex items-center justify-center">{children}</span>
    </button>
  );
};
