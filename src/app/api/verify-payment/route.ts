import crypto from "crypto";
import { success, failure } from "@/lib/apiResponse";

type RazorpayVerifyRequest = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export async function POST(req: Request): Promise<Response> {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      (await req.json()) as RazorpayVerifyRequest;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return failure("Missing required fields", 400, "MISSING_FIELDS");
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return failure("Missing RAZORPAY_KEY_SECRET", 500, "SERVER_MISCONFIG");
    }

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", keySecret)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return success({ verified: true }, 200, undefined, "ok");
    } else {
      return failure("Payment verification failed", 400, "VERIFICATION_FAILED");
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    return failure(
      (err as Error)?.message || "Verification error",
      500,
      "VERIFICATION_ERROR",
      undefined,
      undefined,
      (err as Error)?.stack,
    );
  }
}