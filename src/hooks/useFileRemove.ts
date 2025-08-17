import { ImageData } from "@/types/style.types";
import { useToast } from "@/components/Toast";
import { removeImage } from "@/utils/imageClient";

/**
 * Custom hook to handle file removal with user feedback.
 * Handles errors and success, and always clears the file state.
 */
export const useFileRemove = ({
  file,
  setFile,
}: {
  file: ImageData | null;
  setFile: (f: ImageData | null) => void;
}) => {
  const { addToast } = useToast();

  const handleRemove = async () => {
    if (!file) {
      if (addToast) addToast({ type: "info", message: "No file to remove." });
      setFile(null);
      return;
    }

    const fileName = file.supabaseFileName;

    if (!fileName) {
      if (addToast) addToast({ type: "error", message: "File has no image." });
      setFile(null);
      return;
    }

    try {
      await removeImage(fileName);
      if (addToast) addToast({ type: "info", message: "File removed." });
    } catch (err) {
      let message = "Failed to remove file.";
      if (err instanceof Error && err.message) {
        message = `Failed to remove file: ${err.message}`;
      } else if (typeof err === "string") {
        message = `Failed to remove file: ${err}`;
      }
      if (addToast) addToast({ type: "error", message });
    } finally {
      setFile(null);
    }
  };

  return handleRemove;
};
