import { ImageData } from "@/types/style.types";

type AddToast = (toast: {
  type: "success" | "error" | "info";
  message: string;
}) => void;

export const useDownloadImage = ({
  generatedImage,
  selectedStyle,
  addToast,
}: {
  generatedImage: ImageData | null;
  selectedStyle: ImageData | null;
  addToast?: AddToast;
}) => {
  const handleDownload = () => {
    if (!generatedImage?.imageUrl) {
      if (addToast)
        addToast({ type: "error", message: "No generated image to download." });
      return;
    }

    // The image is in the public folder, so just trigger a download
    const url = generatedImage.imageUrl.startsWith("/")
      ? generatedImage.imageUrl
      : `/${generatedImage.imageUrl}`;

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

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    if (addToast) addToast({ type: "success", message: "Image downloaded." });
  };

  return handleDownload;
};
