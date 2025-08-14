import { useState } from "react";
import { generateImage } from "@/utils/generateImage";
import { ImageData, GenerateStatus } from "@/types/style.types";
import type { MessageDialogProps } from "@/components/MessageDialog";

/**
 * useImageGeneration
 *
 * This custom React hook encapsulates the logic for generating a new image
 * based on a user-uploaded file and a selected style. It manages the state
 * and side effects related to the image generation process, including:
 *   - Loading state
 *   - Generation status (idle, success, failed)
 *   - The generated image data
 *   - Error and success handling (toasts, dialogs, callbacks)
 *
 * It also handles the free trial logic: if the user has already used their free
 * generation, it prevents further generations and prompts the user to pay.
 *
 * Usage:
 *   const {
 *     handleGenerate,
 *     loading,
 *     generateStatus,
 *     generatedImage,
 *   } = useImageGeneration({ file, selectedStyle, trialId, ...optionalHandlers });
 *
 * @param {object} params
 *   - file: The uploaded image file (ImageData or null)
 *   - selectedStyle: The style to apply (ImageData or null)
 *   - trialId: The user's trial identifier (string or null)
 *   - freeUsed: Whether the free trial has been used (boolean or null)
 *   - onError: Optional error callback
 *   - onSuccess: Optional success callback
 *   - setMessageDialog: Optional dialog setter for showing messages
 *   - setIsDialogOpen: Optional dialog open state setter
 *   - addToast: Optional toast notification function
 *
 * @returns {object}
 *   - handleGenerate: Function to trigger image generation
 *   - loading: Boolean indicating if generation is in progress
 *   - generateStatus: Status string ("idle" | "success" | "failed")
 *   - generatedImage: The generated image data (ImageData or null)
 */
export const useImageGeneration = ({
  file,
  selectedStyle,
  trialId,
  onError,
  onSuccess,
  setMessageDialog,
  setIsDialogOpen,
  addToast,
  freeUsed,
}: {
  freeUsed: boolean | null;
  file: ImageData | null;
  selectedStyle: ImageData | null;
  trialId: string | null;
  onError?: (
    err: unknown,
    errorMessage?: string,
    errorDetails?: string,
  ) => void;
  onSuccess?: (generatedImage: ImageData) => void;
  setMessageDialog?: React.Dispatch<
    React.SetStateAction<Partial<MessageDialogProps>>
  >;
  setIsDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  addToast?: (toast: {
    type: "success" | "error" | "info";
    message: string;
  }) => void;
}) => {
  // State for loading spinner during generation
  const [loading, setLoading] = useState(false);
  // State for tracking the current status of generation
  const [generateStatus, setGenerateStatus] = useState<GenerateStatus>("idle");
  // State for storing the generated image data
  const [generatedImage, setGeneratedImage] = useState<ImageData | null>(null);

  /**
   * Helper to open a dialog with a title, description, and optional actions.
   * Used for error, info, and payment prompts.
   */
  const openDialog = (
    title: string,
    description: string,
    primaryAction?: MessageDialogProps["primaryAction"],
    secondaryAction?: MessageDialogProps["secondaryAction"],
  ) => {
    if (setMessageDialog) {
      setMessageDialog({
        title,
        description,
        primaryAction: primaryAction || { label: "Okay", onClick: () => {} },
        secondaryAction,
      });
    }
    if (setIsDialogOpen) setIsDialogOpen(true);
  };

  /**
   * handleGenerate
   *
   * Main function to trigger image generation.
   * - Validates input (file, style, trialId, prompt)
   * - Handles free trial logic (blocks if already used)
   * - Shows dialogs or toasts for errors or payment prompts
   * - Calls the generateImage utility to perform the actual generation
   * - Updates state and calls callbacks on success/failure
   */
  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedImage(null);

    // Precompute all checks at the top
    const prompt = selectedStyle?.stylePrompt;
    const isMissingFile = !file?.imageUrl;
    const isMissingStyle = !selectedStyle?.stylePrompt;
    const isMissingTrialId = !trialId;
    const isInvalidPrompt = typeof prompt !== "string" || prompt.trim() === "";
    const isFreeUsed = !!freeUsed;

    // If any required data is missing or free trial is used, handle accordingly
    if (
      isFreeUsed ||
      isMissingFile ||
      isMissingStyle ||
      isMissingTrialId ||
      isInvalidPrompt
    ) {
      // Free trial used
      if (isFreeUsed) {
        openDialog(
          "Free trial used",
          "You have already used your free image. To generate more images, please proceed to payment.",
          {
            label: "Pay $9",
            onClick: () => {
              window.open("/payment", "_blank");
              if (setIsDialogOpen) setIsDialogOpen(false);
            },
          },
          {
            label: "Cancel",
            onClick: () => {
              if (setIsDialogOpen) setIsDialogOpen(false);
            },
          },
        );
        if (onError) onError(null, "Free image used", "Free image used");
        setLoading(false);
        return;
      }

      // Missing file
      if (isMissingFile) {
        if (addToast)
          addToast({
            type: "error",
            message: "Please upload an image before generating.",
          });
        if (onError) onError(null, "Please upload an image before generating.");
        setLoading(false);
        return;
      }

      // Missing style
      if (isMissingStyle) {
        if (addToast)
          addToast({
            type: "error",
            message: "Please select a style before generating.",
          });
        if (onError) onError(null, "Please select a style before generating.");
        setLoading(false);
        return;
      }

      // Missing trialId
      if (isMissingTrialId) {
        if (addToast)
          addToast({
            type: "error",
            message:
              "Unable to verify your trial. Please refresh and try again.",
          });
        if (onError)
          onError(
            null,
            "Unable to verify your trial. Please refresh and try again.",
          );
        setLoading(false);
        return;
      }

      // Invalid style prompt
      if (isInvalidPrompt) {
        openDialog(
          "Invalid style prompt",
          "The selected style does not have a valid prompt. Please choose another style.",
        );
        if (onError)
          onError(
            null,
            "The selected style does not have a valid prompt. Please choose another style.",
            "Invalid style prompt",
          );
        setLoading(false);
        return;
      }
    }

    // All checks passed, attempt to generate the image
    try {
      const generatedImageUrl = await generateImage({
        prompt: prompt as string,
        imageUrl: file!.imageUrl,
        trialId: trialId!,
      });

      let genImg: ImageData | null = null;
      if (generatedImageUrl) {
        // If generation succeeded, construct the ImageData object
        genImg = {
          id: `generated-image-${selectedStyle!.title}`,
          title: selectedStyle!.title,
          imageUrl: generatedImageUrl,
          convertedStyleLabel: selectedStyle?.title,
          fileSize: undefined,
        };
        setGenerateStatus("success");
        if (addToast)
          addToast({
            type: "success",
            message: "Image generated successfully.",
          });
        if (onSuccess) onSuccess(genImg);
      } else {
        // If generation failed, update status and notify user
        setGenerateStatus("failed");
        if (addToast)
          addToast({ type: "error", message: "Failed to generate image." });
        if (onError) {
          onError(
            null,
            "Failed to generate image.",
            "No image URL returned from generation.",
          );
        }
      }
      setGeneratedImage(genImg);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handle unexpected errors
      setGenerateStatus("failed");
      setGeneratedImage(null);
      if (addToast)
        addToast({ type: "error", message: "Failed to generate image." });
      if (onError) {
        onError(
          error,
          "Failed to generate image.",
          error?.message || undefined,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Return the API for consumers of this hook
  return {
    handleGenerate,
    generateStatus,
    generatedImage,
    loading,
  };
};
