"use client";

import { PreviewCard } from "@/components/ui/PreviewCard";
import { Button } from "@/components/ui/Button";
import { ImageData } from "@/types/style.types";

interface GeneratedImagePreviewAreaProps {
  generatedImage: ImageData;
  handleDownloadGeneratedImage: () => void;
  setFile: (file: ImageData | null) => void;
  setSelectedStyle: (style: ImageData | null) => void;
}

export function GeneratedImagePreviewArea({
  generatedImage,
  handleDownloadGeneratedImage,
  setFile,
  setSelectedStyle,
}: GeneratedImagePreviewAreaProps) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center py-4 md:flex-row md:gap-8 md:py-8"
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
      <div className="mt-3 flex w-full flex-col items-center justify-center gap-y-2 px-3 md:w-1/2 md:gap-4">
        <Button
          variant={"gradient"}
          className="w-full max-w-60"
          onClick={handleDownloadGeneratedImage}
          id="download-generated-image-btn"
          aria-label="Download styled photo"
        >
          Download
        </Button>
        <Button
          variant={"outline"}
          className="w-full max-w-60 rounded-xl"
          onClick={() => {
            setFile(null);
            setSelectedStyle(null);
          }}
          id="generate-another-btn"
          aria-label="Style another photo"
        >
          Style Another for ₹9
        </Button>
      </div>
    </div>
  );
}
