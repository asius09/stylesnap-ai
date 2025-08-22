import { ImageData } from "@/types/style.types";
import { useToast } from "@/components/ui/Toast";

/**
 * useDownloadImage
 *
 * This hook returns a function to download the generated image with a single click
 * on both desktop and mobile devices. It uses blob URLs with <a download> for
 * maximum compatibility and ensures direct download without opening new tabs.
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

    // Determine file extension
    let ext = "png";
    if (url.startsWith("data:")) {
      const mimeMatch = url.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
      if (mimeMatch) {
        const mime = mimeMatch[1];
        if (mime === "image/jpeg") ext = "jpg";
        else if (mime === "image/png") ext = "png";
        else if (mime === "image/webp") ext = "webp";
        else if (mime === "image/gif") ext = "gif";
      }
    } else {
      const extMatch = url.match(/\.(\w+)(?:$|\?)/);
      if (extMatch) ext = extMatch[1];
    }

    const filename = `snapstyle-${styleName}-${randomPart}.${ext}`;

    try {
      // Convert to blob for consistent handling
      let blob: Blob;
      if (url.startsWith("data:")) {
        const res = await fetch(url);
        blob = await res.blob();
      } else {
        const response = await fetch(url, { mode: "cors" });
        if (!response.ok) throw new Error("Failed to fetch image.");
        blob = await response.blob();
      }

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = filename;

      // Add to DOM temporarily
      document.body.appendChild(a);

      // Trigger download
      a.click();

      // Clean up immediately
      document.body.removeChild(a);

      // Revoke blob URL after a short delay to ensure download starts
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);

      addToast?.({ type: "success", message: "Image downloaded." });
    } catch (error) {
      console.error("Download error:", error);

      // Fallback: if direct download fails, try alternative method
      try {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.target = "_self"; // Prevent new tab

        // Force download attribute recognition
        link.setAttribute("download", filename);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        addToast?.({ type: "success", message: "Image downloaded." });
      } catch (fallbackError) {
        addToast?.({
          type: "error",
          message: `Failed to download image. ${error instanceof Error ? error.message : ""}`,
        });
      }
    }
  };

  return handleDownload;
};
