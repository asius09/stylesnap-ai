import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import RunwayML, { TaskFailedError } from "@runwayml/sdk";
import * as mime from "mime-types";

// Helper to get image as data URI
function getImageAsDataUri(imagePath: string): string {
  console.log(`[getImageAsDataUri] Reading image from: ${imagePath}`);
  const imageBuffer = fs.readFileSync(imagePath);
  const base64String = imageBuffer.toString("base64");
  const contentType = mime.lookup(imagePath) || "application/octet-stream";
  console.log(`[getImageAsDataUri] Detected content type: ${contentType}`);
  return `data:${contentType};base64,${base64String}`;
}

const client = new RunwayML({ apiKey: process.env.RUNWAY_API_KEY });

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("Received POST request to /api/image-generator");

    const body = await request.json();
    console.log("Request body:", body);

    const prompt = body.prompt;
    let imagePath = body.image_url;
    let styleImagePath = body.style_image_url; // Optionally allow a style image

    if (!prompt || !imagePath) {
      console.error("Missing prompt or imagePath in request body");
      return NextResponse.json({
        status: "failed",
        error: "Missing prompt or imagePath in request body",
        statusCode: 400,
      });
    }

    // If imagePath is a public path (starts with "/"), resolve to absolute path in Next.js public folder
    if (imagePath.startsWith("/")) {
      const projectRoot = path.resolve(process.cwd());
      imagePath = path.join(projectRoot, "public", imagePath);
      console.log(`[POST] Resolved imagePath to: ${imagePath}`);
    }

    // If styleImagePath is provided and is a public path, resolve it
    if (styleImagePath && styleImagePath.startsWith("/")) {
      const projectRoot = path.resolve(process.cwd());
      styleImagePath = path.join(projectRoot, "public", styleImagePath);
      console.log(`[POST] Resolved styleImagePath to: ${styleImagePath}`);
    }

    // Check if file exists and is readable
    try {
      await fs.promises.access(imagePath, fs.constants.R_OK);
      console.log(`[POST] imagePath is accessible: ${imagePath}`);
    } catch (err) {
      console.error("Error reading image file:", err);
      return NextResponse.json({
        status: "failed",
        error: `Could not read image file at provided path: ${imagePath}`,
        statusCode: 400,
      });
    }

    // If style image is provided, check it exists
    if (styleImagePath) {
      try {
        await fs.promises.access(styleImagePath, fs.constants.R_OK);
        console.log(`[POST] styleImagePath is accessible: ${styleImagePath}`);
      } catch (err) {
        console.error("Error reading style image file:", err);
        return NextResponse.json({
          status: "failed",
          error: `Could not read style image file at provided path: ${styleImagePath}`,
          statusCode: 400,
        });
      }
    }

    // Prepare referenceImages array
    const referenceImages: { uri: string; tag?: string }[] = [
      {
        uri: getImageAsDataUri(imagePath),
        tag: "subject",
      },
    ];
    console.log("[POST] referenceImages after subject:", referenceImages);
    if (styleImagePath) {
      referenceImages.push({
        uri: getImageAsDataUri(styleImagePath),
        tag: "style",
      });
      // console.log("[POST] referenceImages after style:", referenceImages);
    }

    // Use the prompt and tags in promptText
    // If style image is provided, use "@subject in the style of @style"
    // Otherwise, just use "@subject" and the prompt
    let promptText = "";
    if (styleImagePath) {
      promptText = `@subject in the style of @style. ${prompt}`;
    } else {
      promptText = `@subject. ${prompt}`;
    }
    console.log(`[POST] promptText: ${promptText}`);

    let task;
    try {
      console.log("[POST] Calling RunwayML textToImage.create...");
      task = await client.textToImage
        .create({
          model: "gen4_image_turbo",
          promptText,
          ratio: "1920:1080",
          referenceImages,
        })
        .waitForTaskOutput();

      console.log("Task complete:", task);

      // Save the generated image to the public folder with a unique name
      if (task && Array.isArray(task.output) && task.output.length > 0) {
        const imageUrl = task.output[0];
        console.log(`[POST] Generated image URL from RunwayML: ${imageUrl}`);
        // Download the image and save it to public folder
        const res = await fetch(imageUrl);
        if (!res.ok) {
          console.error("[POST] Failed to fetch generated image from RunwayML");
          throw new Error("Failed to fetch generated image from RunwayML");
        }
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const timestamp = Date.now();
        // Try to get extension from content-type header
        let ext = ".png";
        const contentType = res.headers.get("content-type");
        if (contentType) {
          if (contentType.includes("jpeg")) ext = ".jpg";
          else if (contentType.includes("webp")) ext = ".webp";
          else if (contentType.includes("gif")) ext = ".gif";
        }
        const savedImageFilename = `runwayml-image-${timestamp}${ext}`;
        const outPath = path.join(process.cwd(), "public", savedImageFilename);
        await fs.promises.writeFile(outPath, buffer);
        console.log(`Image saved as ${savedImageFilename} at ${outPath}`);

        return NextResponse.json({
          status: "successful",
          imageUrl: `/${savedImageFilename}`,
          statusCode: 200,
        });
      } else {
        console.error("No output image from RunwayML task.");
        return NextResponse.json({
          status: "failed",
          error: "No image was generated by RunwayML.",
          statusCode: 500,
        });
      }
    } catch (error) {
      if (error instanceof TaskFailedError) {
        console.error("The image failed to generate.");
        console.error(error.taskDetails);
        return NextResponse.json({
          status: "failed",
          error: "The image failed to generate.",
          statusCode: 500,
        });
      } else {
        console.error("[POST] Error in RunwayML image generation:", error);
        return NextResponse.json({
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
          statusCode: 500,
        });
      }
    }
  } catch (error: unknown) {
    console.error("Error in /api/image-generator POST:", error);
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
