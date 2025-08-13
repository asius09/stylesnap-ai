import React, { useRef } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "./Button";

interface HeroDropZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export const HeroDropZone: React.FC<Partial<HeroDropZoneProps>> = ({
  onFileSelected = () => {},
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onFileSelected(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (disabled) return;
    const files = e.target.files;
    if (files && files[0]) {
      onFileSelected(files[0]);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  return (
    <div
      className={`border-primary/60 bg-background/60 focus-within:border-primary mx-auto flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-1 transition outline-none ${disabled ? "pointer-events-none opacity-60" : ""} shadow-[0_0_24px_0_theme(colors.primary/80)] relative my-0 min-h-[24rem] w-full max-w-2xl px-4 py-8`}
      tabIndex={0}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      aria-disabled={disabled}
      role="button"
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
          Click or drag image to upload
        </p>
        <p className="text-center text-xs text-white/60 md:text-sm">
          JPG or PNG, up to 10MB
        </p>
        <Button
          type="button"
          variant="filled"
          className="bg-primary hover:bg-primary-hover mt-4 flex items-center gap-2 rounded-full px-6 py-2 text-base font-semibold text-white shadow-lg transition"
          onClick={(e) => handleClick(e)}
          disabled={disabled}
          tabIndex={0}
        >
          Upload Image
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
          tabIndex={-1}
        />
      </div>
    </div>
  );
};
