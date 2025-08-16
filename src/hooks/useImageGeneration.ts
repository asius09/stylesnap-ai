import { useState } from "react";
import { generateImage } from "@/utils/generateImage";
import { ImageData, GenerateStatus } from "@/types/style.types";
import type { MessageDialogProps } from "@/components/MessageDialog";
import { useMessageDialog } from "@/components/MessageDialog";
import { usePaywall } from "@/components/pay/Paywall";
import { getTrialUsageStatus } from "@/utils/trialClient";

/**
 * useImageGeneration
 *
 * Hook to generate an image from a file and style, handling free trial and payment.
 *
 * @param file         The uploaded image file (ImageData or null)
 * @param selectedStyle The style to apply (ImageData or null)
 * @param trialId      User's trial identifier (string or null)
 * @param onError      Optional error callback
 * @param onSuccess    Optional success callback
 * @param addToast     Optional toast notification function
 *
 * @returns {
 *   handleGenerate: () => void,
 *   loading: boolean,
 *   generateStatus: "idle" | "success" | "failed",
 *   generatedImage: ImageData | null
 * }
 */
export const useImageGeneration = ({
  file,
  selectedStyle,
  trialId,
  onError,
  onSuccess,
  addToast,
}: {
  file: ImageData | null;
  selectedStyle: ImageData | null;
  trialId: string | null;
  onError?: (
    err: unknown,
    errorMessage?: string,
    errorDetails?: string,
  ) => void;
  onSuccess?: (generatedImage: ImageData) => void;
  addToast?: (toast: {
    type: "success" | "error" | "info";
    message: string;
  }) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [generateStatus, setGenerateStatus] = useState<GenerateStatus>("idle");
  const [generatedImage, setGeneratedImage] = useState<ImageData | null>(null);

  const { setOpen: setDialogOpen, setDialogProps } = useMessageDialog();
  const { setOpen: setPaywallOpen, open: paywallOpen } = usePaywall();

  // Helper to open a dialog
  const openDialog = (
    title: string,
    description: string,
    primaryAction?: MessageDialogProps["primaryAction"],
    secondaryAction?: MessageDialogProps["secondaryAction"],
  ) => {
    setDialogProps({
      title,
      description,
      primaryAction: primaryAction || { label: "Okay", onClick: () => {} },
      secondaryAction,
    });
    setDialogOpen(true);
  };

  /**
   * handleGenerate
   *
   * Validates input, checks trial status, and generates the image.
   */
  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedImage(null);

    // --- Static checks first ---
    const prompt = selectedStyle?.stylePrompt;
    if (!file?.imageUrl) {
      addToast?.({
        type: "error",
        message: "Please upload an image before generating.",
      });
      onError?.(null, "Please upload an image before generating.");
      setLoading(false);
      return;
    }
    if (!selectedStyle?.stylePrompt) {
      addToast?.({
        type: "error",
        message: "Please select a style before generating.",
      });
      onError?.(null, "Please select a style before generating.");
      setLoading(false);
      return;
    }
    if (!trialId) {
      addToast?.({
        type: "error",
        message: "Unable to verify your trial. Please refresh and try again.",
      });
      onError?.(
        null,
        "Unable to verify your trial. Please refresh and try again.",
      );
      setLoading(false);
      return;
    }
    if (typeof prompt !== "string" || prompt.trim() === "") {
      openDialog(
        "Invalid style prompt",
        "The selected style does not have a valid prompt. Please choose another style.",
      );
      onError?.(
        null,
        "The selected style does not have a valid prompt. Please choose another style.",
        "Invalid style prompt",
      );
      setLoading(false);
      return;
    }

    // --- Async check: trial status ---
    let trialStatus;
    try {
      trialStatus = await getTrialUsageStatus(trialId);
    } catch (err) {
      addToast?.({
        type: "error",
        message: "Could not verify trial status. Please try again.",
      });
      onError?.(err, "Could not verify trial status.");
      setLoading(false);
      return;
    }
    const hasUsedFreeTrial = trialStatus?.hasUsedFreeTrial;
    const isPaidUser = trialStatus?.isPaidUser;

    if (hasUsedFreeTrial && !isPaidUser) {
      if (paywallOpen) {
        setLoading(false);
        return;
      }
      openDialog(
        "Free trial used",
        "You have already used your free image. To generate more images, please proceed to payment.",
        {
          label: "Pay $9",
          onClick: () => {
            setPaywallOpen(true);
            setDialogOpen(false);
          },
        },
        {
          label: "Cancel",
          onClick: () => setDialogOpen(false),
        },
      );
      onError?.(null, "Free image used", "Free image used");
      setLoading(false);
      return;
    }

    // --- Generate image ---
    try {
      const generatedImageUrl = await generateImage({
        prompt: prompt as string,
        imageUrl: file.imageUrl,
        trialId: trialId,
      });

      let genImg: ImageData | null = null;
      if (generatedImageUrl) {
        genImg = {
          id: `generated-image-${selectedStyle.title}`,
          title: selectedStyle.title,
          imageUrl: generatedImageUrl,
          convertedStyleLabel: selectedStyle.title,
          fileSize: undefined,
        };
        setGenerateStatus("success");
        addToast?.({
          type: "success",
          message: "Image generated successfully.",
        });
        onSuccess?.(genImg);
      } else {
        setGenerateStatus("failed");
        addToast?.({ type: "error", message: "Failed to generate image." });
        onError?.(
          null,
          "Failed to generate image.",
          "No image URL returned from generation.",
        );
      }
      setGeneratedImage(genImg);
    } catch (error: any) {
      setGenerateStatus("failed");
      setGeneratedImage(null);
      addToast?.({ type: "error", message: "Failed to generate image." });
      onError?.(
        error,
        "Failed to generate image.",
        error?.message || undefined,
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    handleGenerate,
    generateStatus,
    generatedImage,
    loading,
  };
};
