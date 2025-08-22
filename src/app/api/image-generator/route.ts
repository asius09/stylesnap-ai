/**
 * Image Generation API Route (Replicate only)
 *
 * Status Code Structure:
 * - 201: Created, image generated successfully
 *      - message: "Image generated successfully"
 *      - code: undefined
 * - 400: Bad request (missing/invalid input)
 *      - message: ErrorMessage.MISSING_TRIAL_ID or ErrorMessage.MISSING_PROMPT_OR_IMAGE_URL
 *      - code: "MISSING_TRIAL_ID" or "MISSING_PROMPT_OR_IMAGE_URL"
 * - 403: Payment required for this app's user (free trial ended, free limit reached, paid credits exhausted)
 *      - message: ErrorMessage.FREE_TRIAL_ENDED, ErrorMessage.FREE_LIMIT_REACHED, ErrorMessage.PAID_CREDITS_EXHAUSTED
 *      - code: "NEED_PAYMENT", "FREE_LIMIT_REACHED", "PAID_CREDITS_EXHAUSTED"
 * - 404: User not found
 *      - message: ErrorMessage.USER_NOT_FOUND
 *      - code: "USER_NOT_FOUND"
 * - 451: Payment required for Replicate/external API (not app user)
 *      - message: Replicate payment required error
 *      - code: "REPLICATE_PAYMENT_REQUIRED"
 * - 500: Internal server error (our server only, including Supabase errors)
 *      - message: ErrorMessage.FAILED_FETCH_DAILY_QUOTA, ErrorMessage.DAILY_QUOTA_NOT_FOUND, or fallback
 *      - code: "FAILED_FETCH_DAILY_QUOTA", "DAILY_QUOTA_NOT_FOUND", "IMAGE_GENERATOR_ERROR"
 * - 520: Replicate/external API error (unknown error, not payment/model)
 *      - message: Replicate/external error
 *      - code: "REPLICATE_ERROR"
 * - 522: Replicate/external model error (e.g. highlight/model error)
 *      - message: ErrorMessage.HIGHLIGHT_MODEL
 *      - code: "MODEL_ERROR"
 */

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";
import Replicate from "replicate";
import { createClient } from "@/utils/supabase/server";
import {
  USER_TRIALS_TABLE_NAME,
  DAILY_QUOTA_TABLE_NAME,
  REPLICATE_IMAGE_MODEL,
  ErrorMessage,
} from "@/constant";
import { success, failure } from "@/lib/apiResponse";

// Helpers
function getErrorMessage(err: unknown, fallback: string) {
  if (typeof err === "object" && err !== null && "message" in err) {
    return err.message;
  }
  if (typeof err === "string") return err;
  return fallback;
}
function isHighlightError(msg: unknown) {
  if (typeof msg !== "string") return false;
  const l = msg.toLowerCase();
  return (
    l.includes("hgihet light") ||
    l.includes("highlight error") ||
    l.includes("high light error")
  );
}
function extractImageUrl(output: unknown) {
  // @ts-expect-error: output may be any object with a url property
  return output?.url();
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("Received POST request to /api/image-generator");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Parse and validate request
    const supabase = await createClient();
    const body = await request.json();
    const trialId = body && "trialId" in body ? body.trialId : undefined;
    const prompt = body && "prompt" in body ? body.prompt : undefined;
    const image_url = body && "image_url" in body ? body.image_url : undefined;

    console.log("[API] Received request:", { trialId, prompt, image_url });

    // 400: Missing trialId or prompt/image_url
    if (!trialId) {
      console.log("[API] Missing trialId");
      return failure(ErrorMessage.MISSING_TRIAL_ID, 400, "MISSING_TRIAL_ID");
    }
    if (!prompt || !image_url) {
      console.log("[API] Missing prompt or image_url");
      return failure(
        ErrorMessage.MISSING_PROMPT_OR_IMAGE_URL,
        400,
        "MISSING_PROMPT_OR_IMAGE_URL",
      );
    }
    // Convert the image_url (stored in Supabase) to base64
    // We'll fetch the image as an ArrayBuffer, then convert to base64
    let mimeType = "image/png";
    try {
      // Guess mime type from extension (default to png)
      const urlObj = new URL(image_url);
      const ext = urlObj.pathname.split(".").pop()?.toLowerCase();
      if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
      else if (ext === "webp") mimeType = "image/webp";
      else if (ext === "gif") mimeType = "image/gif";

      // Fetch the image from the URL
      const imageRes = await fetch(image_url);
      if (!imageRes.ok) {
        throw new Error("Failed to fetch image from URL");
      }
      const arrayBuffer = await imageRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      var base64Image = buffer.toString("base64");
      console.log("Loaded image from Supabase URL and converted to base64");
    } catch (err) {
      console.error("Error loading image from Supabase URL:", err);
      return failure(
        "Failed to load image from Supabase URL",
        400,
        "IMAGE_FETCH_ERROR",
      );
    }

    // Prepare the content parts
    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
    ];

    // 404: User not found
    const { data: user, error: userError } = await supabase
      .from(USER_TRIALS_TABLE_NAME)
      .select()
      .eq("id", trialId)
      .single();
    if (userError || !user) {
      console.log("[API] User not found", userError);
      return failure(ErrorMessage.USER_NOT_FOUND, 404, "USER_NOT_FOUND");
    }

    // Supabase: check free/paid user and credits
    const isFreeUser = !user.free_used;
    const isPaidUser = user.paid_credits > 0;

    // 403: App user payment required (free trial ended and no paid credits)
    if (!isFreeUser && !isPaidUser)
      return failure(ErrorMessage.FREE_TRIAL_ENDED, 403, "NEED_PAYMENT");

    // If free user, check monthly limit first, then daily limit
    let freeCount = 0,
      quotaId = "",
      dailyLimit = 0,
      freeCountMonthly = 0,
      monthlyLimit = 0;
    if (isFreeUser && !isPaidUser) {
      const { data: quota, error: quotaError } = await supabase
        .from(DAILY_QUOTA_TABLE_NAME)
        .select("*")
        .limit(1)
        .maybeSingle();
      // 500: Our server error fetching quota
      if (quotaError)
        return failure(
          ErrorMessage.FAILED_FETCH_DAILY_QUOTA,
          500,
          "FAILED_FETCH_DAILY_QUOTA",
        );
      // 500: Our server error, quota not found
      if (!quota)
        return failure(
          ErrorMessage.DAILY_QUOTA_NOT_FOUND,
          500,
          "DAILY_QUOTA_NOT_FOUND",
        );
      freeCount = quota.free_count;
      quotaId = quota.id;
      dailyLimit = quota.daily_limit;
      freeCountMonthly = quota.free_count_month;
      monthlyLimit = quota.monthly_limit;

      // 403: App user free monthly limit reached
      if (freeCountMonthly >= monthlyLimit)
        return failure(
          ErrorMessage.FREE_LIMIT_REACHED,
          403,
          "FREE_MONTHLY_LIMIT_REACHED",
        );

      // 403: App user free daily limit reached
      if (freeCount >= dailyLimit)
        return failure(
          ErrorMessage.FREE_LIMIT_REACHED,
          403,
          "FREE_LIMIT_REACHED",
        );
    }

    // If paid user, check paid credits (must be > 0)
    if (!isFreeUser && isPaidUser) {
      if (typeof user.paid_credits !== "number" || user.paid_credits < 100) {
        // 403: Paid credits exhausted
        return failure(
          ErrorMessage.PAID_CREDITS_EXHAUSTED || "Paid credits exhausted",
          403,
          "PAID_CREDITS_EXHAUSTED",
        );
      }
    }

    // Set responseModalities to include "Image" so the model can generate an image

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    // Defensive checks for undefined
    if (
      !response ||
      !response.candidates ||
      !response.candidates[0] ||
      !response.candidates[0].content ||
      !response.candidates[0].content.parts
    ) {
      console.error("Invalid response structure from Gemini API:", response);
      return NextResponse.json({
        status: "failed",
        error: "Invalid response from Gemini API",
        statusCode: 500,
      });
    }
    // Generate image with Replicate
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    let outputResult;
    try {
      outputResult = await replicate.run(REPLICATE_IMAGE_MODEL, {
        input: {
          prompt,
          input_image: image_url,
          aspect_ratio: "match_input_image",
          output_format: "png",
          safety_tolerance: 2,
          prompt_upsampling: false,
        },
      });
      console.log("[API] Replicate output:", outputResult);
    } catch (err) {
      const msg = getErrorMessage(err, ErrorMessage.UNKNOWN_REPLICATE);
      console.log("[API] Replicate error:", msg);
      if (
        typeof msg === "string" &&
        msg.toLowerCase().includes("payment required")
      ) {
        return failure(msg, 451, "REPLICATE_PAYMENT_REQUIRED");
      }
      return failure(
        typeof msg === "string" ? msg : ErrorMessage.UNKNOWN_REPLICATE,
        520,
        "REPLICATE_ERROR",
      );
    }

    // 522: Replicate/external model error (highlight/model error)
    const generatedImageUrl = extractImageUrl(outputResult);

    // Update user trial/quota/credits (no image upload)
    if (isFreeUser && !isPaidUser) {
      await supabase
        .from(USER_TRIALS_TABLE_NAME)
        .update({ free_used: true, last_seen: new Date().toISOString() })
        .eq("id", trialId);
      await supabase
        .from(DAILY_QUOTA_TABLE_NAME)
        .update({ free_count: freeCount + 1 })
        .eq("id", quotaId);
    } else if (!isFreeUser && isPaidUser) {
      await supabase
        .from(USER_TRIALS_TABLE_NAME)
        .update({ paid_credits: user.paid_credits - 100 })
        .eq("id", trialId);
    }

    // 201: Created (success)
    console.log("[API] Success, imageUrl:", generatedImageUrl);
    return success(
      { imageUrl: generatedImageUrl, output: outputResult },
      201,
      undefined,
      "Image generated successfully",
    );
  } catch (err) {
    const msg = getErrorMessage(err, ErrorMessage.UNKNOWN);
    console.log("[API] Server error:", msg);
    if (typeof msg === "string") {
      if (isHighlightError(msg))
        return failure(ErrorMessage.HIGHLIGHT_MODEL, 522, "MODEL_ERROR");
      if (msg.toLowerCase().includes("payment required"))
        return failure(msg, 403, "NEED_PAYMENT");
      if (
        msg.toLowerCase().includes("replicate") ||
        msg.toLowerCase().includes("external") ||
        msg.toLowerCase().includes("upstream") ||
        msg.toLowerCase().includes("model error")
      ) {
        return failure(msg, 520, "REPLICATE_ERROR");
      }
      return failure(msg, 500, "IMAGE_GENERATOR_ERROR");
    } else {
      return failure(ErrorMessage.UNKNOWN, 500, "IMAGE_GENERATOR_ERROR");
    }
  }
}
