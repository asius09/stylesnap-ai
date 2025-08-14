import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { UserTrial } from "@/types/model.types";
import { USER_TRIALS_TABLE_NAME } from "@/constant";

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
    const ip =
      req.headers.get("x-forwarded-for") || req.headers.entries || "unknown";
    const userAgent = req.headers.get("user-agent");

    const body = await req.json();
    const trialId = body?.trialId;

    // If no trialId present, just respond with error
    if (!trialId || typeof trialId !== "string") {
      return NextResponse.json({
        error: "Missing or invalid trialId in request body",
        statusCode: 400,
        status: "failed" as const,
      });
    }

    // Check if trial already exists
    const { data: existingTrial, error: selectError } = await supabase
      .from(USER_TRIALS_TABLE_NAME)
      .select("*")
      .eq("id", trialId)
      .single();

    if (existingTrial) {
      // Always set the cookie if trialId exists
      const response = NextResponse.json({
        trialId,
        statusCode: 200,
        status: "already_exists" as const,
        message: "Trial already exists",
      });
      response.headers.set(
        "Set-Cookie",
        `trialId=${trialId}; Path=/; HttpOnly; Max-Age=31536000`,
      );
      return response;
    } else if (selectError && selectError.code !== "PGRST116") {
      // PGRST116: No rows found (so it's ok), otherwise error
      throw new Error(selectError.message);
    }

    // If not present, insert new trial
    const { error } = await supabase.from(USER_TRIALS_TABLE_NAME).insert({
      id: trialId,
      ip: ip.toString(),
      last_ip: ip.toString(),
      user_metadata: { ua: userAgent },
      free_used: false,
      paid_credits: 0,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Always set the cookie if trialId object is created
    const response = NextResponse.json({
      trialId,
      statusCode: 200,
      status: "successful" as const,
    });
    response.headers.set(
      "Set-Cookie",
      `trialId=${trialId}; Path=/; HttpOnly; Max-Age=31536000`,
    );
    return response;
  } catch (err: unknown) {
    let message = "Internal Server Error";
    const statusCode = 500;

    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === "string") {
      message = err;
    } else if (typeof err === "object" && err !== null && "message" in err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message = (err as any).message;
    }

    console.error("[TRIAL-POST] Error:", err);

    return NextResponse.json({
      error: message,
      statusCode,
      status: "failed" as const,
    });
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

    // If no trialId present, just respond with error
    if (
      trialId === null ||
      trialId === undefined ||
      (typeof trialId === "string" && trialId.trim() === "") ||
      (Array.isArray(trialId) && trialId.length === 0)
    ) {
      return NextResponse.json({
        userTrial: null,
        statusCode: 400,
        status: "failed" as const,
        error: "Missing or invalid trialId",
      });
    }

    const { data, error } = await supabase
      .from(USER_TRIALS_TABLE_NAME)
      .select("*")
      .eq("id", trialId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116: No rows found
      throw new Error(error.message);
    }

    if (data) {
      // Set cookie if trialId found
      const response = NextResponse.json({
        userTrial: data as UserTrial,
        statusCode: 200,
        status: "successful" as const,
      });
      response.headers.set(
        "Set-Cookie",
        `trialId=${trialId}; Path=/; HttpOnly; Max-Age=31536000`,
      );
      return response;
    } else {
      // Not found
      return NextResponse.json({
        userTrial: null,
        statusCode: 404,
        status: "failed" as const,
        error: "Trial not found",
      });
    }
  } catch (err: unknown) {
    let message = "Internal Server Error";
    const statusCode = 500;

    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === "string") {
      message = err;
    }

    console.error("[TRIAL-GET] Error:", err);

    return NextResponse.json({
      error: message,
      statusCode,
      status: "failed" as const,
    });
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
    const body = await req.json();
    const trialId = body.trialId;

    if (
      trialId === null ||
      trialId === undefined ||
      (typeof trialId === "string" && trialId.trim() === "") ||
      (Array.isArray(trialId) && trialId.length === 0)
    ) {
      return NextResponse.json({
        statusCode: 400,
        status: "failed" as const,
        error: "Missing or invalid trialId",
      });
    }

    // Delete the trial row
    const { error } = await supabase
      .from(USER_TRIALS_TABLE_NAME)
      .delete()
      .eq("id", trialId);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      trialId,
      statusCode: 200,
      status: "successful" as const,
      message: "Trial deleted",
    });
  } catch (err: unknown) {
    let message = "Internal Server Error";
    const statusCode = 500;

    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === "string") {
      message = err;
    } else if (typeof err === "object" && err !== null && "message" in err) {
      message =
        typeof (err as { message?: unknown }).message === "string"
          ? (err as { message: string }).message
          : message;
    }

    console.error("[TRIAL-DELETE] Error:", err);

    return NextResponse.json({
      error: message,
      statusCode,
      status: "failed" as const,
    });
  }
}
