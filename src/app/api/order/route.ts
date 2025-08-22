import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { success, failure } from "@/lib/apiResponse";

// Handles POST /api/order (create new order)
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // From body : {amount , currency, trialId}
    const { amount, currency, trialId } = await req.json();

    // Initialize Razorpay instance with credentials from environment variables
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Generate a unique receipt id using timestamp
    const rcptid = `order_rcptid_${Date.now()}`;

    // Options for creating the order
    const options = {
      amount: amount ?? 900, // Default to 900 paise (₹9) if not provided
      currency: currency ?? "INR", // Default to INR if not provided
      receipt: rcptid,
      notes: {
        trialId: trialId,
      },
    };

    // Creating order with Razorpay
    const response = await razorpay.orders.create(options);

    // If order is created successfully, return order details
    if (response && response.status === "created") {
      return success({ order: response }, 201, undefined, "Order created");
    } else {
      // If order creation failed, return error
      return failure(
        `BAD_REQUEST_ERROR: ${response?.description || "Failed to create order"}`,
        400,
        "BAD_REQUEST_ERROR",
        response,
      );
    }
  } catch (err: unknown) {
    let errorMessage = "An unexpected error occurred. Please try again later.";
    let errorDetails: Record<string, unknown> = {};

    if (err instanceof Error) {
      errorMessage = err.message;
      errorDetails = {
        name: err.name,
        stack: err.stack,
      };
    } else if (typeof err === "object" && err !== null) {
      if (
        "message" in err &&
        typeof (err as { message: unknown }).message === "string"
      ) {
        errorMessage = (err as { message: string }).message;
      }
      errorDetails = Object.fromEntries(Object.entries(err));
    }

    return failure(
      errorMessage,
      500,
      "ORDER_CREATE_ERROR",
      errorDetails,
      undefined,
      (err as Error)?.stack,
    );
  }
}
