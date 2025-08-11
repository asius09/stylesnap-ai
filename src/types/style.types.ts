// --- ImageData type ---
export interface ImageData {
  id: string;
  title: string;
  imageUrl: string;
  convertedStyleLabel?: string;
  stylePrompt?: string;
  fileSize?: string;
}

// --- Step type ---
export interface Step {
  id: string;
  label: string;
  status: boolean | ImageData | null;
}

export type GenerateStatus = "success" | "failed" | "idle";
