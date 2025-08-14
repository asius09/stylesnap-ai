"use client";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Share } from "lucide-react";
import { ImageData } from "@/types/style.types";
import { useToast } from "@/components/Toast";

interface DropzoneProps {
  setFile: (file: ImageData) => void;
  setError: (error: string | null) => void;
  file: ImageData | null;
  error: string | null;
  disabled?: boolean; // Add disabled prop, default false
}

export function MyDropzone({
  setFile,
  setError,
  error,
  disabled = false,
}: DropzoneProps) {
  const { addToast } = useToast();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

        // Prepare form data for upload
        const formData = new FormData();
        formData.append("file", file);
        // Provide fileName too
        formData.append("fileName", file.name);

        try {
          // Upload to /api/upload (see @route.ts)
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
              imageUrl: data.imageUrl, // This is the public location
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
    // maxSize: 5 * 1024 * 1024, // 5MB
    disabled, // Pass disabled to useDropzone
  });

  // Show dropzone if no file is uploaded
  return (
    <div
      {...getRootProps({
        className:
          "bg-card hover:border-primary focus:border-primary w-full shrink-0 cursor-pointer rounded-lg border-2 border-dashed border-gray-400 p-8 text-center text-white transition-colors duration-200" +
          (disabled
            ? " opacity-50 pointer-events-none cursor-not-allowed"
            : ""),
        tabIndex: disabled ? -1 : 0,
        "aria-disabled": disabled,
        style: disabled ? { pointerEvents: "none", opacity: 0.5 } : undefined,
      })}
    >
      <input {...getInputProps({ disabled })} />
      <div className="flex flex-col items-center justify-center">
        <Share className="text-primary mb-4 h-10 w-10" />
        <p className="selection:bg-primary/50 mb-1 font-medium text-white/55 selection:text-white">
          Drag &amp; Drop your{" "}
          <span className="text-primary selection:bg-primary/50 font-semibold selection:text-white">
            PNG, JPEG, or image
          </span>{" "}
          file
        </p>
        <span className="text-primary selection:bg-primary/50 cursor-pointer underline selection:text-white">
          or click to browse.
        </span>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}
