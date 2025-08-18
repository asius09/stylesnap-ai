"use client";

import { useTrialId } from "@/hooks/useTrialId";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { useToast } from "@/components/Toast";

// --- Types ---
interface PaywallContextType {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface PaywallProviderProps {
  children: ReactNode;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  [key: string]: unknown;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  [key: string]: unknown;
}

// --- Context ---
const PaywallContext = createContext<PaywallContextType | undefined>(undefined);

export function usePaywall(): PaywallContextType {
  const ctx = useContext(PaywallContext);
  if (!ctx) throw new Error("usePaywall must be used within PaywallProvider");
  return ctx;
}

export function PaywallProvider({ children }: PaywallProviderProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <PaywallContext.Provider value={{ open, setOpen }}>
      {children}
    </PaywallContext.Provider>
  );
}

// Razorpay global type
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

// Razorpay global
if (typeof window !== "undefined") {
  window.Razorpay = window.Razorpay || undefined;
}

async function createOrder(trialId: string): Promise<RazorpayOrder> {
  const res = await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 900, currency: "INR", trialId }),
  });
  const data = (await res.json()) as {
    success?: boolean;
    data?: { order?: RazorpayOrder };
    [key: string]: unknown;
  };
  if (!res.ok || !data?.success || !data?.data?.order) {
    throw new Error("Failed to create order");
  }
  return data.data.order as RazorpayOrder;
}

export default function Paywall() {
  const { trialId } = useTrialId();
  const paywallCtx = useContext(PaywallContext);
  const open = paywallCtx?.open ?? false;
  const setOpen = paywallCtx?.setOpen ?? (() => {});
  const { addToast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!open) return;
    if (typeof window !== "undefined" && window.Razorpay) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    // Optionally remove script on close
    // return () => { document.body.removeChild(script); };
  }, [open]);

  const handlePay = async () => {
    setLoading(true);
    try {
      if (typeof trialId !== "string") return;
      const order = await createOrder(trialId);
      const options: RazorpayOptions = {
        key: "rzp_test_R5bRP5pjCPZgIo",
        amount: order.amount,
        currency: order.currency,
        name: "My App",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response: RazorpayPaymentResponse) {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const result = (await verifyRes.json()) as {
              success?: boolean;
              [key: string]: unknown;
            };
            if (result && result.success) {
              try {
                const patchRes = await fetch(`/api/trial?id=${trialId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ paid_credits: 100 }),
                });
                const patchResult = (await patchRes.json()) as {
                  success?: boolean;
                  [key: string]: unknown;
                };
                if (!patchRes.ok || !patchResult || !patchResult.success) {
                  addToast({
                    type: "error",
                    message:
                      "Payment succeeded, but failed to update credits. Please contact support.",
                  });
                } else {
                  addToast({
                    type: "success",
                    message:
                      "🎉 Payment successful! Thank you for your support. Your credits have been added. Enjoy creating amazing images!",
                  });
                  setOpen(false);
                }
              } catch (_patchErr: unknown) {
                addToast({
                  type: "error",
                  message: `Payment succeeded, but failed to update credits. Please contact support. Error: ${_patchErr instanceof Error ? _patchErr.message : String(_patchErr)}`,
                });
              }
            } else {
              addToast({
                type: "error",
                message:
                  "Payment verification failed. Please try again or contact support.",
              });
            }
          } catch (_err: unknown) {
            const errorMessage = `Error verifying payment. Please contact support if this persists. Error: ${_err instanceof Error ? _err.message : String(_err)}`;
            addToast({
              type: "error",
              message: errorMessage,
            });
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: { color: "#2563eb" },
        modal: {
          ondismiss: () => {
            setOpen(false);
          },
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        addToast({
          type: "error",
          message: "Payment SDK not loaded. Please try again.",
        });
      }
    } catch (_err: unknown) {
      addToast({
        type: "error",
        message: `Failed to initiate payment. Please try again. Error: ${_err instanceof Error ? _err.message : String(_err)}`,
      });
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
 * 3. Set your Razorpay public key in your environment as RAZORPAY_KEY_ID.
 *
 * 4. The Paywall modal will open the Razorpay checkout when "Pay ₹9" is clicked.
 *    - On success, it will call your verify endpoint and close the modal if successful.
 *    - On cancel, it will close the modal.
 *
 * 5. You can customize the prefill, theme, and other options as needed.
 */
