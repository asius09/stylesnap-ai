"use client";

import { useTrialId } from "@/hooks/useTrialId";
import { createContext, useContext, useEffect, useState } from "react";

// --- Top-notch console utilities ---
const log = (...args: any[]) =>
  console.log(
    "%c[Paywall]%c",
    "background: #7c3aed; color: #fff; font-weight: bold; padding:2px 6px; border-radius:3px;",
    "",
    ...args,
  );
const warn = (...args: any[]) =>
  console.warn(
    "%c[Paywall]%c",
    "background: #f59e42; color: #222; font-weight: bold; padding:2px 6px; border-radius:3px;",
    "",
    ...args,
  );
const error = (...args: any[]) =>
  console.error(
    "%c[Paywall]%c",
    "background: #ef4444; color: #fff; font-weight: bold; padding:2px 6px; border-radius:3px;",
    "",
    ...args,
  );

// Create context for 'open' state
type PaywallContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const PaywallContext = createContext<PaywallContextType | undefined>(undefined);

export function usePaywall() {
  const ctx = useContext(PaywallContext);
  if (!ctx) throw new Error("usePaywall must be used within PaywallProvider");
  return ctx;
}

export function PaywallProvider({ children }: { children: React.ReactNode }) {
  // Default open should be false
  const [open, setOpen] = useState(false);
  return (
    <PaywallContext.Provider value={{ open, setOpen }}>
      {children}
    </PaywallContext.Provider>
  );
}

// Razorpay types for TS
declare global {
  interface Window {
    Razorpay: any;
  }
}

type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
};

async function createOrder(trialId: string): Promise<RazorpayOrder> {
  // You should implement this API route in your backend
  // It should return { id, amount, currency }
  log("Creating order with trialId:", trialId);
  const res = await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 900, currency: "INR", trialId }), // ₹9 in paise
  });
  const data = await res.json();
  if (!res.ok || !data?.success || !data?.data?.order) {
    error("Failed to create order", res.status, res.statusText, data);
    throw new Error("Failed to create order");
  }
  log("Order created:", data);
  return data.data.order;
}

export default function Paywall() {
  const { trialId } = useTrialId();
  // Use context for open state
  const paywallCtx = useContext(PaywallContext);
  // Default open should be false if context is missing
  const open = paywallCtx ? paywallCtx.open : false;
  const setOpen = paywallCtx ? paywallCtx.setOpen : () => {};

  const [loading, setLoading] = useState(false);

  // Load Razorpay script dynamically
  useEffect(() => {
    if (!open) return;
    if ((window as any).Razorpay) {
      log("Razorpay script already loaded");
      return;
    }

    log("Loading Razorpay script...");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => log("Razorpay script loaded");
    script.onerror = () => error("Failed to load Razorpay script");

    return () => {
      // Optionally remove script on close
      // document.body.removeChild(script);
    };
  }, [open]);

  // Handler to launch Razorpay checkout
  const handlePay = async () => {
    setLoading(true);
    log("Initiating payment...");
    try {
      if (typeof trialId !== "string") return;
      // 1. Create order on backend
      const order = await createOrder(trialId);
      // 2. Prepare Razorpay options
      const options = {
        key: "rzp_test_R5bRP5pjCPZgIo",
        amount: order.amount,
        currency: order.currency,
        name: "My App",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response: any) {
          log("Razorpay payment handler called with response:", response);
          // Call backend to verify
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const result = await verifyRes.json();
            log("Verification result:", result);
            if (result?.success) {
              log("Payment Success 🎉");
              // PATCH paid_credits to 100 for this trialId
              try {
                const patchRes = await fetch(`/api/trial?id=${trialId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ paid_credits: 100 }),
                });
                const patchResult = await patchRes.json();
                log("Trial PATCH result:", patchResult);
                if (!patchRes.ok || !patchResult?.success) {
                  warn("Failed to update paid_credits after payment", patchResult);
                  alert("Payment succeeded, but failed to update credits. Please contact support.");
                } else {
                  alert("Payment Success 🎉");
                  setOpen(false);
                }
              } catch (patchErr) {
                error("Error updating paid_credits after payment:", patchErr);
                alert("Payment succeeded, but failed to update credits. Please contact support.");
              }
            } else {
              warn("Payment Verification Failed ❌", result);
              alert("Payment Verification Failed ❌");
            }
          } catch (err) {
            error("Error verifying payment:", err);
            alert("Error verifying payment. Please contact support.");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: { color: "#2563eb" }, // Tailwind blue
        modal: {
          ondismiss: () => {
            log("Razorpay modal dismissed by user");
            setOpen(false);
          },
        },
      };

      // 3. Open Razorpay checkout
      if ((window as any).Razorpay) {
        log("Opening Razorpay checkout with options:", options);
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        error("Payment SDK not loaded. Please try again.");
        alert("Payment SDK not loaded. Please try again.");
      }
    } catch (err: any) {
      error("Error while initiating payment:", err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="relative flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="mb-3 text-xl font-bold text-gray-900">
          Complete Your Payment
        </h2>
        <p className="mb-6 text-gray-600">Pay ₹9 securely to continue</p>
        <div className="flex w-full flex-row items-center justify-center gap-4">
          <button
            className="mb-1 w-40 cursor-pointer rounded bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
            onClick={handlePay}
            type="button"
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? "Processing..." : "Pay ₹9"}
          </button>
          <button
            className="mb-1 w-40 cursor-pointer rounded bg-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none"
            onClick={() => {
              log("Paywall modal cancelled by user");
              setOpen(false);
            }}
            type="button"
            disabled={loading}
            aria-disabled={loading}
          >
            Cancel
          </button>
        </div>
        {loading && (
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <svg
              className="h-4 w-4 animate-spin text-gray-400"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Loading payment options...
          </div>
        )}
        <p className="mt-6 text-xs text-gray-400">
          Secured by Razorpay • UPI / Card / Wallet / Netbanking
        </p>
      </div>
    </div>
  );
}

/**
 * HOW TO IMPLEMENT THIS:
 *
 * 1. You need a backend API route `/api/create-order` that creates a Razorpay order using your Razorpay secret key.
 *    - It should return { id, amount, currency } for the order.
 *    - See: https://razorpay.com/docs/api/orders/
 *
 * 2. You need a backend API route `/api/verify-payment` that verifies the payment signature sent by Razorpay.
 *    - It should return { status: "ok" } if verified, or { status: "fail" } otherwise.
 *    - See: https://razorpay.com/docs/payment-gateway/web-integration/standard/build-integration/#step-4-verify-the-payment
 *
 * 3. Set your Razorpay public key in your environment as NEXT_PUBLIC_RAZORPAY_KEY_ID.
 *
 * 4. The Paywall modal will open the Razorpay checkout when "Pay ₹9" is clicked.
 *    - On success, it will call your verify endpoint and close the modal if successful.
 *    - On cancel, it will close the modal.
 *
 * 5. You can customize the prefill, theme, and other options as needed.
 */
