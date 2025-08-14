import { ImageData } from "@/types/style.types";

type AddToast = (toast: {
  type: "success" | "error" | "info";
  message: string;
}) => void;

export const useFileRemove = ({
  file,
  setFile,
  addToast,
}: {
  file: ImageData | null;
  setFile: (f: ImageData | null) => void;
  addToast?: AddToast;
}) => {
  const handleRemove = async () => {
    try {
      const imageUrl = file?.imageUrl;
      if (imageUrl) {
        let fileName = "";
        try {
          if (imageUrl.startsWith("/")) {
            fileName = imageUrl.slice(1);
          } else {
            const url = new URL(imageUrl, window.location.origin);
            fileName = url.pathname.replace(/^\//, "");
          }
        } catch {
          // ignore parse errors; proceed to clear local state
        }

        if (fileName) {
          await fetch("/api/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName }),
          }).catch(() => {});
        }
      }
    } finally {
      setFile(null);
      if (addToast) addToast({ type: "info", message: "File removed." });
    }
  };

  return handleRemove;
};
