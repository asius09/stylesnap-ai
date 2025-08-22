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
  GEMINI_IMAGE_MODEL,
  ErrorMessage,
} from "@/constant";
import { success, failure } from "@/lib/apiResponse";

// Helpers
function getErrorMessage(err: unknown, fallback: string) {
  if (typeof err === "object" && err !== null && "message" in err) {
    // @ts-ignore
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
  return output?.url?.();
}

async function convertUrlToBase64(url: string) {
  if (!url) {
    console.log("[convertUrlToBase64] No URL provided");
    throw new Error("No URL provided to convertUrlToBase64");
  }

  let mimeType = "image/png";
  try {
    // Guess mime type from extension (default to png)
    const urlObj = new URL(url);
    const ext = urlObj.pathname.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
    else if (ext === "webp") mimeType = "image/webp";
    else if (ext === "gif") mimeType = "image/gif";

    // Fetch the image from the URL
    console.log("[convertUrlToBase64] Fetching image from URL:", url);
    const imageRes = await fetch(url);
    if (!imageRes.ok) {
      console.log("[convertUrlToBase64] Failed to fetch image from URL:", url);
      throw new Error("Failed to fetch image from URL");
    }
    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    console.log("[convertUrlToBase64] Successfully converted image to base64");
    return { base64Image, mimeType };
  } catch (err) {
    console.error("Error loading image from Supabase URL:", err);
    throw new Error("Failed to load image from Supabase URL");
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("Received POST request to /api/image-generator");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Parse and validate request
    const supabase = await createClient();
    const body = await request.json();
    console.log("[POST] Raw request body:", body);
    const trialId = body && "trialId" in body ? body.trialId : undefined;
    const prompt = body && "prompt" in body ? body.prompt : undefined;
    const image_url = body && "image_url" in body ? body.image_url : undefined;

    console.log("[API] Received request body:", body);
    console.log("[API] Extracted params:", { trialId, prompt, image_url });

    // 400: Missing trialId or prompt/image_url
    if (!trialId) {
      console.log("[API] Missing trialId");
      return failure(ErrorMessage.MISSING_TRIAL_ID, 400, "MISSING_TRIAL_ID");
    }
    if (!prompt || !image_url) {
      console.log("[API] Missing prompt or image_url", { prompt, image_url });
      return failure(
        ErrorMessage.MISSING_PROMPT_OR_IMAGE_URL,
        400,
        "MISSING_PROMPT_OR_IMAGE_URL",
      );
    }
    // Convert the image_url (stored in Supabase) to base64, handle error
    let base64Image, mimeType;
    try {
      console.log("[API] Converting image_url to base64:", image_url);
      ({ base64Image: base64Image, mimeType: mimeType } =
        await convertUrlToBase64(image_url));
      console.log(
        "[API] Successfully converted image_url to base64. MimeType:",
        mimeType,
      );
    } catch (err) {
      console.error("[API] Failed to convert image_url to base64:", err);
      return failure(
        ErrorMessage.FAILED_FETCH_IMAGE,
        500,
        "FAILED_TO_LOAD_IMAGE",
      );
    }

    // Prepare the content parts for Gemini (Google AI) image style transfer
    // Prompt is crafted to instruct Gemini to only change the style, not the content or structure.
    // Reference: https://ai.google.dev/gemini-api/docs/prompting
    const contents = [
      {
        text: `You are an expert image style transfer AI. Given the reference image and the style description, generate a new image that preserves the content, structure, and composition of the original image, but transforms its style according to the following description: "${prompt}". Do not alter the subject, layout, or details except for the stylistic changes. Output only the styled image.`,
      },
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
    ];
    console.log("[API] Prepared contents for Gemini:", contents);

    // 404: User not found
    console.log("[API] Querying user from Supabase:", trialId);
    const { data: user, error: userError } = await supabase
      .from(USER_TRIALS_TABLE_NAME)
      .select()
      .eq("id", trialId)
      .single();
    if (userError || !user) {
      console.log("[API] User not found", userError);
      return failure(ErrorMessage.USER_NOT_FOUND, 404, "USER_NOT_FOUND");
    }
    console.log("[API] User found:", user);

    // Supabase: check free/paid user and credits
    const isFreeUser = !user.free_used;
    const isPaidUser = user.paid_credits > 0;
    console.log("[API] User type:", {
      isFreeUser,
      isPaidUser,
      paid_credits: user.paid_credits,
    });

    // 403: App user payment required (free trial ended and no paid credits)
    if (!isFreeUser && !isPaidUser) {
      console.log("[API] Free trial ended and no paid credits");
      return failure(ErrorMessage.FREE_TRIAL_ENDED, 403, "NEED_PAYMENT");
    }

    // If free user, check monthly limit first, then daily limit
    let freeCount = 0,
      quotaId = "",
      dailyLimit = 0,
      freeCountMonthly = 0,
      monthlyLimit = 0;
    if (isFreeUser && !isPaidUser) {
      console.log("[API] Checking daily/monthly quota for free user");
      const { data: quota, error: quotaError } = await supabase
        .from(DAILY_QUOTA_TABLE_NAME)
        .select("*")
        .limit(1)
        .maybeSingle();
      if (quotaError) {
        console.error("[API] Error fetching daily quota:", quotaError);
        return failure(
          ErrorMessage.FAILED_FETCH_DAILY_QUOTA,
          500,
          "FAILED_FETCH_DAILY_QUOTA",
        );
      }
      if (!quota) {
        console.error("[API] Daily quota not found");
        return failure(
          ErrorMessage.DAILY_QUOTA_NOT_FOUND,
          500,
          "DAILY_QUOTA_NOT_FOUND",
        );
      }
      freeCount = quota.free_count;
      quotaId = quota.id;
      dailyLimit = quota.daily_limit;
      freeCountMonthly = quota.free_count_month;
      monthlyLimit = quota.monthly_limit;

      console.log("[API] Quota info:", {
        freeCount,
        quotaId,
        dailyLimit,
        freeCountMonthly,
        monthlyLimit,
      });

      if (freeCountMonthly >= monthlyLimit) {
        console.log("[API] Free monthly limit reached");
        return failure(
          ErrorMessage.FREE_LIMIT_REACHED,
          403,
          "FREE_MONTHLY_LIMIT_REACHED",
        );
      }

      if (freeCount >= dailyLimit) {
        console.log("[API] Free daily limit reached");
        return failure(
          ErrorMessage.FREE_LIMIT_REACHED,
          403,
          "FREE_LIMIT_REACHED",
        );
      }
    }

    // If paid user, check paid credits (must be > 0)
    if (!isFreeUser && isPaidUser) {
      console.log(
        "[API] Checking paid credits for paid user:",
        user.paid_credits,
      );
      if (typeof user.paid_credits !== "number" || user.paid_credits < 100) {
        console.log(
          "[API] Paid credits exhausted or invalid:",
          user.paid_credits,
        );
        return failure(
          ErrorMessage.PAID_CREDITS_EXHAUSTED || "Paid credits exhausted",
          403,
          "PAID_CREDITS_EXHAUSTED",
        );
      }
    }

    // Handle paid user image generation with Replicate
    if (isPaidUser && !isFreeUser) {
      let outputResult;
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      });

      try {
        console.log(
          "[API] Calling Replicate with model:",
          REPLICATE_IMAGE_MODEL,
        );
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
        console.log("[API] Replicate outputResult:", outputResult);
      } catch (err) {
        const msg = getErrorMessage(err, ErrorMessage.UNKNOWN_REPLICATE);
        console.error("[API] Replicate error:", msg, err);
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

      // Deduct paid credits after successful generation
      try {
        console.log("[API] Deducting 100 paid credits from user:", trialId);
        await supabase
          .from(USER_TRIALS_TABLE_NAME)
          .update({ paid_credits: user.paid_credits - 100 })
          .eq("id", trialId);
        console.log("[API] Deducted 100 paid credits from user:", trialId);
      } catch (err) {
        console.error("[API] Failed to deduct paid credits:", err);
      }

      // Extract generated image URL and return success
      const generatedImageUrl = extractImageUrl(outputResult);
      console.log("[API] Returning Replicate imageUrl:", generatedImageUrl);
      return success(
        { imageUrl: generatedImageUrl, output: outputResult },
        201,
        undefined,
        "Image generated successfully",
      );
    }

    // Handle Gemini image generation for free users
    let outputResult, generatedImageUrl;
    try {
      console.log("[API] Calling Gemini API for image generation...");
      // Set content image as reference and match the style
      const response = await ai.models.generateContent({
        model: GEMINI_IMAGE_MODEL,
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
        return failure(
          "Invalid response from Gemini API",
          500,
          "GEMINI_API_ERROR",
        );
      }

      // Find the image part in the response
      const parts = response.candidates[0].content.parts;
      console.log("[API] Gemini API response parts:", parts);
      const imagePart = parts.find(
        (part: any) =>
          part &&
          part.inlineData &&
          part.inlineData.mimeType &&
          part.inlineData.mimeType.startsWith("image/"),
      );

      if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
        console.error("No image found in Gemini API response:", response);
        return failure(
          "No image found in Gemini API response",
          500,
          "GEMINI_NO_IMAGE",
        );
      }

      // Convert base64 image to a data URL
      const mimeType = imagePart.inlineData.mimeType;
      const base64Data = imagePart.inlineData.data;
      generatedImageUrl = `data:${mimeType};base64,${base64Data}`;
      outputResult = response;
      console.log(
        "[API] Gemini image generated. Data URL length:",
        generatedImageUrl.length,
      );
    } catch (err) {
      console.error("Error during Gemini API image generation:", err);
      return failure(
        "Error during Gemini API image generation",
        500,
        "GEMINI_API_ERROR",
      );
    }

    // Update user trial/quota/credits (no image upload)
    if (isFreeUser && !isPaidUser) {
      try {
        console.log(
          "[API] Updating free_used and daily quota for user:",
          trialId,
          "quotaId:",
          quotaId,
        );
        await supabase
          .from(USER_TRIALS_TABLE_NAME)
          .update({ free_used: true, last_seen: new Date().toISOString() })
          .eq("id", trialId);
        await supabase
          .from(DAILY_QUOTA_TABLE_NAME)
          .update({ free_count: freeCount + 1 })
          .eq("id", quotaId);
        console.log(
          "[API] Updated free_used and daily quota for user:",
          trialId,
          "quotaId:",
          quotaId,
        );
      } catch (err) {
        console.error("[API] Failed to update user trial/quota:", err);
      }
    }

    console.log(
      "[API] Returning Gemini imageUrl (data URL, length):",
      generatedImageUrl.length,
    );
    return success(
      { imageUrl: generatedImageUrl, output: outputResult },
      201,
      undefined,
      "Image generated successfully",
    );
  } catch (err) {
    const msg = getErrorMessage(err, ErrorMessage.UNKNOWN);
    console.log("[API] Server error:", msg, err);
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
