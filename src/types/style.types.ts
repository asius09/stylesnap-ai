// --- ImageData type ---
export interface ImageData {
  id: string;
  title: string;
  imageUrl: string; // Public URL for display
  filePath?: string; // Supabase storage path (e.g. "upload_images/12345-filename.png")
  expiresIn?: number; // Seconds until auto-delete (e.g. 180)
  convertedStyleLabel?: string;
  stylePrompt?: string;
  fileSize?: string;
  contentType?: string; // MIME type (e.g. "image/png")
  supabaseFileName?: string;
  uploadedAt?: string; // ISO date string
}

// --- Step type ---
export interface Step {
  id: string;
  label: string;
  status: boolean | ImageData | null;
}

export type GenerateStatus = "success" | "failed" | "idle";
