import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "node:fs/promises";
import { join, extname } from "node:path";
import { existsSync } from "node:fs";

// Helper to get file path in public directory
function getFilePath(fileName: string) {
  return join(process.cwd(), "public", fileName);
}

// Helper to schedule file deletion after 30 minutes
function scheduleFileDeletion(
  filePath: string,
  timeoutMs: number = 30 * 60 * 1000,
) {
  setTimeout(async () => {
    if (existsSync(filePath)) {
      try {
        await unlink(filePath);
        console.log(`[API] File deleted after timeout: ${filePath}`);
      } catch (err) {
        console.warn(
          `[API] Failed to delete file after timeout: ${filePath}`,
          err,
        );
      }
    }
  }, timeoutMs);
}

// Helper to get extension from MIME type
function getExtensionFromMimeType(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/gif":
      return ".gif";
    case "image/webp":
      return ".webp";
    case "image/bmp":
      return ".bmp";
    case "image/svg+xml":
      return ".svg";
    default:
      return "";
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the incoming form data (expects multipart/form-data)
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { status: "failed", error: "No file uploaded" },
        { status: 400 },
      );
    }

    // Get extension from file type
    const blob = file as Blob;
    const mimeType = blob.type;
    const extension = getExtensionFromMimeType(mimeType) || ".jpg"; // fallback to .jpg

    // Always use "input" as the file name, but with extension
    const fileName = `input${extension}`;
    const filePath = getFilePath(fileName);

    // Remove previous file(s) with any extension
    const possibleExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".svg",
    ];
    for (const ext of possibleExtensions) {
      const oldPath = getFilePath(`input${ext}`);
      if (existsSync(oldPath)) {
        try {
          await unlink(oldPath);
        } catch (err) {
          // Log but do not fail the request if deletion fails
          console.warn(`[API] Could not remove previous file: ${oldPath}`, err);
        }
      }
    }

    // Get file buffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to public directory
    await writeFile(filePath, buffer);

    // Schedule deletion after 30 minutes
    scheduleFileDeletion(filePath);

    // Return the public URL
    const imageUrl = `/${fileName}`;
    return NextResponse.json({
      status: "successful",
      imageUrl,
      statusCode: 200,
      message: "File will be deleted automatically after 30 minutes.",
    });
  } catch (error: unknown) {
    console.error("[API] Error in /api/upload:", error);
    return NextResponse.json(
      { status: "failed", error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE endpoint to allow manual deletion
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Accept file name as query param or default to "input"
    const { searchParams } = new URL(request.url);
    let fileName = searchParams.get("fileName") || "input";
    // If no extension, try all possible extensions
    let filePath = getFilePath(fileName);

    if (!extname(fileName)) {
      // Try to find the file with any known extension
      const possibleExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".bmp",
        ".svg",
      ];
      let found = false;
      for (const ext of possibleExtensions) {
        const tryPath = getFilePath(`${fileName}${ext}`);
        if (existsSync(tryPath)) {
          filePath = tryPath;
          fileName = `${fileName}${ext}`;
          found = true;
          break;
        }
      }
      if (!found) {
        return NextResponse.json(
          { status: "failed", error: "File not found" },
          { status: 404 },
        );
      }
    } else {
      if (!existsSync(filePath)) {
        return NextResponse.json(
          { status: "failed", error: "File not found" },
          { status: 404 },
        );
      }
    }

    await unlink(filePath);

    return NextResponse.json({
      status: "successful",
      message: `File '${fileName}' deleted successfully.`,
      statusCode: 200,
    });
  } catch (error: unknown) {
    console.error("[API] Error in DELETE /api/upload:", error);
    return NextResponse.json(
      { status: "failed", error: "Internal server error" },
      { status: 500 },
    );
  }
}
