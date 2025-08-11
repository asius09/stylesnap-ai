"use client";

// React and state management
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

// UI Components
import { MyDropzone } from "@/components/MyDropzone";
import { StyleCard } from "@/components/StyleCard";
import { PreviewCard } from "@/components/PreviewCard";
import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";
import { SocialShare } from "@/components/SocialShare";
import { AppHeader } from "@/components/AppHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { ArrowIndicator } from "@/components/ArrowIndicator";

// Hooks
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Data and Types
import { stylesData } from "@/data";
import { ImageData, GenerateStatus, Step } from "@/types/style.types";

// Utility to check if a URL is external and not allowed by next/image
function isUnconfiguredExternalUrl(url: string) {
  try {
    const parsed = new URL(
      url,
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost",
    );
    // Add more hostnames here if you configure them in next.config.js
    const allowedHosts = [
      "localhost",
      "127.0.0.1",
      "yourdomain.com",
      // Add more allowed hostnames here
    ];
    // If it's not a relative URL and not in allowed hosts, it's unconfigured
    return (
      parsed.protocol.startsWith("http") &&
      !allowedHosts.includes(parsed.hostname) &&
      !parsed.pathname.startsWith("/_next/image")
    );
  } catch {
    // If URL constructor fails, treat as not external
    return false;
  }
}

// --- Main Upload Page ---
export default function UploadPage() {
  // --- State ---
  // We'll set the file and selectedStyle to the required pseudo objects on mount
  const [selectedStyle, setSelectedStyle] = useLocalStorage<ImageData | null>(
    "selectedStyle",
    null,
  );
  const [generatedImage, setGeneratedImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateStatus, setGenerateStatus] = useState<GenerateStatus>("idle");
  const [file, setFile] = useLocalStorage<ImageData | null>(
    "uploadedFile",
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // --- Steps for progress bar ---
  const [steps, setSteps] = useState<Step[]>([
    { id: "upload-tag", label: "Upload", status: file },
    { id: "select-style-tag", label: "Select Style", status: selectedStyle },
    { id: "generate-tag", label: "Generate", status: false },
    { id: "download-tag", label: "Download", status: false },
  ]);

  // --- On mount, set file and style to pseudo objects ---
  useEffect(() => {
    // Only set if not already set
    if (!file) {
      setFile({
        id: "pseudo-uploaded-file",
        title: "Uploaded Image",
        imageUrl: "/couple.jpeg",
        fileSize: "0",
      });
    }
    if (!selectedStyle) {
      // Find the Ghibli style from stylesData, fallback if not found
      const ghibliStyle =
        stylesData.find(
          (style) =>
            style.title && style.title.toLowerCase().includes("ghibli"),
        ) ||
        // fallback: just use the first style
        stylesData[0];

      setSelectedStyle({
        ...ghibliStyle,
        // Ensure required fields
        id: ghibliStyle.id,
        title: ghibliStyle.title,
        imageUrl: ghibliStyle.imageUrl,
        stylePrompt: ghibliStyle.stylePrompt,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Handlers ---

  const updateTagStatus = (tagName: string, status: boolean) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === tagName ? { ...step, status } : step)),
    );
  };

  // Based on @route.ts, the API expects:
  //   - prompt: string (style title)
  //   - fileName: string (the filename, relative to /public)
  // Send both prompt and fileName in the body.

  const handleGenerate = async () => {
    setGeneratedImage(null);
    setLoading(true);
    setGenerateError(null);

    if (!file || !selectedStyle) {
      setGenerateError("Please upload an image and select a style.");
      setLoading(false);
      return;
    }

    try {
      updateTagStatus("generate-tag", true);

      // Prepare form data as expected by the API route
      const formData = new FormData();
      // Send prompt
      formData.append("prompt", selectedStyle.stylePrompt || "");
      formData.append("fileName", file.imageUrl);

      const response = await fetch("/api/image-generator", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "successful" && data.imageUrl) {
        setGeneratedImage({
          id: `${selectedStyle.title?.toLowerCase().replace(/\s+/g, "-")}-generated`,
          title: selectedStyle.title,
          imageUrl: data.imageUrl,
          convertedStyleLabel: selectedStyle.title,
        });
        setGenerateStatus("success");
      } else {
        setGenerateError(
          data.error || "Failed to generate Image, Please Try Again!",
        );
        setGenerateStatus("failed");
      }
    } catch (error: unknown) {
      setGenerateError("Failed to generate Image, Please Try Again!");
      setGenerateStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadGeneratedImage = () => {
    updateTagStatus("download-tag", true);
    // TODO: implement download logic
  };

  // --- Helper to get a safe imageUrl for next/image ---
  function getSafeImageUrl(imageUrl: string | undefined | null) {
    if (!imageUrl) return "";
    if (isUnconfiguredExternalUrl(imageUrl)) {
      // Instead of passing the external URL directly to next/image, return a placeholder or fallback
      // Or, you could use a proxy endpoint that fetches the image and serves it from your own domain
      // For now, return a placeholder image
      return "/placeholder-image.png";
    }
    return imageUrl;
  }

  // --- Render ---
  return (
    <div
      id="upload-page"
      className="from-background via-primary/20 to-background text-text-light relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br md:overflow-x-hidden"
    >
      <AppHeader />

      <main className="mt-20 flex w-full max-w-4xl flex-col items-center justify-center px-4">
        <ProgressBar steps={steps} />
        {/* Dropzone & Previews */}
        <section
          className={`relative flex h-auto min-h-[24rem] w-full items-center justify-center md:h-96`}
        >
          {loading ? (
            <Loader />
          ) : generateStatus === "success" && generatedImage ? (
            <motion.div
              className="flex h-full w-full flex-col items-center justify-center gap-x-20 overflow-hidden md:flex-row"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                key="generated-preview"
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ duration: 0.5 }}
              >
                <PreviewCard
                  id={generatedImage.id}
                  imageUrl={getSafeImageUrl(generatedImage.imageUrl)}
                  title={generatedImage.title ?? ""}
                  convertedStyleLabel={generatedImage.convertedStyleLabel}
                  isStyleCard={false}
                  onRemove={() => {}}
                  disableRemoveButton={false}
                  fileSize={generatedImage.fileSize}
                />
              </motion.div>
              <motion.div
                id="image-download-actions"
                className="mt-4 flex h-full flex-col items-center justify-center gap-4 md:mt-0"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  variant={"gradient"}
                  className="w-full max-w-xs"
                  onClick={handleDownloadGeneratedImage}
                >
                  Download
                </Button>
                <Button
                  variant={"outline"}
                  className="w-full max-w-xs text-white"
                >
                  Generate Another for ₹9
                </Button>
                <SocialShare />
              </motion.div>
            </motion.div>
          ) : (
            // Only show file upload if file not uploaded
            <>
              {file === null && (
                <motion.div
                  key="dropzone-inner"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="flex h-full w-full max-w-sm items-center justify-center"
                >
                  <MyDropzone
                    file={file}
                    setFile={setFile}
                    setError={setError}
                    error={error}
                  />
                </motion.div>
              )}

              {/* If file is uploaded, show file preview */}
              {file && (
                <div
                  className={`flex w-full flex-col items-center justify-center md:flex-row`}
                >
                  <PreviewCard
                    id={file.imageUrl}
                    imageUrl={getSafeImageUrl(file.imageUrl)}
                    title={file.title}
                    isStyleCard={false}
                    onRemove={() => setFile(null)}
                    disableRemoveButton={!!selectedStyle}
                    fileSize={file.fileSize}
                  />

                  {/* If style is selected, show arrow, style preview, and generate button centered between file and style */}
                  {selectedStyle && (
                    <>
                      <div className="justify-centre flex h-full w-full flex-col items-center">
                        <ArrowIndicator show={!!selectedStyle} />
                        <motion.div
                          className="mt-8 hidden w-full items-center justify-center md:flex"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 30 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <Button
                            variant={"gradient"}
                            className="w-full max-w-xs md:max-w-1/2"
                            onClick={handleGenerate}
                          >
                            Generate
                          </Button>
                        </motion.div>
                      </div>

                      <PreviewCard
                        id={selectedStyle.id}
                        imageUrl={getSafeImageUrl(selectedStyle.imageUrl)}
                        title={selectedStyle.title}
                        isStyleCard={true}
                        stylePrompt={selectedStyle.stylePrompt}
                        onRemove={() => setSelectedStyle(null)}
                        disableRemoveButton={false}
                      />
                      <motion.div
                        className="mt-4 flex w-full items-center justify-center px-2 md:hidden"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <Button
                          variant={"gradient"}
                          className="w-full max-w-xs md:max-w-1/2"
                          onClick={handleGenerate}
                        >
                          Generate
                        </Button>
                      </motion.div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        {/* Trending Styles */}
        <section
          id="card-slider"
          className={`flex w-full flex-col items-start justify-start px-2 pt-2 pb-3 sm:px-4 md:-mt-6 md:px-8 ${selectedStyle ? "mt-20" : "mt-3"}`}
        >
          <h2 className="selection:bg-primary/50 mb-2 w-full text-center text-xl font-bold text-white drop-shadow selection:text-white md:text-xl lg:text-2xl">
            Trending Styles
          </h2>
          <motion.div
            className="scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent flex w-full items-center justify-start gap-3 overflow-x-auto px-1 py-1 sm:gap-4 md:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {stylesData.map((style, idx) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <StyleCard style={style} onClick={setSelectedStyle} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
