import { ImageData } from "@/types/style.types";

type AddToast = (toast: {
  type: "success" | "error" | "info";
  message: string;
}) => void;

export const useStyleSelection = ({
  file,
  setSelectedStyle,
  addToast,
}: {
  file: ImageData | null;
  setSelectedStyle: (style: ImageData | null) => void;
  addToast?: AddToast;
}) => {
  // Handles both selecting and replacing a style
  const handleSelect = (style: ImageData, options?: { replace?: boolean }) => {
    if (!file) {
      if (addToast) {
        addToast({
          type: "error",
          message: "Please upload an image first.",
        });
      }
      return;
    }
    setSelectedStyle(style);
    if (addToast) {
      addToast({
        type: options?.replace ? "info" : "success",
        message: options?.replace
          ? `Style replaced with "${style.title}".`
          : `Style "${style.title}" selected.`,
      });
    }
  };

  return handleSelect;
};
