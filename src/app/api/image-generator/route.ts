import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const prompt = body.prompt;
    const data = (await readFile(body.image_url)).toString("base64");
    const image_url = `data:application/octet-stream;base64,${data}`;
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

    const output = await replicate.run("black-forest-labs/flux-kontext-pro", {
      input,
    });

    // To access the file URL:
    console.log(output.url());
    //=> "https://replicate.delivery/.../output.jpg"

    const publicPath = join(process.cwd(), "public", "output.jpg");
    await writeFile(publicPath, output);

    console.log("[API] Replicate output:", output);

    if (!output) {
      console.error("[API] No image output from Together API");
      return NextResponse.json({
        status: "failed",
        error: "No image output from Together API",
        statusCode: 500,
      });
    }

    return NextResponse.json({
      status: "successful",
      imageUrl: "/output.jpg",
      statusCode: 200,
    });
  } catch (error: unknown) {
    console.error("[API] Error in /api/image-generator:", error);
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
