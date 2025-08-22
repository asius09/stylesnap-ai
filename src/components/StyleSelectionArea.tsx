"use client";
import { Plus } from "lucide-react";
import { PreviewCard } from "@/components/PreviewCard";
import { ImageData } from "@/types/style.types";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface StyleSelectionAreaProps {
  selectedStyle: ImageData | null;
  setSelectedStyle: (style: ImageData | null) => void;
  openStyleDialog: () => void;
  mounted: boolean;
}

export function StyleSelectionArea({
  selectedStyle,
  setSelectedStyle,
  openStyleDialog,
  mounted,
}: StyleSelectionAreaProps) {
  const { isMobile } = useScreenDetector();
  return isMobile ? (
    <div
      className="flex w-full flex-col items-center justify-center space-y-4 p-4"
      id="style-selection-area"
      aria-label="Choose a style"
    >
      <Button
        variant="outline"
        type="button"
        tabIndex={0}
        aria-label="Select a style"
        onClick={openStyleDialog}
        id="select-style-btn"
        className={cn(
          "focus-ring-primary w-full rounded-xl border py-2 outline-none",
          selectedStyle ? "text-white" : "text-primary",
        )}
      >
        {selectedStyle && mounted ? (
          selectedStyle.title
        ) : (
          <span className="flex h-full w-full items-center justify-center gap-3">
            Select Style
            <Plus className="size-5" aria-hidden="true" />
          </span>
        )}
      </Button>
    </div>
  ) : (
    <div
      className="flex w-full flex-col items-center justify-center"
      id="style-selection-area"
      aria-label="Choose a style"
    >
      {selectedStyle && mounted ? (
        <PreviewCard
          {...selectedStyle}
          onRemove={() => setSelectedStyle(null)}
          showRemoveButton={true}
          showSwitchButton={true}
          onSwitchStyle={openStyleDialog}
          aria-label="Selected style preview"
        />
      ) : (
        <div
          key="empty-style"
          className="border-primary/40 bg-background/70 hover:border-primary/70 focus-within:ring-primary/30 focus-ring-primary relative mb-3 flex aspect-[4/5] h-[300px] w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border transition focus-within:ring-2 focus-within:outline-none"
          id="empty-style-card"
          aria-label="No style selected"
        >
          <button
            type="button"
            className="focus-ring-primary flex h-full w-full items-center justify-center outline-none"
            tabIndex={0}
            aria-label="Select a style"
            onClick={openStyleDialog}
            id="select-style-btn"
          >
            <span className="bg-primary/10 text-primary group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full shadow transition">
              <Plus className="size-8" aria-hidden="true" />
            </span>
          </button>
        </div>
      )}

      {/* If No Style Selected Then show Select Button  */}
      {!selectedStyle && (
        <div className="w-full text-center">
          <>
            <p
              className="selection-primary focus-ring-primary text-text-color rounded px-2 text-sm font-semibold break-all"
              id="style-selection-label"
              tabIndex={0}
              aria-label="Select a style"
            >
              Select a style
            </p>
            <p
              className="selection-primary focus-ring-primary text-text-color/55 mb-1 rounded px-2 text-[11px]"
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
  );
}
