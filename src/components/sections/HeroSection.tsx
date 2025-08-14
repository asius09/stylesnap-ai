import React, { useState } from "react";
import { HeroDropZone } from "../HeroDropZone";
import { PreviewCard } from "../PreviewCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTrialId } from "@/hooks/useTrialId";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { useDownloadImage } from "@/utils/downloadUtils";
import { useProgressSteps } from "@/hooks/useProgressSteps";
import { useFileRemove } from "@/hooks/useFileRemove";
import { useStyleSelection } from "@/hooks/useStyleSelection";
import { Button } from "../Button";
import { ImageData } from "@/types/style.types";
import { useToast } from "@/components/Toast";
import { ArrowIndicator } from "../ArrowIndicator";
import { Plus } from "lucide-react";
import { StyleSelectionDialog } from "../StyleSelectionDialog";
import { Loader } from "../Loader";
import { MessageDialog } from "@/components/MessageDialog";
import { useScrollLock } from "@/hooks/useScrollLock";

export function HeroSection() {
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messageDialog, setMessageDialog] = useState<any>({});
  const [isStyleDialogOpen, setIsStyleDialogOpen] = useState(false);
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

  // =========================
  // Handlers: File & Style
  // =========================
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

  const isReadyToGenerate =
    !!file && !!selectedStyle && !loading && generateStatus !== "success";

  function renderMainContent() {
    if (!file) {
      // Section: Upload
      return (
        <div
          className="flex w-full flex-col items-center justify-center py-8"
          id="hero-upload-section"
          aria-label="Upload Section"
        >
          <HeroDropZone
            onFileSelected={(selectedFile: ImageData) => setFile(selectedFile)}
          />
        </div>
      );
    }

    if (loading) {
      // Section: Loader
      return (
        <div
          className="flex h-[400px] w-full items-center justify-center"
          id="hero-loader-section"
          aria-busy="true"
          aria-live="polite"
        >
          <Loader />
        </div>
      );
    }

    if (generateStatus === "success" && generatedImage?.imageUrl) {
      // Section: Generation Success
      return (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-8 py-8 md:flex-row"
          id="hero-generation-success"
          aria-label="Image Generation Success"
        >
          <div className="flex w-full flex-col items-center justify-center md:w-1/2">
            <PreviewCard
              id={generatedImage.id}
              imageUrl={generatedImage.imageUrl ?? ""}
              title={generatedImage.title ?? ""}
              convertedStyleLabel={generatedImage.convertedStyleLabel}
              onRemove={() => {}}
              disableRemoveButton={false}
              fileSize={generatedImage.fileSize}
              aria-label="Generated Image Preview"
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-10 md:w-1/2">
            <Button
              variant={"gradient"}
              className="hidden w-full"
              onClick={handleDownloadGeneratedImage}
              disabled={isDialogOpen}
              id="download-generated-image-btn"
              aria-label="Download generated image"
            >
              Download
            </Button>
            <Button
              variant={"outline"}
              className="w-full max-w-xs text-white"
              onClick={() => {
                setFile(null);
                setSelectedStyle(null);
              }}
              disabled={isDialogOpen}
              id="generate-another-btn"
              aria-label="Generate another image"
            >
              Generate Another for ₹9
            </Button>
          </div>
        </div>
      );
    }

    // Section: Main Workflow (Image, Arrow, Style)
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-0 p-4 md:flex-row md:gap-4 md:px-6"
        id="hero-main-workflow"
        aria-label="Main Workflow"
      >
        {/* Image (left on md+, top on mobile) */}
        <PreviewCard
          {...file}
          onRemove={handleRemoveFile}
          disableRemoveButton={!!selectedStyle || loading}
          aria-label="Uploaded Image Preview"
        />

        {/* Arrow and Button (center) */}
        <div
          className="flex w-full flex-col items-center justify-center gap-y-10 md:gap-x-20"
          id="arrow-and-generate"
          aria-label="Generate Section"
        >
          <div className="flex flex-col items-center justify-center">
            <ArrowIndicator show={!!selectedStyle} aria-hidden="true" />
          </div>
          <div className="hidden w-full flex-col items-center justify-center md:flex">
            <Button
              variant={"gradient"}
              className="w-full"
              onClick={handleGenerate}
              disabled={!isReadyToGenerate}
              id="generate-btn"
              aria-label="Generate stylized image"
            >
              Generate
            </Button>
            {error && (
              <div
                className="mt-2 text-center text-sm text-red-500"
                role="alert"
                id="generate-error"
              >
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Style (right on md+, bottom on mobile) */}
        <div
          className="flex w-full flex-col items-center justify-center"
          id="style-selection-area"
          aria-label="Style Selection"
        >
          {selectedStyle ? (
            <PreviewCard
              {...selectedStyle}
              onRemove={() => setSelectedStyle(null)}
              disableRemoveButton={isDialogOpen}
              showRemoveButton={true}
              showSwitchButton={true}
              onSwitchStyle={() => setIsStyleDialogOpen(true)}
              aria-label="Selected Style Preview"
            />
          ) : (
            <div
              className="border-primary/40 bg-background/70 hover:border-primary/70 focus-within:ring-primary/30 relative mb-3 flex aspect-[4/5] h-[300px] w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border transition focus-within:ring-2 focus-within:outline-none"
              id="empty-style-card"
              aria-label="No style selected"
            >
              <button
                type="button"
                className="flex h-full w-full items-center justify-center outline-none"
                tabIndex={0}
                aria-label="Select style"
                onClick={() => setIsStyleDialogOpen(true)}
                id="select-style-btn"
              >
                <span className="bg-primary/10 text-primary group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full shadow transition">
                  <Plus className="h-8 w-8" aria-hidden="true" />
                </span>
              </button>
            </div>
          )}
          <div className="w-full text-center">
            <p
              className="selection:bg-primary/50 text-xs font-semibold break-all text-white selection:text-white sm:text-sm"
              id="style-selection-label"
            >
              {selectedStyle ? "" : "Select style"}
            </p>
            <p
              className="selection:bg-primary/50 mb-1 text-[11px] text-white/55 selection:text-white"
              id="style-selection-desc"
            >
              {selectedStyle ? "" : "Choose a style to apply"}
            </p>
          </div>
        </div>

        {/* Mobile Generate Button */}
        <div
          className="flex h-full w-full items-center justify-center md:hidden"
          id="mobile-generate-btn-area"
        >
          <Button
            variant={"gradient"}
            className="w-full max-w-40"
            onClick={handleGenerate}
            disabled={!isReadyToGenerate}
            id="mobile-generate-btn"
            aria-label="Generate stylized image"
          >
            Generate
          </Button>
          {error && (
            <div
              className="mt-2 text-center text-sm text-red-500"
              role="alert"
              id="mobile-generate-error"
            >
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <section
      className="relative mt-20 flex min-h-screen w-full flex-col items-center justify-center px-2 sm:px-4 md:mt-16 md:px-6 lg:mt-6"
      id="hero-section"
      aria-label="Photo Style Transfer Hero Section"
    >
      {/* Section: Heading */}
      <h1
        className="selection:bg-primary/60 from-primary to-primary relative z-10 mb-3 bg-gradient-to-r via-white bg-clip-text text-center text-5xl font-bold text-transparent drop-shadow-lg selection:text-white md:text-6xl md:text-nowrap lg:text-7xl"
        id="hero-title"
        tabIndex={0}
        aria-label="Transform your photos in seconds"
      >
        Transform your photos
        <br className="hidden md:block" /> in seconds
      </h1>
      <p
        className="selection:bg-primary/40 relative z-10 mb-4 max-w-xl text-center text-xs font-medium text-white/70 selection:text-white sm:text-sm md:mb-6 md:text-base"
        id="hero-subtitle"
        tabIndex={0}
        aria-label="One free image. Just ₹9 for more. No subscription needed."
      >
        One free image. Just ₹9 for more. No subscription needed.
      </p>

      {/* Section: Main Card */}
      <div
        className="border-primary/60 bg-background/60 focus-within:border-primary shadow-[0_0_24px_0_theme(colors.primary/80)] hover:border-primary hover:shadow-[0_0_40px_0_theme(colors.primary/60)] relative my-0 flex min-h-[28rem] w-full max-w-4xl flex-col items-center justify-center overflow-hidden rounded-xl border-1 transition outline-none"
        id="hero-main-card"
        aria-label="Main Card"
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
        {/* Section: Main Content */}
        {renderMainContent()}
      </div>

      {/* Section: Style Selection Dialog */}
      <StyleSelectionDialog
        isOpen={isStyleDialogOpen}
        onClose={() => setIsStyleDialogOpen(false)}
        selectedStyleId={selectedStyle?.id}
        onSelect={(style) => handleStyleSelection(style)}
        onReplace={(style) => handleStyleSelection(style, { replace: true })}
        aria-label="Style Selection Dialog"
      />

      {/* Section: Message Dialog */}
      <MessageDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        {...messageDialog}
        aria-label="Message Dialog"
      />
    </section>
  );
}
