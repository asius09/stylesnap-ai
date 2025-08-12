import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const prompt = body.prompt;
    // Handle local file path or remote URL for image input
    let image_url: string;

    if (body.image_url && typeof body.image_url === "string") {
      // If the image_url is a local file path (starts with "/"), read and encode as base64
      if (body.image_url.startsWith("/")) {
        const filePath = join(process.cwd(), "public", body.image_url);
        const data = (await readFile(filePath)).toString("base64");
        image_url = `data:application/octet-stream;base64,${data}`;
      } else if (
        body.image_url.startsWith("http://") ||
        body.image_url.startsWith("https://")
      ) {
        // If it's a remote URL, use as-is
        image_url = body.image_url;
      } else {
        throw new Error("Invalid image_url format");
      }
    } else {
      throw new Error("Missing image_url in request body");
    }

    console.log("[API] Received POST /api/image-generator");
    console.log("[API] Request body:", body);

    if (!prompt || !image_url) {
      console.error("[API] Missing prompt or image_url in request body");
      return NextResponse.json({
        status: "failed",
        error: "Missing prompt or image_url in request body",
        statusCode: 400,
      });
    }

    console.log(
      "[API] Initializing Replicate with API token:",
      process.env.REPLICATE_API_TOKEN ? "****" : "undefined",
    );
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    console.log("[API] Replicate instance created:", !!replicate);

    const input = {
      prompt: prompt,
      input_image: image_url,
      aspect_ratio: "match_input_image",
      output_format: "jpg",
      safety_tolerance: 2,
      prompt_upsampling: false,
    };

    console.log("[API] Replicate input:", input);

    // Run the model and handle the output
    const output = await replicate.run("black-forest-labs/flux-kontext-pro", {
      input,
    });

    // Handle Replicate output: output is usually an array of URLs (for images)
    // or a single URL string, depending on the model.
    // We'll handle both cases.
    let imageUrl: string | undefined;
    if (
      Array.isArray(output) &&
      output.length > 0 &&
      typeof output[0] === "string"
    ) {
      imageUrl = output[0];
    } else if (typeof output === "string") {
      imageUrl = output;
    } else if (
      output &&
      typeof output === "object" &&
      "url" in output &&
      typeof output.url === "function"
    ) {
      // Some models return an object with a .url() method
      imageUrl = output.url();
    }

    // Handle the "hgihet light" error (likely "highlight" or "high light" error)
    // We'll check if the output is an error object or contains a known error message
    if (
      !imageUrl ||
      (typeof imageUrl === "string" &&
        (imageUrl.toLowerCase().includes("hgihet light") ||
          imageUrl.toLowerCase().includes("highlight error") ||
          imageUrl.toLowerCase().includes("high light error")))
    ) {
      console.error(
        "[API] Model returned a hgihet light error or no image URL",
      );
      return NextResponse.json({
        status: "failed",
        error:
          "The model failed due to a highlight (hgihet light) error. Please try a different image or prompt.",
        statusCode: 500,
      });
    }

    // Download the image and save to public/output.jpg
    // We'll fetch the image from the URL and write it to disk
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(
        "Failed to fetch generated image from Replicate output URL",
      );
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const publicPath = join(process.cwd(), "public", "output.jpg");
    await writeFile(publicPath, buffer);

    console.log("[API] Replicate output image saved to:", publicPath);

    return NextResponse.json({
      status: "successful",
      imageUrl: "/output.jpg",
      statusCode: 200,
    });
  } catch (error: unknown) {
    // Special handling for "hgihet light" error in error message
    let errorMessage = "Unknown error";
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as any).message === "string"
    ) {
      errorMessage = (error as any).message;
      if (
        errorMessage.toLowerCase().includes("hgihet light") ||
        errorMessage.toLowerCase().includes("highlight error") ||
        errorMessage.toLowerCase().includes("high light error")
      ) {
        errorMessage =
          "The model failed due to a highlight (hgihet light) error. Please try a different image or prompt.";
      }
    }
    console.error("[API] Error in /api/image-generator:", error);
    return NextResponse.json({
      status: "failed",
      error: errorMessage,
      statusCode: 500,
    });
  }
}
