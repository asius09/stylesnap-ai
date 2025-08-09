'use client'
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export function MyDropzone() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections) => {
    setError(null);
    if (fileRejections && fileRejections.length > 0) {
      setError("Some files were rejected. Please check the file type or size.");
    }
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
      // You can handle the files here, e.g., upload or preview
      console.log("Files dropped:", acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    // You can add accept/file size restrictions here if needed
    // accept: { 'image/*': [] },
    // maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center bg-card text-text-light transition-colors duration-200 hover:border-primary focus:border-primary cursor-pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-primary font-semibold">Drop the files here ...</p>
      ) : (
        <p>
          Drag &apos;n&apos; drop some files here, or{" "}
          <span className="text-primary underline">click to select files</span>
        </p>
      )}
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
      {files.length > 0 && (
        <div className="mt-4 text-left">
          <p className="font-semibold mb-2">Selected files:</p>
          <ul className="list-disc list-inside text-sm">
            {files.map((file, idx) => (
              <li key={idx}>
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
