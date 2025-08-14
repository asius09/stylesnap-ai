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
  const handleSelect = (style: ImageData) => {
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
  };

  return handleSelect;
};
