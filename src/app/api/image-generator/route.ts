/**
 * Image Generation API Route
 *
 * This endpoint handles image generation requests using the Replicate API.
 *
 * Main Steps:
 * 1. Parse and validate the request body (trialId, prompt, image_url).
 * 2. Resolve and validate the input image URL.
 * 3. Fetch user trial record and determine user type (free/paid).
 * 4. Enforce free trial, daily quota, or paid credits as appropriate.
 * 5. Call Replicate API to generate the image.
 * 6. Handle Replicate/model errors and payment requirements.
 * 7. Download and save the generated image to the public directory.
 * 8. Update user trial info and quota/credits.
 * 9. Return the image URL or an error response.
 */

import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@/utils/supabase/server";
import {
  USER_TRIALS_TABLE_NAME,
  DAILY_QUOTA_TABLE_NAME,
  REPLICATE_IMAGE_MODEL,
  ErrorMessage,
} from "@/constant";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { success, failure } from "@/lib/apiResponse";

/**
 * Utility: Extract error message from various error types.
 */
function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string") return err;
  if (
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof (err as any).message === "string"
  ) {
    return (err as { message: string }).message;
  }
  return fallback;
}

/**
 * Utility: Check if a string contains any known highlight model error.
 */
function isHighlightModelError(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    lower.includes("hgihet light") ||
    lower.includes("highlight error") ||
    lower.includes("high light error")
  );
}

/**
 * Utility: Extract image URL from Replicate output.
 */
function extractImageUrl(output: any): string | undefined {
  if (
    Array.isArray(output) &&
    output.length > 0 &&
    typeof output[0] === "string"
  ) {
    return output[0];
  }
  if (typeof output === "string") {
    return output;
  }
  if (
    output &&
    typeof output === "object" &&
    "url" in output &&
    typeof (output as any).url === "function"
  ) {
    return (output as any).url();
  }
  return undefined;
}

/**
 * Utility: Handle Replicate API errors and return appropriate failure response.
 */
function handleReplicateError(replicateError: any) {
  let statusCode = 500;
  let errorMsg = ErrorMessage.UNKNOWN_REPLICATE;
  if (replicateError && typeof replicateError === "object") {
    if (
      "status" in replicateError &&
      typeof (replicateError as any).status === "number"
    ) {
      statusCode = (replicateError as any).status;
    }
    if (
      "message" in replicateError &&
      typeof (replicateError as any).message === "string"
    ) {
      const msg = (replicateError as any).message as string;
      if (Object.values(ErrorMessage).includes(msg as ErrorMessage)) {
        errorMsg = msg as ErrorMessage;
      }
    }
    if (
      statusCode === 402 ||
      (typeof errorMsg === "string" &&
        errorMsg.toLowerCase().includes("payment required"))
    ) {
      return failure(errorMsg, 403, "NEED_PAYMENT");
    }
  }
  return failure(errorMsg, statusCode, "REPLICATE_ERROR");
}

/**
 * Utility: General error handler for the catch block.
 */
function handleGeneralError(error: any) {
  let errorMessage = ErrorMessage.UNKNOWN;
  let httpStatus = 500;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as any).message === "string"
  ) {
    if (
      Object.values(ErrorMessage).includes(
        (error as any).message as ErrorMessage,
      )
    ) {
      errorMessage = (error as any).message as ErrorMessage;
    }
    if (isHighlightModelError(errorMessage)) {
      errorMessage = ErrorMessage.HIGHLIGHT_MODEL;
      httpStatus = 500;
    }
    if (errorMessage.toLowerCase().includes("payment required")) {
      httpStatus = 403;
    }
  }
  return failure(
    errorMessage,
    httpStatus,
    httpStatus === 403 ? "NEED_PAYMENT" : "IMAGE_GENERATOR_ERROR",
  );
}

/**
 * Utility: Save buffer to a unique file in the public directory.
 */
async function saveImageToPublic(
  buffer: Buffer,
): Promise<{ fileName: string; publicPath: string }> {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  const fileName = `output-${uniqueSuffix}.jpg`;
  const publicPath = join(process.cwd(), "public", fileName);
  await writeFile(publicPath, buffer);
  return { fileName, publicPath };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parse and validate request body
    const supabase = await createClient();
    const body = await request.json();
    const trialID = body.trialId;
    const prompt = body.prompt;
    const rawImageUrl = body.image_url;

    if (!trialID) {
      return failure(ErrorMessage.MISSING_TRIAL_ID, 400, "MISSING_TRIAL_ID");
    }
    if (!prompt || !rawImageUrl) {
      return failure(
        ErrorMessage.MISSING_PROMPT_OR_IMAGE_URL,
        400,
        "MISSING_PROMPT_OR_IMAGE_URL",
      );
    }

    // 2. Validate and resolve image_url
    let image_url: string;
    try {
      image_url = await resolveImageUrl(rawImageUrl);
    } catch (err) {
      return failure(
        extractErrorMessage(err, ErrorMessage.INVALID_IMAGE_URL_FORMAT),
        400,
        "INVALID_IMAGE_URL",
      );
    }

    // 3. Fetch user trial record
    const { data: userData, error: userError } = await supabase
      .from(USER_TRIALS_TABLE_NAME)
      .select()
      .eq("id", trialID)
      .single();

    if (userError || !userData) {
      return failure(ErrorMessage.USER_NOT_FOUND, 404, "USER_NOT_FOUND");
    }

    // 4. Determine user type and enforce payment/quota
    const isFreeUser = !userData.free_used;
    const isPaidUser = userData.paid_credits > 0;
    const PAID_CREDITS = userData.paid_credits;

    // If user has neither free trial nor paid credits, require payment
    if (!isPaidUser && !isFreeUser) {
      return failure(ErrorMessage.FREE_TRIAL_ENDED, 403, "NEED_PAYMENT");
    }

    // If user is on free trial, check daily quota
    let FREE_COUNT: number | undefined,
      QUOTA_ID: string | undefined,
      DAILY_LIMIT: number | undefined;
    if (isFreeUser && !isPaidUser) {
      const { data: quotaData, error: quotaError } = await supabase
        .from(DAILY_QUOTA_TABLE_NAME)
        .select("*")
        .limit(1)
        .maybeSingle();

      if (quotaError) {
        return failure(
          ErrorMessage.FAILED_FETCH_DAILY_QUOTA,
          500,
          "FAILED_FETCH_DAILY_QUOTA",
        );
      }
      if (!quotaData) {
        return failure(
          ErrorMessage.DAILY_QUOTA_NOT_FOUND,
          500,
          "DAILY_QUOTA_NOT_FOUND",
        );
      }
      FREE_COUNT = quotaData.free_count;
      QUOTA_ID = quotaData.id;
      DAILY_LIMIT = quotaData.daily_limit;

      // If daily free quota is reached, block further free generations
      if ((FREE_COUNT ?? 0) >= (DAILY_LIMIT ?? 0)) {
        return failure(
          ErrorMessage.FREE_LIMIT_REACHED,
          403,
          "FREE_LIMIT_REACHED",
        );
      }
    }

    // 5. Prepare Replicate input
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const replicateInput = {
      prompt,
      input_image: image_url,
      aspect_ratio: "match_input_image",
      output_format: "jpg",
      safety_tolerance: 2,
      prompt_upsampling: false,
    };

    // 6. Call Replicate API and handle errors
    let output;
    try {
      output = await replicate.run(REPLICATE_IMAGE_MODEL, {
        input: replicateInput,
      });
    } catch (replicateError) {
      return handleReplicateError(replicateError);
    }

    // 7. Extract image URL from Replicate output
    const imageUrl = extractImageUrl(output);

    // 8. Handle known model errors (e.g., highlight error)
    if (!imageUrl || isHighlightModelError(imageUrl)) {
      return failure(ErrorMessage.HIGHLIGHT_MODEL, 500, "MODEL_ERROR");
    }

    // 9. Download and save the generated image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return failure(
        ErrorMessage.FAILED_FETCH_IMAGE,
        502,
        "UPSTREAM_IMAGE_FETCH_FAILED",
      );
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { fileName } = await saveImageToPublic(buffer);

    // 10. Update user trial info and quota/credits
    // Helper for updating free trial and quota
    async function updateFreeTrialAndQuota() {
      await supabase
        .from(USER_TRIALS_TABLE_NAME)
        .update({
          free_used: true,
          last_seen: new Date().toISOString(),
        })
        .eq("id", trialID);

      const { error: updateError } = await supabase
        .from(DAILY_QUOTA_TABLE_NAME)
        .update({ free_count: (FREE_COUNT ?? 0) + 1 })
        .eq("id", QUOTA_ID);

      if (updateError) {
        return failure(
          ErrorMessage.FAILED_UPDATE_DAILY_QUOTA,
          500,
          "FAILED_UPDATE_DAILY_QUOTA",
        );
      }
      return null;
    }

    // Helper for updating paid credits
    async function updatePaidCredits() {
      const { error: paidCreditsError } = await supabase
        .from(USER_TRIALS_TABLE_NAME)
        .update({ paid_credits: PAID_CREDITS - 100 })
        .eq("id", trialID);

      if (paidCreditsError) {
        return failure(
          paidCreditsError.message || "Failed to update paid credits",
          500,
          "FAILED_UPDATE_PAID_CREDITS",
        );
      }
      return null;
    }

    if (isFreeUser && isPaidUser) {
      const err = await updateFreeTrialAndQuota();
      if (err) return err;
    } else if (!isFreeUser && isPaidUser) {
      const err = await updatePaidCredits();
      if (err) return err;
    }

    // 11. Success response
    return success(
      { imageUrl: `/${fileName}` },
      200,
      undefined,
      "Image generated successfully",
    );
  } catch (error) {
    return handleGeneralError(error);
  }
}
