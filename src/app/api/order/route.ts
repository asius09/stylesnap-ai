import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { success, failure } from "@/lib/apiResponse";

// Handles POST /api/order (create new order)
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // From body : {amount , currency} amount : 9 & currency INR
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
    // Handle errors with more detail, without using 'any'
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

// Handles POST /api/order/id={orderId}/payment (initiate payment for an order and fetch payments)
export async function paymentHandler({
  params,
}: {
  params: { orderId: string };
}): Promise<NextResponse> {
  try {
    const { orderId } = params;
    if (!orderId) {
      return failure("Order ID is required.", 400, "ORDER_ID_REQUIRED");
    }

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Fetch the order details from Razorpay
    const order = await razorpay.orders.fetch(orderId);

    if (!order) {
      return failure("Order not found.", 404, "ORDER_NOT_FOUND");
    }

    // This only fetches payments associated with the order; it does not capture payments.
    const payments = await razorpay.orders.fetchPayments(orderId);

    // Return order details and associated payments
    return success(
      { order, payments },
      200,
      undefined,
      "Order and payments fetched",
    );
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
      "ORDER_PAYMENTS_FETCH_ERROR",
      errorDetails,
      undefined,
      (err as Error)?.stack,
    );
  }
}
