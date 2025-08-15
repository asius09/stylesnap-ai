"use client";
import React, { useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Share } from "lucide-react";
import { ImageData } from "@/types/style.types";
import { useToast } from "@/components/Toast";

interface DropzoneProps {
  setFile: (file: ImageData) => void;
  setError: (error: string | null) => void;
  file: ImageData | null;
  error: string | null;
  disabled?: boolean;
}

export function MyDropzone({
  setFile,
  setError,
  error,
  disabled = false,
}: DropzoneProps) {
  const { addToast } = useToast();
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: async (acceptedFiles, fileRejections) => {
      if (disabled) return;
      setError(null);
      if (fileRejections && fileRejections.length > 0) {
        setError(
          "Only PNG, JPEG, and image files are allowed. Please check the file type.",
        );
        addToast({
          type: "error",
          message:
            "Only PNG, JPEG, and image files are allowed. Please check the file type.",
        });
        return;
      }
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();

          if (data.status === "successful" && data.imageUrl) {
            const imageData: ImageData = {
              id:
                typeof crypto.randomUUID === "function"
                  ? crypto.randomUUID()
                  : Math.random().toString(36).substring(2, 15),
              title: file.name,
              imageUrl: data.imageUrl,
              fileSize: file.size
                ? `${Math.round(file.size / 1024)} KB`
                : undefined,
            };
            setFile(imageData);
            addToast({
              type: "success",
              message: "File uploaded and stored in public directory.",
            });
            console.log("File uploaded and stored in public:", imageData);
          } else {
            setError("Failed to upload file. Please try again.");
            addToast({
              type: "error",
              message: "Failed to upload file. Please try again.",
            });
          }
        } catch (err: unknown) {
          setError(
            `Failed to upload file. Please try again.${err instanceof Error ? " " + err.message : ""}`,
          );
          addToast({
            type: "error",
            message: `Failed to upload file. Please try again.${err instanceof Error ? " " + err.message : ""}`,
          });
        }
      }
    },
    multiple: false,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/*": [],
    },
    disabled,
    noClick: true, // We'll handle click for accessibility
    noKeyboard: true, // We'll handle keyboard for accessibility
  });

  // Keyboard handler for accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  // Click handler for accessibility
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    // Only trigger open if the click is not on the input itself
    if (
      e.target instanceof HTMLElement &&
      dropzoneRef.current &&
      !dropzoneRef.current.contains(e.target.closest("input"))
    ) {
      open();
    }
  };

  return (
    <div
      {...getRootProps({
        className:
          "focus-ring-primary bg-card hover:border-primary w-full shrink-0 rounded-lg border-2 border-dashed border-gray-400 p-8 text-center text-text-color transition-colors duration-200" +
          (disabled
            ? " opacity-50 pointer-events-none cursor-not-allowed"
            : " cursor-pointer"),
        tabIndex: disabled ? -1 : 0,
        "aria-disabled": disabled,
        "aria-label":
          "File upload area. Press Enter or Space to select a file, or drag and drop.",
        role: "button",
        ref: dropzoneRef,
        onKeyDown: handleKeyDown,
        onClick: handleClick,
        style: disabled ? { pointerEvents: "none", opacity: 0.5 } : undefined,
        "aria-describedby":
          "dropzone-instructions" + (error ? " dropzone-error" : ""),
        "data-focus-visible-added": undefined, // for better focus-visible support
      })}
    >
      <input
        {...getInputProps({ disabled })}
        aria-label="File input"
        tabIndex={-1}
      />
      <div className="selection-primary flex flex-col items-center justify-center">
        <Share
          className="text-primary mb-4 h-10 w-10"
          aria-hidden="true"
          focusable="false"
        />
        <p
          className="selection-primary mb-1 font-medium text-text-color/55"
          id="dropzone-instructions"
        >
          Drag &amp; Drop your{" "}
          <span className="text-primary selection-primary font-semibold">
            PNG, JPEG, or image
          </span>{" "}
          file
        </p>
        <span
          className="text-primary selection-primary cursor-pointer underline"
          tabIndex={-1}
        >
          or click to browse.
        </span>
      </div>
      {error && (
        <p
          className="mt-2 text-red-500"
          role="alert"
          aria-live="polite"
          id="dropzone-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}
