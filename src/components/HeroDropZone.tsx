import React from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { Button } from "./Button";

interface HeroDropZoneProps {
  onFileSelected?: (file: File) => void;
  disabled?: boolean;
}

export const HeroDropZone: React.FC<Partial<HeroDropZoneProps>> = ({
  onFileSelected = () => {},
  disabled = false,
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
    inputRef,
    isFocused,
    isDragReject,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (disabled) return;
      if (acceptedFiles && acceptedFiles[0]) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: false,
    noClick: true, // We'll handle click with the button
    noKeyboard: true,
    disabled,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Compose container classes for hover/focus/drag states
  const baseClasses =
    "border-primary/60 bg-background/60 focus-within:border-primary mx-auto flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-1 transition outline-none shadow-[0_0_24px_0_theme(colors.primary/80)] relative my-0 min-h-[24rem] w-full max-w-2xl px-4 py-8";
  const hoverClasses =
    "hover:border-primary hover:shadow-[0_0_40px_0_theme(colors.primary/60)]";
  const dragActiveClasses =
    "border-primary shadow-[0_0_48px_0_theme(colors.primary/80)]";
  const disabledClasses = "pointer-events-none opacity-60";

  const containerClassName = [
    baseClasses,
    hoverClasses,
    isDragActive || isFocused ? dragActiveClasses : "",
    disabled ? disabledClasses : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      {...getRootProps({
        className: containerClassName,
        tabIndex: 0,
        "aria-disabled": disabled,
        role: "button",
      })}
    >
      {/* Glossy overlay effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-xl"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.02) 100%)",
          WebkitMaskImage:
            "linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%)",
          maskImage:
            "linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%)",
          borderRadius: "0.75rem",
        }}
      />
      <div className="relative z-10 flex w-full flex-col items-center">
        <UploadCloud className="text-primary mb-3 h-10 w-10" />
        <p className="text-center text-base font-semibold text-white md:mb-1 md:text-lg">
          {isDragActive
            ? "Drop the image here..."
            : "Click or drag image to upload"}
        </p>
        <p className="text-center text-xs text-white/60 md:text-sm">
          JPG or PNG, up to 10MB
        </p>
        <Button
          type="button"
          variant="filled"
          className="mt-4 cursor-pointer"
          onClick={open}
          disabled={disabled}
          tabIndex={0}
        >
          Upload Image
        </Button>
        <input
          {...getInputProps({
            tabIndex: -1,
            className: "hidden",
          })}
        />
      </div>
    </div>
  );
};
