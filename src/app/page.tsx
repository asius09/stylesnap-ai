"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useToast } from "@/components/Toast";
import { MyDropzone } from "@/components/MyDropzone";
import { StyleCard } from "@/components/StyleCard";
import { PreviewCard } from "@/components/PreviewCard";
import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";
import { SocialShare } from "@/components/SocialShare";
import { AppHeader } from "@/components/AppHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { stylesData } from "@/data";
import { ImageData } from "@/types/style.types";
import { MessageDialog, MessageDialogProps } from "@/components/MessageDialog";
import { useProgressSteps } from "@/hooks/useProgressSteps";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { useFileRemove } from "@/hooks/useFileRemove";
import { useStyleSelection } from "@/hooks/useStyleSelection";
import { useTrialId } from "@/hooks/useTrialId";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useDownloadImage } from "@/utils/downloadUtils";
import { HeroSection } from "@/components/HeroSection";
import { ArrowRight, Check } from "lucide-react";
import { Footer } from "@/components/Footer";

const keyPoints = [
  {
    id: "no-signup-required",
    heading: "No signup required",
    subHeading: "just upload & generate",
  },
  {
    id: "100s-presets-style",
    heading: "100s presets style",
    subHeading: "One click style convert",
  },
  {
    id: "high-quality-jpg",
    heading: "High Quality JPG",
    subHeading: "High quality every time",
  },
];

const stepsContent = [
  {
    id: "upload-step",
    heading: "Upload Image",
    detail: "Upload any image from your device.",
  },
  {
    id: "select-style-step",
    heading: "Pick Style",
    detail: "Select a style to apply.",
  },
  {
    id: "generate-step",
    heading: "Generate",
    detail: "Create your new image.",
  },
  {
    id: "download-step",
    heading: "Download & Share",
    detail: "Save or share instantly.",
  },
];

export default function UploadPage() {
  const { addToast } = useToast();

  // Dialog and state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messageDialog, setMessageDialog] = useState<
    Partial<MessageDialogProps>
  >({});
  const [file, setFile] = useLocalStorage<ImageData | null>(
    "uploadedFile",
    null,
  );
  const [selectedStyle, setSelectedStyle] = useLocalStorage<ImageData | null>(
    "selectedStyle",
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const { trialId, freeUsed } = useTrialId();

  const { handleGenerate, generateStatus, generatedImage, loading } =
    useImageGeneration({
      file,
      selectedStyle,
      trialId: typeof trialId === "string" ? trialId : null,
      freeUsed: typeof freeUsed === "boolean" ? freeUsed : false,
      setMessageDialog,
      setIsDialogOpen,
      addToast,
    });

  const handleDownloadGeneratedImage = useDownloadImage({
    generatedImage,
    selectedStyle,
    addToast,
  });

  const [steps] = useProgressSteps(file, selectedStyle, generateStatus);

  const handleRemoveFile = useFileRemove({
    file,
    setFile,
    addToast,
  });

  const handleStyleSelection = useStyleSelection({
    file,
    setSelectedStyle,
    addToast,
  });

  useScrollLock(isDialogOpen);

  // UI: Main Page
  return (
    <div
      id="upload-page"
      className="from-background via-primary/20 to-background relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br"
    >
      {/* Global glossy overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.01) 100%)",
          WebkitMaskImage:
            "linear-gradient(120deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0) 100%)",
          maskImage:
            "linear-gradient(120deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <AppHeader freeUsed={!!freeUsed} />
      <MessageDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={messageDialog.title ?? ""}
        description={messageDialog.description ?? ""}
        primaryAction={
          messageDialog.primaryAction ?? { label: "", onClick: () => {} }
        }
        secondaryAction={messageDialog.secondaryAction}
      />

      {/* Hero Section */}
      <main className="relative z-10 mt-24 flex h-full w-full max-w-4xl flex-col items-start justify-center gap-20 px-6">
        <HeroSection />
      </main>

      {/* Key Points */}
      <section
        id="key-points"
        className="mt-8 flex w-full max-w-7xl flex-col items-center justify-center gap-4 px-4 text-white sm:px-6 lg:flex-row"
      >
        {keyPoints.map((point) => (
          <div
            className="bg-background/60 hover:shadow-primary/20 relative w-full overflow-hidden rounded-lg p-6 hover:shadow-md"
            key={point.id}
            id={point.id}
            style={{ position: "relative" }}
          >
            {/* Glossy effect overlay for key points */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.02) 100%)",
                WebkitMaskImage:
                  "linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%)",
                maskImage:
                  "linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%)",
                borderRadius: "0.75rem",
                zIndex: 1,
              }}
            />
            <div className="relative z-10">
              <p className="flex w-full shrink-0 flex-row items-center justify-start gap-2 text-lg font-semibold text-nowrap">
                <Check className="text-lg text-green-500" />
                <span>{point.heading}</span>
              </p>
              <span className="mt-2 ml-8 text-base font-medium text-nowrap text-white/60">
                {point.subHeading}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Steps */}
      <section className="mt-24 flex w-full max-w-7xl flex-col items-center justify-center">
        <h2 className="pb-8 text-center text-2xl font-semibold text-white md:text-3xl md:text-nowrap lg:text-4xl">
          Convert Your Image in 4 Simple Steps
        </h2>
        <div className="mt-12 grid w-full grid-cols-1 items-center justify-center gap-8 px-4 sm:grid-cols-2 sm:px-6">
          {stepsContent.map((step, idx) => (
            <div
              id={step.id}
              key={step.id}
              className="bg-background/60 hover:shadow-primary/30 relative w-full rounded-xl px-16 py-6 hover:shadow-md"
              style={{
                position: "relative",
                zIndex: 0,
              }}
            >
              {/* Glossy effect overlay for steps */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
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
              <div
                className="shadow-[0_2px_16px_0_theme(colors.primary/60)] from-primary/80 via-primary/60 to-background/80 border-primary/40 absolute -top-4 left-0 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border-2 bg-gradient-to-br"
                style={{
                  boxShadow:
                    "0 2px 16px 0 rgba(120, 90, 255, 0.35), 0 0 0 2px rgba(255,255,255,0.12) inset",
                  position: "absolute",
                  top: "-1.5rem",
                  left: "-0.5rem",
                }}
              >
                <svg
                  className="absolute z-[1] h-12 w-12"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <defs>
                    <radialGradient
                      id={`glossy-bg-${idx}`}
                      cx="50%"
                      cy="40%"
                      r="70%"
                    >
                      <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
                      <stop
                        offset="60%"
                        stopColor="currentColor"
                        stopOpacity="0.18"
                      />
                      <stop
                        offset="100%"
                        stopColor="currentColor"
                        stopOpacity="0.08"
                      />
                    </radialGradient>
                    <linearGradient
                      id={`shine-${idx}`}
                      x1="0"
                      y1="0"
                      x2="48"
                      y2="24"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                      <stop offset="80%" stopColor="#fff" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="0.2"
                    y="0.2"
                    width="47.6"
                    height="47.6"
                    rx="12"
                    fill={`url(#glossy-bg-${idx})`}
                  />
                  {/* Glossy shine overlay */}
                  <rect
                    x="0.2"
                    y="0.2"
                    width="47.6"
                    height="18"
                    rx="12"
                    fill={`url(#shine-${idx})`}
                  />
                </svg>
                <span
                  className="relative z-10 text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(120,90,255,0.25)]"
                  style={{
                    textShadow:
                      "0 2px 8px rgba(120,90,255,0.25), 0 1px 0 #fff8",
                    filter: "brightness(1.15)",
                  }}
                >
                  {idx + 1}
                </span>
              </div>
              <p className="relative z-10 text-left text-lg font-semibold text-white">
                {step.heading}
              </p>
              <span className="relative z-10 text-left text-base font-medium text-white/60">
                {step.detail}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Start Creating Now Button */}
      <div className="mx-auto my-16 flex w-full items-center justify-center">
        <Button
          variant="glossy"
          size="md"
          className="flex flex-row items-center justify-center font-bold"
          onClick={() => {
            // Scroll to the upload section
            const uploadSection = document.getElementById("upload-section");
            if (uploadSection) {
              uploadSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Start Creating Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Feature Section */}
      <section
        id="feature-section"
        className="mx-auto my-10 flex w-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6"
      >
        <h2 className="mb-2 text-center text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
          See the Magic: Instantly Transform Your Photos
        </h2>
        <p className="mb-8 max-w-2xl text-center text-base text-white/60 md:text-lg">
          Instantly restyle your photos - no signup, just one click.
        </p>
        {/* Pinterest-like grid, 4/5 aspect ratio, 4 images only */}
        <div className="min-h-[300px] w-full columns-2 gap-4 space-y-4 lg:columns-4">
          <div className="bg-background/60 mb-4 break-inside-avoid rounded-xl p-2 shadow-lg">
            <div
              className="relative w-full overflow-hidden rounded-lg"
              style={{ aspectRatio: "4/5" }}
            >
              <img
                src="/1980s-pop-art.png"
                alt="Pop Art Style Example"
                className="h-full w-full object-cover"
                style={{ aspectRatio: "4/5" }}
              />
            </div>
            <span className="mt-2 block text-center text-sm font-semibold text-white">
              Pop Art
            </span>
          </div>
          <div className="bg-background/60 mb-4 break-inside-avoid rounded-xl p-2 shadow-lg">
            <div
              className="relative w-full overflow-hidden rounded-lg"
              style={{ aspectRatio: "4/5" }}
            >
              <img
                src="/ghibli-art.png"
                alt="Ghibli Style Example"
                className="h-full w-full object-cover"
                style={{ aspectRatio: "4/5", background: "#e0f7fa" }}
              />
            </div>
            <span className="mt-2 block text-center text-sm font-semibold text-white">
              Ghibli Art
            </span>
          </div>
          <div className="bg-background/60 mb-4 break-inside-avoid rounded-xl p-2 shadow-lg">
            <div
              className="relative w-full overflow-hidden rounded-lg"
              style={{ aspectRatio: "4/5" }}
            >
              <img
                src="/disney-art.png"
                alt="Upscaled Portrait Example"
                className="h-full w-full object-cover"
                style={{ aspectRatio: "4/5", background: "#f5f5f5" }}
              />
            </div>
            <span className="mt-2 block text-center text-sm font-semibold text-white">
              Upscaled Portrait
            </span>
          </div>
          <div className="bg-background/60 mb-4 break-inside-avoid rounded-xl p-2 shadow-lg">
            <div
              className="relative w-full overflow-hidden rounded-lg"
              style={{ aspectRatio: "4/5" }}
            >
              <img
                src="/anime-art.png"
                alt="Upscaled Anime Example"
                className="h-full w-full object-cover"
                style={{ aspectRatio: "4/5", background: "#f0eaff" }}
              />
            </div>
            <span className="mt-2 block text-center text-sm font-semibold text-white">
              Upscaled Anime
            </span>
          </div>
          {/* TODO: Show "My Images" here when user is logged in */}
          {/* TODO: Handle too big images gracefully */}
        </div>
      </section>
      <Footer />
    </div>
  );
}
