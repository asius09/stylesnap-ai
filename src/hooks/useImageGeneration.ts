import { useState } from "react";
import { generateImage } from "@/utils/generateImage";
import { ImageData, GenerateStatus } from "@/types/style.types";
import type { MessageDialogProps } from "@/components/MessageDialog";
import { useMessageDialog } from "@/components/MessageDialog";
import { usePaywall } from "@/components/pay/Paywall";
import { getTrialUsageStatus } from "@/utils/trialClient";
import { useToast } from "@/components/Toast";

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
}) => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
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
          label: "Pay ₹9",
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
      }
      setGeneratedImage(genImg);
    } catch (err) {
      setGenerateStatus("failed");
      setGeneratedImage(null);

      // Use a type-safe error object
      let errorMessage: string | undefined;
      let errorStatus: number | undefined;
      if (err instanceof Error) {
        errorMessage = err.message;
        // Optionally, if your error object has a status property (e.g., from fetch/axios)
        // @ts-expect-error: custom error may have status
        errorStatus = typeof err.status === "number" ? err.status : undefined;
      } else if (typeof err === "object" && err !== null) {
        // @ts-expect-error: custom error may have message/status
        errorMessage = typeof err.message === "string" ? err.message : undefined;
        // @ts-expect-error: custom error may have status
        errorStatus = typeof err.status === "number" ? err.status : undefined;
      }

      // Check for paywall error (status 403), then show paywall dialog (not toast, open dialog)
      const isPaywallError = typeof errorStatus === "number" && errorStatus === 403;

      if (isPaywallError) {
        openDialog(
          "Payment Required",
          "You need to pay to generate more images. Please proceed to payment to continue.",
          {
            label: "Pay ₹9",
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
      } else {
        // Check for Replicate error (status 500 or 502 or error message contains "replicate")
        const isReplicateError =
          (typeof errorStatus === "number" &&
            (errorStatus === 500 || errorStatus === 502)) ||
          (typeof errorMessage === "string" &&
            errorMessage.toLowerCase().includes("replicate"));

        addToast?.({
          type: "error",
          message: "Failed to generate image.",
        });

        if (isReplicateError) {
          openDialog(
            "Image Generation Error",
            "There was a problem with the AI image generation service. Please try again later or contact support if the issue persists.",
            {
              label: "Okay",
              onClick: () => setDialogOpen(false),
            },
          );
        }
      }

      onError?.(
        err,
        "Failed to generate image.",
        errorMessage,
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
