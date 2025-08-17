"use client";
import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Button } from "./Button";
import { ImageData } from "@/types/style.types";
import { uploadImage } from "@/utils/imageClient";
import { Loader } from "./Loader";

interface HeroDropZoneProps {
  onFileSelected?: (file: ImageData) => void;
  disabled?: boolean;
}

export const HeroDropZone: React.FC<Partial<HeroDropZoneProps>> = ({
  onFileSelected = () => {},
  disabled = false,
}) => {
  const { addToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to handle file upload and conversion to ImageData
  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);
    // Validate file type
    if (
      !["image/png", "image/jpeg", "image/jpg"].includes(file.type) &&
      !file.type.startsWith("image/")
    ) {
      setError(
        "Only PNG, JPEG, and image files are allowed. Please check the file type.",
      );
      addToast({
        type: "error",
        message:
          "Only PNG, JPEG, and image files are allowed. Please check the file type.",
      });
      setIsUploading(false);
      return;
    }
    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      addToast({
        type: "error",
        message: "File size exceeds 10MB limit.",
      });
      setIsUploading(false);
      return;
    }

    // Use uploadImage from imageClient.ts
    try {
      const uploadResult = await uploadImage(file);
      if (uploadResult && uploadResult.url) {
        const imageData: ImageData = {
          id: Math.random().toString(36).substring(2, 15),
          title: file.name,
          imageUrl: uploadResult.url,
          fileSize: file.size
            ? `${Math.round(file.size / 1024)} KB`
            : undefined,
          filePath: uploadResult.path,
          supabaseFileName: uploadResult?.path,
          expiresIn: uploadResult.expiresIn,
        };
        onFileSelected(imageData);
        setError(null);
        addToast({
          type: "success",
          message: "File uploaded successfully.",
        });
      }
    } catch (err: unknown) {
      let errorMessage = "Failed to upload image.";
      if (err instanceof Error && err.message) {
        errorMessage = `Failed to upload image: ${err.message}`;
      } else if (typeof err === "string") {
        errorMessage = `Failed to upload image: ${err}`;
      }
      setError(errorMessage);
      addToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
        await handleFileUpload(file);
      }
    },
    multiple: false,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/*": [],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled,
    noClick: true, // Prevent click on dropzone from opening file dialog
  });

  return (
    <div
      {...getRootProps({
        className:
          "flex w-full cursor-pointer flex-col items-center justify-center rounded-xl transition outline-none" +
          (isDragActive
            ? " border-primary shadow-[0_0_48px_0_theme(colors.primary/80)]"
            : "") +
          (disabled ? " pointer-events-none opacity-60" : ""),
        tabIndex: disabled ? -1 : 0,
        "aria-disabled": disabled,
        role: "button",
        "aria-label": "Upload image dropzone",
        style: disabled ? { pointerEvents: "none", opacity: 0.6 } : undefined,
        onClick: (e: React.MouseEvent) => {
          // Prevent propagation to dropzone, only allow button to open dialog
          e.stopPropagation();
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          // Allow Enter/Space to trigger file dialog for accessibility
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            if (inputRef.current) {
              inputRef.current.value = "";
              inputRef.current.click();
            }
          }
        },
      })}
      aria-describedby={error ? "herodropzone-error" : undefined}
    >
      <div className="relative z-10 flex h-full w-full flex-col items-center">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader />
            <span
              className="text-primary mt-4 text-base font-semibold"
              aria-live="polite"
            >
              Uploading image...
            </span>
          </div>
        ) : (
          <>
            <UploadCloud
              className="text-primary mb-3 h-10 w-10"
              aria-hidden="true"
              focusable="false"
            />
            <p
              className="text-text-color text-center text-base font-semibold md:mb-1 md:text-lg"
              id="herodropzone-label"
            >
              {isDragActive
                ? "Drop the image here..."
                : "Click or drag image to upload"}
            </p>
            <p
              className="text-text-color/60 text-center text-xs md:text-sm"
              id="herodropzone-desc"
            >
              PNG, JPEG, or image, up to 10MB
            </p>
            <Button
              type="button"
              variant="filled"
              className="focus-ring-primary selection-primary mt-4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (inputRef.current) {
                  inputRef.current.value = ""; // reset so same file can be selected again
                  inputRef.current.click();
                }
              }}
              disabled={disabled}
              tabIndex={0}
              aria-label="Open file dialog to upload image"
            >
              Upload Image
            </Button>
          </>
        )}
        <input
          {...getInputProps({
            tabIndex: -1,
            className: "hidden",
            ref: inputRef,
            onClick: (e: React.MouseEvent) => {
              // Prevent bubbling to parent dropzone
              e.stopPropagation();
            },
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files && e.target.files[0];
              if (file) {
                await handleFileUpload(file);
              }
            },
            "aria-label": "Image file input",
            "aria-describedby":
              "herodropzone-label herodropzone-desc" +
              (error ? " herodropzone-error" : ""),
            "aria-disabled": disabled,
            disabled,
          })}
        />
        {error && (
          <p
            className="mt-2 text-red-500"
            id="herodropzone-error"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
