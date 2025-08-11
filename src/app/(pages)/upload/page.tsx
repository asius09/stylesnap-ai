"use client";

// React and state management
import React, { useState } from "react";
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

// --- Main Upload Page ---
export default function UploadPage() {
  // --- State ---
  // Set default values for testing API. Remove these defaults for production.
  const [selectedStyle, setSelectedStyle] = useLocalStorage<ImageData | null>(
    "selectedStyle",
    {
      id: "anime-style",
      title: "Anime Style",
      imageUrl: "/anime-art.png",
      stylePrompt:
        "Transform this photo into a high-quality anime-style illustration, preserving the subject's pose and details.",
    },
  ); // TODO: set to null for production
  const [file, setFile] = useLocalStorage<ImageData | null>("uploadedFile", {
    id: "http://tmpfiles.org/dl/9993991/couple.jpeg",
    title: "couple",
    imageUrl: "http://tmpfiles.org/dl/9993991/couple.jpeg",
    fileSize: "512 KB",
  }); // TODO: set to null for production

  const [generatedImage, setGeneratedImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateStatus, setGenerateStatus] = useState<GenerateStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // --- Steps for progress bar ---
  const [steps, setSteps] = useState<Step[]>([
    { id: "upload-tag", label: "Upload", status: !!file },
    { id: "select-style-tag", label: "Select Style", status: !!selectedStyle },
    { id: "generate-tag", label: "Generate", status: false },
    { id: "download-tag", label: "Download", status: false },
  ]);

  // --- Handlers ---
  const updateTagStatus = (tagName: string, status: boolean) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === tagName ? { ...step, status } : step)),
    );
  };

  const handleGenerate = async () => {
    setGeneratedImage(null);
    setLoading(true);
    setGenerateError(null);
    setGenerateStatus("idle");

    // Check for required data before making API call
    if (!selectedStyle || !file || !file.imageUrl) {
      setGenerateError("Please upload an image and select a style.");
      setGenerateStatus("failed");
      setLoading(false);
      return;
    }

    try {
      // Call API to generate image
      console.log("handleGenerateImage called");
      updateTagStatus("generate-tag", true);

      const res = await fetch("/api/image-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: selectedStyle.stylePrompt,
          image_url: file.imageUrl,
        }),
      });
      console.log("Response received:", res);

      // Check for HTTP errors
      if (!res.ok) {
        const errorText = await res.text();
        setGenerateError(`API Error: ${errorText}`);
        setGenerateStatus("failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Response JSON:", data);

      if ((data.status === 200 || data.status === "success") && data.imageUrl) {
        setGeneratedImage({
          id: `${selectedStyle.title ?? "unknown"}-${data.imageUrl}`,
          title: selectedStyle.title ?? "Unknown",
          imageUrl: data.imageUrl,
          convertedStyleLabel: selectedStyle.title ?? "Unknown",
          fileSize: data.fileSize, // optional, if returned
        });
        setGenerateStatus("success");
        console.log("Image URL set:", data.imageUrl);
      } else {
        setGenerateError(data.error || "Failed to generate image.");
        setGenerateStatus("failed");
        console.error(
          "Error from API:",
          data.error || "Failed to generate image.",
        );
      }
    } catch (error: any) {
      setGenerateError("Failed to generate Image, Please Try Again!");
      setGenerateStatus("failed");
      console.error("Fetch error:", error);
    } finally {
      setTimeout(() => setLoading(false), 600);
      console.log("Loading set to false");
    }
  };

  const handleDownloadGeneratedImage = () => {
    updateTagStatus("download-tag", true);
    // TODO: implement download logic
  };

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
                  imageUrl={generatedImage.imageUrl ?? ""}
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
                    imageUrl={file.imageUrl}
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
                        imageUrl={selectedStyle.imageUrl}
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
