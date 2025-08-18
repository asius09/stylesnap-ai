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

    // Always treat as public URL, do not check for structure
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
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch image.");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);

      if (addToast) addToast({ type: "success", message: "Image downloaded." });
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
