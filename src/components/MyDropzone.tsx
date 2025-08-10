"use client";
import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Share } from "lucide-react";
import { ImageData } from "@/types/style.types";

interface DropzoneProps {
  setFile: (file: ImageData) => void;
  setError: (error: string | null) => void;
  file: ImageData | null;
  error: string | null;
}

export function MyDropzone({ setFile, setError, file, error }: DropzoneProps) {
  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: Array<{
        file: File;
        errors: Array<{ code: string; message: string }>;
      }>,
    ) => {
      setError(null);
      if (fileRejections && fileRejections.length > 0) {
        setError(
          "Only PNG, JPEG, and image files are allowed. Please check the file type.",
        );
        return;
      }
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const preview = URL.createObjectURL(file);

        // Use ImageData type to set file
        const imageData: ImageData = {
          id: crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2, 15),
          name: file.name,
          image: preview,
          prompt: "",
          size: file.size ? `${Math.round(file.size / 1024)} KB` : undefined,
        };

        setFile(imageData); // If setFile expects File, you may need to adjust the prop type
        console.log("File dropped:", imageData);
      }
    },
    [],
  );

  // Clean up preview when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (file && file.image) {
        URL.revokeObjectURL(file.image);
      }
    };
  }, [file]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      setError(null);
      if (fileRejections && fileRejections.length > 0) {
        setError(
          "Only PNG, JPEG, and image files are allowed. Please check the file type.",
        );
        return;
      }
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const preview = URL.createObjectURL(file);

        // Use ImageData type to set file
        const imageData: ImageData = {
          id: crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2, 15),
          name: file.name,
          image: preview,
          prompt: "",
          size: file.size ? `${Math.round(file.size / 1024)} KB` : undefined,
        };

        setFile(imageData);
        console.log("File dropped:", imageData);
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
  });

  // Show dropzone if no file is uploaded
  return (
    <div
      {...getRootProps()}
      className="bg-card hover:border-primary focus:border-primary shrink-0 cursor-pointer rounded-lg border-2 border-dashed border-gray-400 p-8 text-center text-white transition-colors duration-200"
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
