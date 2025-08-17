import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { UserTrial } from "@/types/model.types";
import { USER_TRIALS_TABLE_NAME } from "@/constant";
import { success, failure } from "@/lib/apiResponse";

/**
 * POST /api/trial
 * Creates a new trial row in the user_trials table if it does not already exist.
 * Expects a trialId in the request body. Does NOT generate a trialId if missing.
 * Sets a cookie with the trialId on success.
 * Returns status and trialId.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent");
    const { trialId } = await req.json();

    if (!trialId || typeof trialId !== "string" || trialId.trim() === "") {
      return failure(
        "Missing or invalid trialId in request body",
        400,
        "INVALID_TRIAL_ID",
      );
    }

    // Check if trial already exists
    const { data: existingTrial, error: selectError } = await supabase
      .from(USER_TRIALS_TABLE_NAME)
      .select("*")
      .eq("id", trialId)
      .single();

    if (existingTrial) {
      const res = success(
        { trialId, status: "already_exists" },
        200,
        undefined,
        "Trial already exists",
      );
      res.headers.set(
        "Set-Cookie",
        `trialId=${trialId}; Path=/; HttpOnly; Max-Age=31536000`,
      );
      return res;
    }
    if (selectError && selectError.code !== "PGRST116") {
      return failure(
        selectError.message || "Database error",
        500,
        selectError.code,
      );
    }

    // Insert new trial
    const { error } = await supabase.from(USER_TRIALS_TABLE_NAME).insert({
      id: trialId,
      ip: ip.toString(),
      last_ip: ip.toString(),
      user_metadata: { ua: userAgent },
      free_used: false,
      paid_credits: 0,
    });
    if (error) {
      return failure(
        error.message || "Failed to create trial",
        500,
        error.code,
      );
    }

    const res = success(
      { trialId, status: "successful" },
      200,
      undefined,
      "Trial created successfully",
    );
    res.headers.set(
      "Set-Cookie",
      `trialId=${trialId}; Path=/; HttpOnly; Max-Age=31536000`,
    );
    return res;
  } catch (err: any) {
    const message =
      typeof err === "string"
        ? err
        : err instanceof Error
          ? err.message
          : err &&
              typeof err === "object" &&
              "message" in err &&
              typeof err.message === "string"
            ? err.message
            : "Internal Server Error";
    console.error("[TRIAL-POST] Error:", err);
    return failure(
      message,
      500,
      "INTERNAL_ERROR",
      undefined,
      undefined,
      err?.stack,
    );
  }
}

/**
 * GET /api/trial?trialId=...
 * Retrieves the user_trial row for the given trialId.
 * Returns the userTrial object if found, or an error/status if not.
 * Also sets a cookie with the trialId if found.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const trialId = searchParams.get("trialId");

    if (!trialId || (typeof trialId === "string" && trialId.trim() === "")) {
      return failure("Missing or invalid trialId", 400, "INVALID_TRIAL_ID");
    }

    const { data, error } = await supabase
      .from(USER_TRIALS_TABLE_NAME)
      .select("*")
      .eq("id", trialId)
      .single();

    if (error && error.code !== "PGRST116") {
      return failure(error.message || "Database error", 500, error.code);
    }

    if (data) {
      const res = success(
        { userTrial: data as UserTrial, status: "successful" },
        200,
        undefined,
        "Trial found",
      );
      res.headers.set(
        "Set-Cookie",
        `trialId=${trialId}; Path=/; HttpOnly; Max-Age=31536000`,
      );
      return res;
    }
    return failure("Trial not found", 404, "TRIAL_NOT_FOUND");
  } catch (err: any) {
    const message =
      typeof err === "string"
        ? err
        : err instanceof Error
          ? err.message
          : "Internal Server Error";
    console.error("[TRIAL-GET] Error:", err);
    return failure(
      message,
      500,
      "INTERNAL_ERROR",
      undefined,
      undefined,
      err?.stack,
    );
  }
}

/**
 * DELETE /api/trial
 * Deletes a trial row from the user_trials table by trialId (provided in request body).
 * Returns status and deleted trialId.
 */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { trialId } = await req.json();

    if (!trialId || (typeof trialId === "string" && trialId.trim() === "")) {
      return failure("Missing or invalid trialId", 400, "INVALID_TRIAL_ID");
    }

    const { error } = await supabase
      .from(USER_TRIALS_TABLE_NAME)
      .delete()
      .eq("id", trialId);

    if (error) {
      return failure(
        error.message || "Failed to delete trial",
        500,
        error.code,
      );
    }

    return success(
      { trialId, status: "successful", message: "Trial deleted" },
      200,
      undefined,
      "Trial deleted successfully",
    );
  } catch (err: any) {
    const message =
      typeof err === "string"
        ? err
        : err instanceof Error
          ? err.message
          : err &&
              typeof err === "object" &&
              "message" in err &&
              typeof err.message === "string"
            ? err.message
            : "Internal Server Error";
    console.error("[TRIAL-DELETE] Error:", err);
    return failure(
      message,
      500,
      "INTERNAL_ERROR",
      undefined,
      undefined,
      err?.stack,
    );
  }
}

/**
 * PATCH /api/trial?id=...
 * Updates a trial row by id with provided body fields.
 * If "paid_credits" is in the body, it will be added to the current paid_credits value.
 */
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const trialId = searchParams.get("id");

    if (!trialId || Object.keys(body).length === 0) {
      return failure("Invalid Data or TrialId", 400, "INVALID_PATCH_DATA");
    }

    let updateFields = { ...body };

    // If paid_credits is present, add to the current value
    if (typeof body.paid_credits === "number") {
      // Fetch current paid_credits
      const { data: currentTrial, error: fetchError } = await supabase
        .from(USER_TRIALS_TABLE_NAME)
        .select("paid_credits")
        .eq("id", trialId)
        .maybeSingle();

      if (fetchError) {
        return failure(
          fetchError.message || "Failed to fetch trial",
          500,
          fetchError.code,
        );
      }

      if (!currentTrial) {
        return failure("Trial not found", 404, "TRIAL_NOT_FOUND");
      }

      const currentPaidCredits =
        typeof currentTrial.paid_credits === "number"
          ? currentTrial.paid_credits
          : 0;
      updateFields.paid_credits = currentPaidCredits + body.paid_credits;
    }

    const { data, error } = await supabase
      .from(USER_TRIALS_TABLE_NAME)
      .update(updateFields)
      .eq("id", trialId)
      .select()
      .maybeSingle();

    if (error) {
      return failure(
        error.message || "Failed to update trial",
        500,
        error.code,
      );
    }

    if (!data) {
      return failure("Trial not found", 404, "TRIAL_NOT_FOUND");
    }

    return success(
      { userTrial: data, status: "updated" },
      200,
      undefined,
      "Trial updated successfully",
    );
  } catch (err: unknown) {
    const message =
      typeof err === "string"
        ? err
        : err instanceof Error
          ? err.message
          : "Internal Server Error";
    return failure(
      message,
      500,
      "INTERNAL_ERROR",
      undefined,
      undefined,
      (err as Error)?.stack,
    );
  }
}
