import { ImageData } from "@/types/style.types";
import { useToast } from "@/components/Toast";

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
      if (addToast)
        addToast({ type: "error", message: "No generated image to download." });
      return;
    }

    const url = generatedImage.imageUrl;

    const randomPart = Math.floor(
      10000000 + Math.random() * 90000000,
    ).toString();

    // Format style name
    const styleName = (selectedStyle?.title || generatedImage.title || "style")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    // Compose filename: snapstyle-styleName-randomnumber.ext
    const extMatch = url.match(/\.(\w+)(?:$|\?)/);
    const ext = extMatch ? extMatch[1] : "png";
    const filename = `snapstyle-${styleName}-${randomPart}.${ext}`;

    try {
      // Try to fetch the image as a blob
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch image.");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // For iOS Safari and some Android browsers, <a download> may not work.
      // So, we use a fallback for mobile devices.
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // For iOS Safari, open the image in a new tab so user can long-press to save
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(
            `<html><head><title>Download Image</title></head><body style="margin:0"><img src="${blobUrl}" style="width:100vw;max-width:100%;height:auto;display:block;"/></body></html>`,
          );
          if (addToast)
            addToast({
              type: "info",
              message: "Tap and hold the image to save it to your device.",
            });
        } else {
          // Fallback: just navigate to the image
          window.location.href = blobUrl;
          if (addToast)
            addToast({
              type: "info",
              message:
                "If the image does not download, tap and hold to save it.",
            });
        }
      } else {
        // Desktop: use the download attribute
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        if (addToast)
          addToast({ type: "success", message: "Image downloaded." });
      }

      // Revoke the blob URL after a short delay to allow download/new tab to work
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch (error) {
      if (addToast)
        addToast({
          type: "error",
          message: `Failed to download image. ${error instanceof Error ? error.message : ""}`,
        });
    }
  };

  return handleDownload;
};
