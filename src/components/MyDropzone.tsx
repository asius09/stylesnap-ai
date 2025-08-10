"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Share, X } from "lucide-react";

type PreviewFile = File & { preview?: string };

export function MyDropzone() {
  const [file, setFile] = useState<PreviewFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any) => {
    setError(null);
    if (fileRejections && fileRejections.length > 0) {
      setError(
        "Only PNG, JPEG, and image files are allowed. Please check the file type.",
      );
      return;
    }
    if (acceptedFiles && acceptedFiles.length > 0) {
      const fileWithPreview = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      });
      setFile(fileWithPreview);
      // You can handle the file here, e.g., upload or preview
      console.log("File dropped:", acceptedFiles[0]);
    }
  }, []);

  // Clean up preview when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/*": [],
    },
    // maxSize: 5 * 1024 * 1024, // 5MB
  });

  // If a file is uploaded, show only the preview and file info, no dropzone or upload option
  if (file) {
    // 4:5 aspect ratio, e.g., width: 240px, height: 300px
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div
          className="bg-background relative mb-4 flex items-center justify-center overflow-hidden rounded-lg border border-gray-300"
          style={{ width: "240px", height: "300px" }}
        >
          {file.preview && (
            <img
              src={file.preview}
              alt={file.name}
              className="h-full w-full object-cover"
              style={{ aspectRatio: "4/5" }}
            />
          )}
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => setFile(null)}
            className="absolute top-2 right-2 z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/60 shadow-lg backdrop-blur-md transition-colors duration-150 hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:text-white"
            tabIndex={0}
            title="Remove image"
          >
            <span className="sr-only">Remove image</span>
            <X className="h-4 w-4 text-white" aria-hidden="true" />
          </button>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold break-all text-white sm:text-base md:text-lg">
            {file.name}
          </p>
          <p className="mb-2 text-xs text-white/55 sm:text-sm md:text-base">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      </div>
    );
  }

  // Show dropzone if no file is uploaded
  return (
    <div
      {...getRootProps()}
      className="bg-card hover:border-primary focus:border-primary cursor-pointer rounded-lg border-2 border-dashed border-gray-400 p-8 text-center text-white transition-colors duration-200"
    >
      <input {...getInputProps()} />
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
