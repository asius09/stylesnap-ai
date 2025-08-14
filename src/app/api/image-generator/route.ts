import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@/utils/supabase/server";
import {
  USER_TRIALS_TABLE_NAME,
  DAILY_QUOTA_TABLE_NAME,
  REPLICATE_IMAGE_MODEL,
  ResponseStatus,
  ErrorMessage,
} from "@/constant";
import { buildResponse } from "@/utils/buildResponse";
import { resolveImageUrl } from "@/utils/resolveImageUrl";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // --- Parse and validate request body ---
    const supabase = await createClient();
    const body = await request.json();
    const trialID = body.trialId;
    const prompt = body.prompt;
    const rawImageUrl = body.image_url;

    if (!trialID) {
      return buildResponse(
        ResponseStatus.FAILED,
        400,
        ErrorMessage.MISSING_TRIAL_ID,
      );
    }
    if (!prompt || !rawImageUrl) {
      return buildResponse(
        ResponseStatus.FAILED,
        400,
        ErrorMessage.MISSING_PROMPT_OR_IMAGE_URL,
      );
    }

    // --- Fetch user trial record ---
    const { data: userData, error: userError } = await supabase
      .from(USER_TRIALS_TABLE_NAME)
      .select()
      .eq("id", trialID)
      .single();

    if (userError || !userData) {
      return buildResponse(
        ResponseStatus.NOT_FOUND,
        404,
        ErrorMessage.USER_NOT_FOUND,
      );
    }

    // --- Validate and resolve image_url ---
    let image_url: string;
    try {
      image_url = await resolveImageUrl(rawImageUrl);
    } catch (err) {
      let errorMessage: ErrorMessage | string =
        ErrorMessage.INVALID_IMAGE_URL_FORMAT;
      if (err instanceof Error && err.message) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (
        err &&
        typeof err === "object" &&
        "message" in err
      ) {
        // explicitly type err as { message: string }
        errorMessage = (err as { message: string }).message;
      }
      return buildResponse(ResponseStatus.FAILED, 400, errorMessage as string);
    }

    // --- Determine user type (free/paid) ---
    const isFreeUser = !userData.free_used;
    const isPaidUser = userData.paid_credits > 0;
    const paidCredits = userData.paid_credits;

    // --- Enforce payment if no free trial and no paid credits ---
    if (!isPaidUser && !isFreeUser && userData.paid_credits <= 0) {
      return buildResponse(
        ResponseStatus.NEED_PAYMENT,
        403,
        ErrorMessage.FREE_TRIAL_ENDED,
      );
    }

    // --- Check daily quota for free image generation ---
    const { data: quotaData, error: quotaError } = await supabase
      .from(DAILY_QUOTA_TABLE_NAME)
      .select("*")
      .limit(1)
      .maybeSingle();

    if (quotaError) {
      return buildResponse(
        ResponseStatus.FAILED,
        500,
        ErrorMessage.FAILED_FETCH_DAILY_QUOTA,
      );
    }
    if (!quotaData) {
      return buildResponse(
        ResponseStatus.FAILED,
        500,
        ErrorMessage.DAILY_QUOTA_NOT_FOUND,
      );
    }

    const FREE_COUNT = quotaData.free_count;
    const DAILY_LIMIT = quotaData.daily_limit;

    // Handle the case when the daily free quota is reached for free users (not paid)
    if (!isPaidUser) {
      if (FREE_COUNT >= DAILY_LIMIT && isFreeUser) {
        return buildResponse(
          ResponseStatus.FREE_LIMIT_REACHED,
          403,
          ErrorMessage.FREE_LIMIT_REACHED,
        );
      }
    }

    // --- Prepare Replicate input ---
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

    // --- Call Replicate API ---
    let output;
    try {
      output = await replicate.run(REPLICATE_IMAGE_MODEL, {
        input: replicateInput,
      });
    } catch (replicateError) {
      // Handle Replicate error response (e.g., payment required, etc.)
      let statusCode = 500;
      let errorMsg = ErrorMessage.UNKNOWN_REPLICATE;
      if (replicateError && typeof replicateError === "object") {
        if (
          "status" in replicateError &&
          typeof replicateError.status === "number"
        ) {
          statusCode = replicateError.status;
        }
        if (
          "message" in replicateError &&
          typeof replicateError.message === "string"
        ) {
          // handle thsi
          errorMsg = ErrorMessage.UNKNOWN_REPLICATE;
          if (
            typeof replicateError.message === "string" &&
            Object.values(ErrorMessage).includes(
              replicateError.message as ErrorMessage,
            )
          ) {
            errorMsg = replicateError.message as ErrorMessage;
          }
        }
        // If the error is a payment required error, match our API's convention
        if (
          statusCode === 402 ||
          (typeof errorMsg === "string" &&
            errorMsg.toLowerCase().includes("payment required"))
        ) {
          return buildResponse(ResponseStatus.NEED_PAYMENT, 403, errorMsg);
        }
      }
      return buildResponse(ResponseStatus.FAILED, statusCode, errorMsg);
    }

    // --- Extract image URL from Replicate output ---
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
      imageUrl = output.url();
    }

    // --- Handle known model errors (highlight error) ---
    if (
      !imageUrl ||
      (typeof imageUrl === "string" &&
        (imageUrl.toLowerCase().includes("hgihet light") ||
          imageUrl.toLowerCase().includes("highlight error") ||
          imageUrl.toLowerCase().includes("high light error")))
    ) {
      return buildResponse(
        ResponseStatus.FAILED,
        500,
        ErrorMessage.HIGHLIGHT_MODEL,
      );
    }

    // --- Download the generated image and save to public directory ---
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return buildResponse(
        ResponseStatus.FAILED,
        502,
        ErrorMessage.FAILED_FETCH_IMAGE,
      );
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // --- Generate a unique filename and save the image ---
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const fileName = `output-${uniqueSuffix}.jpg`;
    const publicPath = join(process.cwd(), "public", fileName);
    await writeFile(publicPath, buffer);

    // --- Update user trial info (mark free_used, update last_seen) ---
    if (isFreeUser) {
      await supabase
        .from(USER_TRIALS_TABLE_NAME)
        .update({
          free_used: true,
          last_seen: new Date().toISOString(),
        })
        .eq("id", trialID);

      // --- If free user, increment the free_count in the daily quota table ---
      const { error: updateError } = await supabase
        .from(DAILY_QUOTA_TABLE_NAME)
        .update({ free_count: FREE_COUNT + 1 })
        .eq("id", quotaData.id);

      if (updateError) {
        return buildResponse(
          ResponseStatus.FAILED,
          500,
          ErrorMessage.FAILED_UPDATE_DAILY_QUOTA,
        );
      }
    }

    if (isPaidUser) {
      const { error: paidCreditsError } = await supabase
        .from(USER_TRIALS_TABLE_NAME)
        .update({ paid_credits: paidCredits - 1 })
        .eq("id", trialID);

      if (paidCreditsError) {
        return buildResponse(
          ResponseStatus.FAILED,
          500,
          paidCreditsError.message || "Failed to update paid credits",
        );
      }
    }

    // --- Success response ---
    return buildResponse(
      ResponseStatus.SUCCESSFUL,
      200,
      undefined,
      `/${fileName}`,
    );
  } catch (error) {
    // --- General error handler ---
    let errorMessage = ErrorMessage.UNKNOWN;
    let httpStatus = 500;
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      // Assign error.message only if it matches a known ErrorMessage, otherwise use ErrorMessage.UNKNOWN
      if (Object.values(ErrorMessage).includes(error.message as ErrorMessage)) {
        errorMessage = error.message as ErrorMessage;
      } else {
        errorMessage = ErrorMessage.UNKNOWN;
      }
      if (
        errorMessage.toLowerCase().includes("hgihet light") ||
        errorMessage.toLowerCase().includes("highlight error") ||
        errorMessage.toLowerCase().includes("high light error")
      ) {
        errorMessage = ErrorMessage.HIGHLIGHT_MODEL;
        httpStatus = 500;
      }
      if (errorMessage.toLowerCase().includes("payment required")) {
        httpStatus = 403;
      }
    }
    return buildResponse(
      httpStatus === 403 ? ResponseStatus.NEED_PAYMENT : ResponseStatus.FAILED,
      httpStatus,
      errorMessage,
    );
  }
}
