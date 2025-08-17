import { useState } from "react";
import { generateImage } from "@/utils/generateImage";
import { ImageData, GenerateStatus } from "@/types/style.types";
import type { MessageDialogProps } from "@/components/MessageDialog";
import { useMessageDialog } from "@/components/MessageDialog";
import { usePaywall } from "@/components/pay/Paywall";
import { getTrialUsageStatus } from "@/utils/trialClient";
import { useToast } from "@/components/Toast";
import { useTrialId } from "./useTrialId";

/**
 * useImageGeneration
 *
 * Custom React hook to handle image generation with free trial and payment logic.
 * Handles all error cases according to backend error codes/status, showing actionable dialogs
 * for payment-required or backend/model errors, and simple toasts for all other errors.
 *
 * @param file           The uploaded image file (ImageData or null)
 * @param selectedStyle  The style to apply (ImageData or null)
 * @param onError        Optional error callback
 * @param onSuccess      Optional success callback
 *
 * @returns {
 *   handleGenerate: () => Promise<void>,
 *   loading: boolean,
 *   generateStatus: "idle" | "success" | "failed",
 *   generatedImage: ImageData | null
 * }
 */
export const useImageGeneration = ({
  file,
  selectedStyle,
  onError,
  onSuccess,
}: {
  file: ImageData | null;
  selectedStyle: ImageData | null;
  onError?: (
    err: unknown,
    errorMessage?: string,
    errorDetails?: string,
  ) => void;
  onSuccess?: (generatedImage: ImageData) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [generateStatus, setGenerateStatus] = useState<GenerateStatus>("idle");
  const [generatedImage, setGeneratedImage] = useState<ImageData | null>(null);

  const { addToast } = useToast();
  const { trialId } = useTrialId();
  const { setOpen: setDialogOpen, setDialogProps } = useMessageDialog();
  const { setOpen: setPaywallOpen, open: paywallOpen } = usePaywall();

  /**
   * Helper to open a dialog with the given title, description, and actions.
   */
  const openDialog = (
    title: string,
    description: string,
    primaryAction?: MessageDialogProps["primaryAction"],
    secondaryAction?: MessageDialogProps["secondaryAction"],
  ) => {
    setDialogProps({
      title,
      description,
      primaryAction: primaryAction || {
        label: "Okay",
        onClick: () => setDialogOpen(false),
      },
      secondaryAction,
    });
    setDialogOpen(true);
  };

  /**
   * Main handler to generate an image.
   * Validates input, checks trial/payment status, and calls the backend.
   * Handles all error cases according to backend error codes/status.
   */
  const handleGenerate = async (): Promise<void> => {
    setLoading(true);
    setGeneratedImage(null);

    // --- Input validation ---
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

    // --- Check trial/payment status ---
    let trialStatus: { hasUsedFreeTrial: boolean; isPaidUser: boolean } = {
      hasUsedFreeTrial: false,
      isPaidUser: false,
    };
    try {
      const status = await getTrialUsageStatus(trialId);
      if (status && typeof status === "object") {
        trialStatus = {
          hasUsedFreeTrial: Boolean(status.hasUsedFreeTrial),
          isPaidUser: Boolean(status.isPaidUser),
        };
      }
    } catch (err) {
      addToast?.({
        type: "error",
        message: "Could not verify trial status. Please try again.",
      });
      onError?.(err, "Could not verify trial status.");
      setLoading(false);
      return;
    }

    // If free trial is used and not paid, show paywall dialog
    if (trialStatus.hasUsedFreeTrial && !trialStatus.isPaidUser) {
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

    // --- Generate image via backend ---
    try {
      const generatedImageUrl = await generateImage({
        prompt: prompt as string,
        imageUrl: file.imageUrl,
        trialId: trialId,
      });

      if (generatedImageUrl) {
        const genImg: ImageData = {
          id: `generated-image-${selectedStyle.title}`,
          title: selectedStyle.title,
          imageUrl: generatedImageUrl,
          convertedStyleLabel: selectedStyle.title,
          fileSize: undefined,
        };
        setGenerateStatus("success");
        setGeneratedImage(genImg);
        addToast?.({
          type: "success",
          message: "Image generated successfully.",
        });
        onSuccess?.(genImg);
      } else {
        setGenerateStatus("failed");
        setGeneratedImage(null);
        addToast?.({
          type: "error",
          message: "Failed to generate image.",
        });
        onError?.(null, "Failed to generate image.");
      }
    } catch (err) {
      setGenerateStatus("failed");
      setGeneratedImage(null);

      // Extract error info as per backend contract
      let errorCode = "";
      let errorStatus: number | undefined;
      let errorMessage = "Failed to generate image.";

      if (err && typeof err === "object" && err !== null) {
        if ("code" in err && typeof (err as any).code === "string") {
          errorCode = (err as any).code;
        }
        if ("status" in err && typeof (err as any).status === "number") {
          errorStatus = (err as any).status;
        }
        if ("message" in err && typeof (err as any).message === "string") {
          errorMessage = (err as any).message;
        }
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      // Show actionable dialogs for payment/backend errors, else show toast
      if (
        errorCode === "FREE_LIMIT_REACHED" ||
        errorCode === "NEED_PAYMENT" ||
        errorCode === "PAID_CREDITS_EXHAUSTED" ||
        errorStatus === 403
      ) {
        openDialog(
          "Payment Required",
          errorMessage ||
            "You have reached your free image generation limit. Please proceed to payment to generate more images.",
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
      } else if (
        errorCode === "REPLICATE_ERROR" ||
        errorCode === "MODEL_ERROR" ||
        errorCode === "IMAGE_GENERATOR_ERROR" ||
        errorCode === "REPLICATE_PAYMENT_REQUIRED" ||
        errorStatus === 500 ||
        errorStatus === 502 ||
        errorStatus === 520 ||
        errorStatus === 522
      ) {
        openDialog(
          "Image Generation Error",
          errorMessage ||
            "There was a problem with the AI image generation service. Please try again later or contact support if the issue persists.",
          {
            label: "Okay",
            onClick: () => setDialogOpen(false),
          },
        );
      } else if (
        errorCode === "MISSING_TRIAL_ID" ||
        errorCode === "MISSING_PROMPT_OR_IMAGE_URL" ||
        errorCode === "USER_NOT_FOUND" ||
        errorCode === "DAILY_QUOTA_NOT_FOUND" ||
        errorCode === "FAILED_FETCH_DAILY_QUOTA"
      ) {
        openDialog(
          "Request Error",
          errorMessage ||
            "There was a problem with your request. Please refresh and try again.",
          {
            label: "Okay",
            onClick: () => setDialogOpen(false),
          },
        );
      } else {
        addToast?.({
          type: "error",
          message: errorMessage || "Failed to generate image.",
        });
      }

      onError?.(err, "Failed to generate image.", errorMessage);
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
