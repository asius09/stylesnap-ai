
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { promises as fs } from "fs";
import path from "path";
import FormData from "form-data";
import crypto from "crypto";

/**
 * POST /api/image-generator
 * Expects multipart/form-data: { prompt: string, fileName: string }
 * Returns: { status, imageUrl, statusCode } or error
 * 
 * Uses Stable Diffusion 3.5 Large (or other SD3.5 models) via Stability AI API.
 * Saves the generated image to the public/generated/ directory and returns a public URL.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("[API] Step 1: Parsing form data...");
    // Parse multipart form data
    const formData = await request.formData();
    const prompt = formData.get("prompt");
    const fileName = formData.get("fileName");

    console.log("[API] Step 1.1: Received prompt:", prompt);
    console.log("[API] Step 1.2: Received fileName:", fileName);

    if (typeof prompt !== "string" || typeof fileName !== "string") {
      console.error("[API] Step 1.3: Missing or invalid prompt or fileName in form data");
      return NextResponse.json({
        status: "failed",
        error: "Missing or invalid prompt or fileName in form data",
        statusCode: 400,
      });
    }

    // Handle file path: fileName is expected to be like "/filename" (relative to public)
    // Remove any leading slashes to prevent absolute path issues
    let sanitizedFileName = fileName.startsWith("/")
      ? fileName.slice(1)
      : fileName;

    // Prevent directory traversal
    if (sanitizedFileName.includes("..")) {
      console.error("[API] Step 1.4: Invalid file path (directory traversal detected)");
      return NextResponse.json({
        status: "failed",
        error: "Invalid file path",
        statusCode: 400,
      });
    }

    // If the fileName looks like a full URL or a data URL, reject it
    if (
      sanitizedFileName.startsWith("http://") ||
      sanitizedFileName.startsWith("https://") ||
      sanitizedFileName.startsWith("data:")
    ) {
      console.error("[API] Step 1.5: Invalid fileName (must be a file under the public directory)");
      return NextResponse.json({
        status: "failed",
        error: "Invalid fileName: must be a file under the public directory",
        statusCode: 400,
      });
    }

    // Construct the path to the file in the public folder
    const publicDir = path.join(process.cwd(), "public");
    const filePath = path.join(publicDir, sanitizedFileName);

    console.log("[API] Step 2: Reading file from public directory:", filePath);

    // Read the file from the public directory
    let fileBuffer: Buffer;
    try {
      fileBuffer = await fs.readFile(filePath);
      console.log("[API] Step 2.1: File read successfully.");
    } catch (err: any) {
      // Handle ENOENT (file not found) error with a clear message
      if (err.code === "ENOENT") {
        console.error(
          `[API] Step 2.2: File not found in public folder: ${filePath}`,
          err,
        );
        return NextResponse.json({
          status: "failed",
          error: `File not found in public folder: ${sanitizedFileName}`,
          statusCode: 404,
        });
      } else {
        console.error("[API] Step 2.3: Could not read file from public folder:", err);
        return NextResponse.json({
          status: "failed",
          error: "Could not read file from public folder",
          statusCode: 500,
        });
      }
    }

    // Guess the mime type from the file extension (default to jpeg)
    const ext = path.extname(sanitizedFileName).toLowerCase();
    let mimeType = "image/jpeg";
    if (ext === ".png") mimeType = "image/png";
    else if (ext === ".webp") mimeType = "image/webp";
    else if (ext === ".gif") mimeType = "image/gif";
    else if (ext === ".bmp") mimeType = "image/bmp";

    console.log("[API] Step 3: Preparing form data for Stability API (SD 3.5)...");
    // Prepare form data for Stability API (SD 3.5)
    const stabilityForm = new FormData();
    stabilityForm.append("prompt", prompt);
    stabilityForm.append("image", fileBuffer, {
      filename: sanitizedFileName,
      contentType: mimeType,
    });
    stabilityForm.append("output_format", "jpeg");
    stabilityForm.append("mode", "image-to-image");
    stabilityForm.append("strength", "0.7"); // Default strength, can be adjusted

    // Optionally, you can allow model selection via a query param or env, e.g.:
    // stabilityForm.append("model", "sd3.5-large"); // or sd3.5-large-turbo, sd3.5-medium, sd3.5-flash

    console.log("[API] Step 4: Sending request to Stability API (SD 3.5)...");

    // Call Stability API (SD 3.5)
    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/sd3",
      stabilityForm,
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY ?? "sk-MYAPIKEY"}`,
          Accept: "image/*",
          ...stabilityForm.getHeaders(),
        },
      },
    );

    console.log("[API] Step 4.1: Stability API response status:", response.status);

    if (response.status !== 200) {
      let errorMsg = "[API] Step 4.2: Stability API error: " + response.status;
      try {
        // Try to parse error message if response is JSON
        if (
          response.headers["content-type"] &&
          response.headers["content-type"].includes("application/json")
        ) {
          const errorJson = JSON.parse(Buffer.from(response.data).toString("utf-8"));
          errorMsg += " - " + (errorJson.error || JSON.stringify(errorJson));
        }
      } catch (e) {
        // ignore
      }
      console.error(errorMsg);
      return NextResponse.json({
        status: "failed",
        error: errorMsg,
        statusCode: response.status,
      });
    }

    console.log("[API] Step 5: Saving generated image to public/generated/ ...");
    // Save the generated image to public/generated/
    const generatedDir = path.join(publicDir, "generated");
    // Ensure the directory exists
    await fs.mkdir(generatedDir, { recursive: true });
    console.log("[API] Step 5.1: Ensured generated directory exists:", generatedDir);

    // Generate a unique filename for the generated image
    const hash = crypto.createHash("sha256");
    hash.update(prompt + Date.now().toString() + Math.random().toString());
    const uniqueName = hash.digest("hex").slice(0, 16);
    const outputFileName = `${uniqueName}.jpeg`;
    const outputFilePath = path.join(generatedDir, outputFileName);

    // Write the image buffer to the file
    await fs.writeFile(outputFilePath, Buffer.from(response.data));
    console.log("[API] Step 5.2: Image written to:", outputFilePath);

    // The public URL to access the generated image
    const imageUrl = `/generated/${outputFileName}`;

    console.log(
      "[API] Step 6: Successfully generated image (SD 3.5). Saved to:",
      imageUrl
    );

    return NextResponse.json({
      status: "successful",
      imageUrl,
      statusCode: 200,
    });
  } catch (error: unknown) {
    console.error("[API] Error in image generation:", error);
    return NextResponse.json({
      status: "failed",
      error:
        error && typeof error === "object" && "message" in error
          ? (error as { message?: string }).message
          : "Unknown error",
      statusCode: 500,
    });
  }
}
