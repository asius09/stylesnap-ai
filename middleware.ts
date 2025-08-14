import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { TRIAL_ID_LOCAL_STORAGE_KEY, USER_TRIALS_TABLE_NAME } from "@/constant";
import { createClient } from "@/utils/supabase/server";

export async function middleware(req: NextRequest) {
  const trialId = req.cookies.get(TRIAL_ID_LOCAL_STORAGE_KEY)?.value;
  console.log("[middleware] trialId from cookies:", trialId);

  if (!trialId) {
    // Generate a new trialId
    const newTrialId = uuidv4();
    console.log(
      "[middleware] No trialId found, generating newTrialId:",
      newTrialId,
    );

    // Setup Supabase and create a new row in user_trials
    try {
      const supabase = await createClient();
      const ip =
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "unknown";
      const userAgent = req.headers.get("user-agent");

      console.log("[middleware] Inserting new trial row with:", {
        id: newTrialId,
        ip: ip?.toString(),
        userAgent,
      });

      // Insert new trial row
      const { error } = await supabase.from(USER_TRIALS_TABLE_NAME).insert({
        id: newTrialId,
        ip: ip.toString(),
        last_ip: ip.toString(),
        user_metadata: { ua: userAgent },
        free_used: false,
        paid_credits: 0,
      });

      if (error) {
        console.error("[middleware] Error inserting trial row:", error);
      } else {
        console.log("[middleware] Trial row inserted successfully");
      }
    } catch (e) {
      console.error(
        "[middleware] Failed to create trial row in middleware:",
        e,
      );
    }

    const res = NextResponse.next();
    res.cookies.set(TRIAL_ID_LOCAL_STORAGE_KEY, newTrialId, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    console.log("[middleware] Set cookie for newTrialId:", newTrialId);
    return res;
  }

  console.log("[middleware] trialId exists, proceeding with request");
  return NextResponse.next();
}

export const config = {
  // Use a systematic matcher for Next.js middleware:
  // - Exclude _next (static files), favicon, and API routes if not needed
  // - Apply to all pages and app routes
  matcher: [
    /*
      Match all routes except:
      - static files in /_next
      - static assets in /static
      - favicon.ico
      - robots.txt
      - API routes (if you want to exclude them, otherwise remove the /api check)
    */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|api/).*)",
  ],
};
