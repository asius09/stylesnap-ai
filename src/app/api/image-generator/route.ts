/**
 * Simple Image Generation API Route (Replicate only)
 *
 * Handles image generation using Replicate and manages free/paid user logic.
 * Does NOT upload or use Supabase Storage for images.
 */

import { NextRequest, NextResponse } from "next/server";
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
function isHighlightError(msg: string) {
  const l = msg.toLowerCase();
  return (
    l.includes("hgihet light") ||
    l.includes("highlight error") ||
    l.includes("high light error")
  );
}
function extractImageUrl(output: unknown): string | undefined {
  // According to Replicate docs, output.url() should be used
  // But output may not always have url() method, so check for it
  if (
    output &&
    typeof output === "object" &&
    "url" in output &&
    typeof (output as { url: () => string }).url === "function"
  ) {
    return (output as { url: () => string }).url();
  }
  return undefined;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request
    const supabase = await createClient();
    const { trialId, prompt, image_url } = await request.json();

    if (!trialId)
      return failure(ErrorMessage.MISSING_TRIAL_ID, 400, "MISSING_TRIAL_ID");
    if (!prompt || !image_url)
      return failure(
        ErrorMessage.MISSING_PROMPT_OR_IMAGE_URL,
        400,
        "MISSING_PROMPT_OR_IMAGE_URL",
      );

    // Fetch user trial record
    const { data: user, error: userError } = await supabase
      .from(USER_TRIALS_TABLE_NAME)
      .select()
      .eq("id", trialId)
      .single();
    if (userError || !user)
      return failure(ErrorMessage.USER_NOT_FOUND, 404, "USER_NOT_FOUND");

    const isFreeUser = !user.free_used;
    const isPaidUser = user.paid_credits > 0;

    if (!isFreeUser && !isPaidUser)
      return failure(ErrorMessage.FREE_TRIAL_ENDED, 403, "NEED_PAYMENT");

    // If free user, check daily quota
    let freeCount = 0,
      quotaId = "",
      dailyLimit = 0;
    if (isFreeUser && !isPaidUser) {
      const { data: quota, error: quotaError } = await supabase
        .from(DAILY_QUOTA_TABLE_NAME)
        .select("*")
        .limit(1)
        .maybeSingle();
      if (quotaError)
        return failure(
          ErrorMessage.FAILED_FETCH_DAILY_QUOTA,
          500,
          "FAILED_FETCH_DAILY_QUOTA",
        );
      if (!quota)
        return failure(
          ErrorMessage.DAILY_QUOTA_NOT_FOUND,
          500,
          "DAILY_QUOTA_NOT_FOUND",
        );
      freeCount = quota.free_count;
      quotaId = quota.id;
      dailyLimit = quota.daily_limit;
      if (freeCount >= dailyLimit)
        return failure(
          ErrorMessage.FREE_LIMIT_REACHED,
          403,
          "FREE_LIMIT_REACHED",
        );
    }

    // Generate image with Replicate
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    let output;
    try {
      output = await replicate.run(REPLICATE_IMAGE_MODEL, {
        input: {
          prompt,
          input_image: image_url,
          aspect_ratio: "match_input_image",
          output_format: "png",
          safety_tolerance: 2,
          prompt_upsampling: false,
        },
      });
    } catch (err) {
      // Payment required or replicate error
      const msg = getErrorMessage(err, ErrorMessage.UNKNOWN_REPLICATE) as string;
      if (typeof msg === "string" && msg.toLowerCase().includes("payment required"))
        return failure(msg, 403, "NEED_PAYMENT");
      return failure(typeof msg === "string" ? msg : ErrorMessage.UNKNOWN_REPLICATE, 500, "REPLICATE_ERROR");
    }

    // Get generated image URL
    const generatedImageUrl = extractImageUrl(output);
    if (!generatedImageUrl || isHighlightError(generatedImageUrl))
      return failure(ErrorMessage.HIGHLIGHT_MODEL, 500, "MODEL_ERROR");

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

    // Success: return Replicate image URL only
    return success(
      { imageUrl: generatedImageUrl },
      200,
      undefined,
      "Image generated successfully",
    );
  } catch (err) {
    // Improved error handling for unknown errors
    const msg = getErrorMessage(err, ErrorMessage.UNKNOWN);
    if (typeof msg === "string") {
      if (isHighlightError(msg))
        return failure(ErrorMessage.HIGHLIGHT_MODEL, 500, "MODEL_ERROR");
      if (msg.toLowerCase().includes("payment required"))
        return failure(msg, 403, "NEED_PAYMENT");
      return failure(msg, 500, "IMAGE_GENERATOR_ERROR");
    } else {
      return failure(ErrorMessage.UNKNOWN, 500, "IMAGE_GENERATOR_ERROR");
    }
  }
}
