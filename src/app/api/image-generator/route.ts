import { NextRequest, NextResponse } from "next/server";
import Together from "together-ai";

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt : "";
    const image_url = typeof body.image_url === "string" ? body.image_url : "";

    if (!prompt || !image_url) {
      return NextResponse.json({
        status: "failed",
        error: "Missing prompt or image_url in request body",
        statusCode: 400,
      });
    }

    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-depth",
      width: 1024,
      height: 1024,
      steps: 28,
      prompt,
      // @ts-ignore
      image_url,
      output_format: "png",
      response_format: "url",
      guidance_scale: 8,
      n: 1,
    });

    let output: string | undefined;
    if (Array.isArray(response.data) && response.data.length > 0) {
      const dataItem = response.data[0];
      if ("url" in dataItem && typeof dataItem.url === "string") {
        output = dataItem.url;
      } else if (
        "b64_json" in dataItem &&
        typeof dataItem.b64_json === "string"
      ) {
        output = `data:image/png;base64,${dataItem.b64_json}`;
      }
    }

    if (!output) {
      return NextResponse.json({
        status: "failed",
        error: "No image output from Together API",
        statusCode: 500,
      });
    }

    return NextResponse.json({
      status: "successful",
      imageUrl: output,
      statusCode: 200,
    });
  } catch (error: unknown) {
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
