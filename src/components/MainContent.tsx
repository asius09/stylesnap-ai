"use client";
import React, { useState, useRef, useEffect } from "react";
import { HeroDropZone } from "@/components/HeroDropZone";
import { PreviewCard } from "@/components/PreviewCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { useDownloadImage } from "@/hooks/useDownloadImage";
import { useProgressSteps } from "@/hooks/useProgressSteps";
import { useFileRemove } from "@/hooks/useFileRemove";
import { useStyleSelection } from "@/hooks/useStyleSelection";
import { Button } from "@/components/Button";
import { ImageData } from "@/types/style.types";
import { Loader } from "@/components/Loader";
import { motion } from "framer-motion";
import {
  StyleSelectionDialog,
  StyleSelectionDialogHandle,
} from "./StyleSelectionDialog";
import { StyleSelectionArea } from "./StyleSelectionArea";
import { GeneratedImagePreviewArea } from "./GeneratedImagePreviewArea";
import { useScreenDetector } from "@/hooks/useScreenDetector";

export function MainContent() {
  const [isStyleDialogOpen, setIsStyleDialogOpen] = useState(false);
  const styleDialogRef = useRef<StyleSelectionDialogHandle>(null);

  const [file, setFile] = useLocalStorage<ImageData | null>(
    "uploadedFile",
    null,
  );
  const [selectedStyle, setSelectedStyle] = useLocalStorage<ImageData | null>(
    "selectedStyle",
    null,
  );
  const { handleGenerate, generateStatus, generatedImage, loading } =
    useImageGeneration({
      file,
      selectedStyle,
    });

  const handleDownloadGeneratedImage = useDownloadImage({
    generatedImage,
    selectedStyle,
  });
  useProgressSteps(file, selectedStyle, generateStatus);

  const handleRemoveFile = useFileRemove({ file, setFile });
  const handleStyleSelection = useStyleSelection({
    file,
    setSelectedStyle,
  });

  const isReadyToGenerate =
    !!file && !!selectedStyle && !loading && generateStatus !== "success";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openStyleDialog = () => {
    setIsStyleDialogOpen(true);
  };

  const { isMobile } = useScreenDetector();

  const containerRef = useRef(null);

  useEffect(() => {
    if (
      (file || generatedImage || generateStatus === "success") &&
      containerRef.current
    ) {
      // @ts-expect-error: scrollIntoView is a valid method on HTMLElement
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [file, generateStatus, generatedImage]);

  function renderMainContent() {
    if (!file || !mounted) {
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
          className="flex h-full w-full items-center justify-center"
          id="hero-loader-section"
          aria-busy="true"
          aria-live="polite"
        >
          <Loader />
        </div>
      );
    }

    if (generateStatus === "success" && generatedImage?.imageUrl)
      return (
        <GeneratedImagePreviewArea
          generatedImage={generatedImage}
          handleDownloadGeneratedImage={handleDownloadGeneratedImage}
          setFile={setFile}
          setSelectedStyle={setSelectedStyle}
        />
      );

    // Main workflow: upload, select style, generate
    return isMobile ? (
      <div
        className="flex h-full w-full flex-col items-center justify-center py-4"
        id="hero-main-workflow"
        aria-label="Photo style transfer workflow"
      >
        <PreviewCard
          {...file}
          onRemove={handleRemoveFile}
          disableRemoveButton={!!selectedStyle || loading}
          aria-label="Uploaded photo preview"
        />
        <StyleSelectionArea
          mounted={mounted}
          selectedStyle={selectedStyle}
          openStyleDialog={openStyleDialog}
          setSelectedStyle={setSelectedStyle}
        />
        <Button
          variant={"gradient"}
          className="w-full max-w-60"
          onClick={handleGenerate}
          disabled={!isReadyToGenerate}
          id="mobile-generate-btn"
          aria-label="click to Apply style to image"
          tabIndex={0}
        >
          Generate
        </Button>
      </div>
    ) : (
      <div
        className="flex h-full w-full flex-row items-center justify-center gap-4 px-6 py-4"
        id="hero-main-workflow"
        aria-label="Photo style transfer workflow"
      >
        <PreviewCard
          {...file}
          onRemove={handleRemoveFile}
          disableRemoveButton={!!selectedStyle || loading}
          aria-label="Uploaded photo preview"
        />
        <Button
          variant={"gradient"}
          className="w-full max-w-60"
          onClick={handleGenerate}
          disabled={!isReadyToGenerate}
          id="mobile-generate-btn"
          aria-label="Click to Apply style to uplaoded image"
          tabIndex={0}
        >
          Generate
        </Button>
        <StyleSelectionArea
          mounted={mounted}
          selectedStyle={selectedStyle}
          openStyleDialog={openStyleDialog}
          setSelectedStyle={setSelectedStyle}
        />
      </div>
    );
  }
  return (
    <>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, filter: "blur(18px)", scale: 0.98 }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          transition: {
            opacity: { duration: 0.54, ease: [0.33, 1, 0.68, 1] },
            filter: { duration: 0.54, ease: [0.33, 1, 0.68, 1] },
            scale: { duration: 0.54, ease: [0.33, 1, 0.68, 1] },
          },
        }}
        exit={{
          opacity: 0,
          filter: "blur(12px)",
          scale: 0.98,
          transition: {
            opacity: { duration: 0.28, ease: [0.33, 1, 0.68, 1] },
            filter: { duration: 0.28, ease: [0.33, 1, 0.68, 1] },
            scale: { duration: 0.28, ease: [0.33, 1, 0.68, 1] },
          },
        }}
        className="border-primary/30 bg-background/60 focus-within:border-primary hover:border-primary relative flex max-h-[30rem] min-h-[28rem] w-full max-w-4xl flex-col items-center justify-center overflow-hidden rounded-2xl border-1 shadow-[0_2px_12px_0_var(--color-primary),0_0_24px_0_var(--color-primary)] transition duration-200 outline-none hover:shadow-[0_4px_24px_0_var(--color-primary),0_0_48px_0_var(--color-primary)]"
        id="hero-main-card"
        aria-label="Photo style transfer main card"
      >
        {renderMainContent()}
      </motion.div>
      <StyleSelectionDialog
        ref={styleDialogRef}
        isOpen={isStyleDialogOpen}
        onClose={() => setIsStyleDialogOpen(false)}
        selectedStyleId={selectedStyle?.id}
        onSelect={(style) => {
          handleStyleSelection(style);
          setIsStyleDialogOpen(false);
        }}
        onReplace={(style) => {
          handleStyleSelection(style, { replace: true });
          setIsStyleDialogOpen(false);
        }}
        onRemove={() => {
          setSelectedStyle(null);
          setIsStyleDialogOpen(false);
        }}
        aria-label="Choose a style dialog"
      />
    </>
  );
}
