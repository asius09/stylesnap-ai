"use client";

import { useEffect, useRef } from "react";

export default function RazorpayButton() {
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Remove any previous script (prevents double button)
    const prevScript = ref.current.querySelector(
      "script[data-payment_button_id]",
    );
    if (prevScript) {
      prevScript.remove();
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.setAttribute("data-payment_button_id", "pl_R5wh3RYeeMZm7T"); // replace with your ID

    ref.current.appendChild(script);

    return () => {
      if (ref.current) {
        // Remove all children (including the script and button) on cleanup
        while (ref.current.firstChild) {
          ref.current.removeChild(ref.current.firstChild);
        }
      }
    };
  }, []);

  return <form ref={ref} />;
}
