import { ImageData } from "@/types/style.types";
import { useToast } from "@/components/Toast";

export const useStyleSelection = ({
  file,
  setSelectedStyle,
}: {
  file: ImageData | null;
  setSelectedStyle: (style: ImageData | null) => void;
}) => {
  // Handles both selecting and replacing a style
  const { addToast } = useToast();
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
