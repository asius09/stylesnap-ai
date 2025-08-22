import { ImageData } from "@/types/style.types";
import { useToast } from "@/components/ui/Toast";

/**
 * useDownloadImage
 *
 * This hook returns a function to download the generated image.
 *
 * On desktop browsers, it triggers a download using an <a download> link.
 *
 * On mobile devices (iOS Safari, Android browsers), where <a download> is not always supported,
 * it opens the image in a new tab using a blob URL. The user is then instructed (via toast)
 * to tap and hold the image to save it to their device.
 */
export const useDownloadImage = ({
  generatedImage,
  selectedStyle,
}: {
  generatedImage: ImageData | null;
  selectedStyle: ImageData | null;
}) => {
  const { addToast } = useToast();

  const handleDownload = async () => {
    if (!generatedImage?.imageUrl) {
      addToast?.({ type: "error", message: "No generated image to download." });
      return;
    }

    const url = generatedImage.imageUrl;
    const randomPart = Math.floor(
      10000000 + Math.random() * 90000000,
    ).toString();

    // Format style name for filename
    const styleName = (selectedStyle?.title || generatedImage.title || "style")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    // Compose filename: snapstyle-styleName-randomnumber.ext
    const extMatch = url.match(/\.(\w+)(?:$|\?)/);
    const ext = extMatch ? extMatch[1] : "png";
    const filename = `snapstyle-${styleName}-${randomPart}.${ext}`;

    try {
      // Fetch the image as a blob
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch image.");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Detect mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        /**
         * On mobile devices, <a download> is unreliable (especially on iOS Safari).
         * Instead, we open the image in a new tab using a blob URL.
         * The user can then tap and hold the image to save it.
         *
         * - If window.open() succeeds, we inject an <img> tag into the new tab.
         * - If window.open() fails (popup blocked), we fallback to navigating to the blob URL.
         *
         * In both cases, we show a toast to instruct the user.
         */
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(
            `<html><head><title>Download Image</title></head><body style="margin:0"><img src="${blobUrl}" style="width:100vw;max-width:100%;height:auto;display:block;"/></body></html>`,
          );
          addToast?.({
            type: "info",
            message: "Tap and hold the image to save it to your device.",
          });
        } else {
          // Fallback: navigate to the image directly
          window.location.href = blobUrl;
          addToast?.({
            type: "info",
            message: "If the image does not download, tap and hold to save it.",
          });
        }
      } else {
        // Desktop: use <a download>
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        addToast?.({ type: "success", message: "Image downloaded." });
      }

      // Revoke the blob URL after a short delay
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch (error) {
      addToast?.({
        type: "error",
        message: `Failed to download image. ${error instanceof Error ? error.message : ""}`,
      });
    }
  };

  return handleDownload;
};
