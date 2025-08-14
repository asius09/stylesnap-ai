import { ImageData, Step, GenerateStatus } from "@/types/style.types";
import { useState, useEffect } from "react";

/**
 * @useProgressSteps
 * Keeps progress steps in sync with file, selectedStyle, generateStatus, and downloadStatus.
 * @returns [steps, updateStep] steps and a utility to update a specific step.
 */
export function useProgressSteps(
  file: ImageData | null,
  selectedStyle: ImageData | null,
  generateStatus: GenerateStatus,
) {
  const [steps, setSteps] = useState<Step[]>([
    { id: "upload-tag", label: "Upload", status: false },
    { id: "select-style-tag", label: "Select Style", status: false },
    { id: "generate-tag", label: "Generate", status: false },
    { id: "download-tag", label: "Download", status: false },
  ]);

  useEffect(() => {
    setSteps((prev) => [
      { ...prev[0], status: !!file },
      { ...prev[1], status: !!selectedStyle },
      { ...prev[2], status: generateStatus === "success" },
      { ...prev[3], status: generateStatus === "success" },
    ]);
  }, [file, selectedStyle, generateStatus]);

  // Utility to update a specific step's status
  const updateStep = (tagName: string, status: boolean) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === tagName ? { ...step, status } : step)),
    );
  };

  return [steps, updateStep] as const;
}
