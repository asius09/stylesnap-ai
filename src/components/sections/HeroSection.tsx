import React, { useEffect, useState } from "react";
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
  useProgressSteps(file, selectedStyle, generateStatus);

  const handleRemoveFile = useFileRemove({ file, setFile, addToast });
  const handleStyleSelection = useStyleSelection({
    file,
    setSelectedStyle,
    addToast,
  });
  useScrollLock(isDialogOpen);

  const isReadyToGenerate =
    !!file && !!selectedStyle && !loading && generateStatus !== "success";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  function renderMainContent() {
    if (!file) {
      return (
        <div
          className="flex w-full flex-col items-center justify-center py-8"
          id="hero-upload-section"
          aria-label="Upload your photo"
        >
          <HeroDropZone
            onFileSelected={(selectedFile: ImageData) => setFile(selectedFile)}
          />
        </div>
      );
    }

    if (loading) {
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
      return (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-8 py-8 md:flex-row"
          id="hero-generation-success"
          aria-label="Photo style transfer result"
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
              aria-label="Styled photo preview"
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-10 md:w-1/2">
            <Button
              variant={"gradient"}
              className="hidden w-full"
              onClick={handleDownloadGeneratedImage}
              disabled={isDialogOpen}
              id="download-generated-image-btn"
              aria-label="Download styled photo"
            >
              Download
            </Button>
            <Button
              variant={"outline"}
              className="text-text-color w-full max-w-xs"
              onClick={() => {
                setFile(null);
                setSelectedStyle(null);
              }}
              disabled={isDialogOpen}
              id="generate-another-btn"
              aria-label="Style another photo"
            >
              Style Another for ₹9
            </Button>
          </div>
        </div>
      );
    }

    // Main workflow: upload, select style, generate
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-0 p-4 md:flex-row md:gap-4 md:px-6"
        id="hero-main-workflow"
        aria-label="Photo style transfer workflow"
      >
        <PreviewCard
          {...file}
          onRemove={handleRemoveFile}
          disableRemoveButton={!!selectedStyle || loading}
          aria-label="Uploaded photo preview"
        />

        <div
          className="flex w-full flex-col items-center justify-center gap-y-10 md:gap-x-20"
          id="arrow-and-generate"
          aria-label="Generate styled photo"
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
              aria-label="Apply style to photo"
            >
              Generate
            </Button>
            {error && (
              <div
                className="mt-2 text-center text-sm text-red-500"
                role="alert"
                id="generate-error"
                aria-live="assertive"
              >
                {error}
              </div>
            )}
          </div>
        </div>

        <div
          className="flex w-full flex-col items-center justify-center"
          id="style-selection-area"
          aria-label="Choose a style"
        >
          {selectedStyle && mounted ? (
            <PreviewCard
              {...selectedStyle}
              onRemove={() => setSelectedStyle(null)}
              disableRemoveButton={isDialogOpen}
              showRemoveButton={true}
              showSwitchButton={true}
              onSwitchStyle={() => setIsStyleDialogOpen(true)}
              aria-label="Selected style preview"
            />
          ) : (
            <div
              className="border-primary/40 bg-background/70 hover:border-primary/70 focus-within:ring-primary/30 focus-ring-primary relative mb-3 flex aspect-[4/5] h-[300px] w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border transition focus-within:ring-2 focus-within:outline-none"
              id="empty-style-card"
              aria-label="No style selected"
            >
              <button
                type="button"
                className="focus-ring-primary flex h-full w-full items-center justify-center outline-none"
                tabIndex={0}
                aria-label="Select a style"
                onClick={() => setIsStyleDialogOpen(true)}
                id="select-style-btn"
              >
                <span className="bg-primary/10 text-primary group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full shadow transition">
                  <Plus className="h-8 w-8" aria-hidden="true" />
                </span>
              </button>
            </div>
          )}
          {!selectedStyle && (
            <div className="w-full text-center">
              <>
                <p
                  className="selection-primary focus-ring-primary text-text-color rounded px-2 py-1 text-xs font-semibold break-all sm:text-sm"
                  id="style-selection-label"
                  tabIndex={0}
                  aria-label="Select a style"
                >
                  Select a style
                </p>
                <p
                  className="selection-primary focus-ring-primary text-text-color/55 mb-1 rounded px-2 py-1 text-[11px]"
                  id="style-selection-desc"
                  tabIndex={0}
                  aria-label="Pick a style to apply to your photo"
                >
                  Pick a style to apply to your photo
                </p>
              </>
            </div>
          )}
        </div>

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
            aria-label="Apply style to photo"
          >
            Generate
          </Button>
          {error && (
            <div
              className="mt-2 text-center text-sm text-red-500"
              role="alert"
              id="mobile-generate-error"
              aria-live="assertive"
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
      className="relative mt-20 flex min-h-screen w-full flex-col items-center justify-center px-2 sm:px-4 md:mt-16 md:px-6 lg:mt-8"
      id="hero-section"
      aria-label="AI Photo Style Transfer - Instantly Apply Art Styles to Your Photos"
    >
      <h1
        className="selection-primary focus-ring-primary from-primary to-primary focus:ring-primary relative z-10 rounded bg-gradient-to-r via-white bg-clip-text px-4 py-2 text-center text-5xl font-bold text-transparent drop-shadow-lg focus:ring-2 focus:outline-none active:ring-0 md:text-6xl md:text-nowrap lg:text-7xl"
        id="hero-title"
        tabIndex={0}
        aria-label="Turn Photos Into Art Instantly"
        onMouseDown={(e) => e.preventDefault()}
      >
        Turn Photos Into <br className="hidden md:block" />
        Art Instantly
      </h1>
      <p
        className="selection-primary focus-ring-primary text-text-color/70 relative z-10 mb-6 max-w-xl rounded px-3 py-2 text-center text-sm font-medium outline-none md:mb-8 md:text-base"
        id="hero-subtitle"
        tabIndex={0}
        aria-label="Upload a photo and apply a style in seconds."
        onMouseDown={(e) => e.preventDefault()}
      >
        Upload a photo and apply a style in seconds.
      </p>

      <div
        className="border-primary/60 bg-background/60 focus-within:border-primary shadow-[0_0_24px_0_theme(colors.primary/80)] hover:border-primary hover:shadow-[0_0_40px_0_theme(colors.primary/60)] relative my-0 flex min-h-[28rem] w-full max-w-4xl flex-col items-center justify-center overflow-hidden rounded-xl border-1 transition outline-none"
        id="hero-main-card"
        aria-label="Photo style transfer main card"
      >
        <div
          aria-hidden="true"
          className="glossy-effect pointer-events-none absolute inset-0 z-0 rounded-[0.75rem]"
        />
        {renderMainContent()}
      </div>

      <StyleSelectionDialog
        isOpen={isStyleDialogOpen}
        onClose={() => setIsStyleDialogOpen(false)}
        selectedStyleId={selectedStyle?.id}
        onSelect={(style) => handleStyleSelection(style)}
        onReplace={(style) => handleStyleSelection(style, { replace: true })}
        aria-label="Choose a style dialog"
      />

      <MessageDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        {...messageDialog}
        aria-label="Photo style transfer message"
      />
    </section>
  );
}
