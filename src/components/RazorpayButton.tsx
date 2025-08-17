"use client";

import { useEffect, useRef } from "react";

export default function RazorpayButton() {
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = ref.current;
    if (!form) return;

    // Remove any previous script (prevents double button)
    const prevScript = form.querySelector("script[data-payment_button_id]");
    if (prevScript) {
      prevScript.remove();
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.setAttribute("data-payment_button_id", "pl_R5wh3RYeeMZm7T"); // replace with your ID

    form.appendChild(script);

    return () => {
      // Clean up using captured form, not ref.current
      while (form.firstChild) {
        form.removeChild(form.firstChild);
      }
    };
  }, []);

  return <form ref={ref} />;
}
