import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { success, failure } from "@/lib/apiResponse";
import { IMAGES_BUCKET_NAME } from "@/constant";

// POST: Upload an image
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return failure("No file provided", 400, "NO_FILE");
    }

    // Only upload once, with a single generated name
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    // Upload to the correct bucket, set cacheControl to 180 seconds for auto-delete
    const { data, error } = await supabase.storage
      .from(IMAGES_BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: "180", // 180 seconds (3 minutes)
        upsert: false,
      });

    if (error) {
      return failure(
        error.message || "Failed to upload file",
        500,
        undefined,
        error,
      );
    }

    // Generate a public URL for the uploaded file
    const { publicUrl } = supabase.storage
      .from(IMAGES_BUCKET_NAME)
      .getPublicUrl(fileName).data;

    // Schedule deletion after 180 seconds (fire-and-forget, not guaranteed)
    setTimeout(async () => {
      await supabase.storage.from(IMAGES_BUCKET_NAME).remove([fileName]);
    }, 180000);

    return success(
      {
        path: data?.path,
        url: publicUrl,
        expiresIn: 180,
      },
      200,
      undefined,
      "File uploaded successfully (auto-deletes in 3 minutes)",
    );
  } catch (err) {
    let message = "Internal Server Error";
    if (typeof err === "string") {
      message = err;
    } else if (err instanceof Error) {
      message = err.message;
    }
    return failure(
      message,
      500,
      "UPLOAD_ERROR",
      err,
      undefined,
      (err as Error)?.stack,
    );
  }
}

// DELETE: Delete an image by file name (expects JSON body: { fileName: string })
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    let fileName: string | undefined;

    // Try to get fileName from JSON body
    try {
      const body = await req.json();
      fileName = body?.fileName;
    } catch {
      // If parsing fails, try to get from query param
      const url = new URL(req.url);
      fileName = url.searchParams.get("fileName") || undefined;
    }

    if (!fileName) {
      return failure("No fileName provided", 400, "NO_FILENAME");
    }

    const { error } = await supabase.storage
      .from(IMAGES_BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      return failure(
        error.message || "Failed to delete file",
        500,
        undefined,
        error,
      );
    }

    return success(
      {
        deleted: true,
        fileName,
      },
      200,
      undefined,
      "File deleted successfully",
    );
  } catch (err) {
    let message = "Internal Server Error";
    if (typeof err === "string") {
      message = err;
    } else if (err instanceof Error) {
      message = err.message;
    }
    return failure(
      message,
      500,
      "DELETE_ERROR",
      err,
      undefined,
      (err as Error)?.stack,
    );
  }
}
