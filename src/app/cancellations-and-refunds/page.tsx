import React from "react";

export default function CancellationsAndRefundsPage() {
  return (
    <main
      className="bg-background text-text-color font-red-hat-display flex min-h-screen flex-col items-center px-4 py-12"
      aria-label="Cancellations and Refunds Policy"
      tabIndex={-1}
    >
      <div
        className="bg-card w-full max-w-2xl rounded-xl p-8 shadow-lg"
        role="region"
        aria-labelledby="cancellations-refunds-heading"
      >
        <h1
          id="cancellations-refunds-heading"
          className="text-primary mb-4 text-3xl font-bold"
          tabIndex={0}
        >
          Cancellations &amp; Refunds
        </h1>
        <p className="mb-6 text-lg">
          We want you to have a smooth and transparent experience with StyleSnap
          AI. Please review our cancellation and refund policy below.
        </p>
        <section className="mb-6" aria-labelledby="order-cancellations-heading">
          <h2
            id="order-cancellations-heading"
            className="text-primary mb-2 text-xl font-semibold"
            tabIndex={0}
          >
            Order Cancellations
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <span className="font-medium">Before Image Generation:</span> You
              may cancel your order and request a full refund if image
              generation has not started.
            </li>
            <li>
              <span className="font-medium">After Image Generation:</span> Once
              the AI has begun processing your image, cancellations are not
              possible.
            </li>
          </ul>
        </section>
        <section className="mb-6" aria-labelledby="refunds-heading">
          <h2
            id="refunds-heading"
            className="text-primary mb-2 text-xl font-semibold"
            tabIndex={0}
          >
            Refunds
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <span className="font-medium">Failed Generations:</span> If your
              image fails to generate due to a technical error and you are not
              able to download a result, you are eligible for a full refund.
            </li>
            <li>
              <span className="font-medium">Duplicate Payments:</span> Any
              duplicate or accidental payments will be refunded in full.
            </li>
            <li>
              <span className="font-medium">Change of Mind:</span> Refunds are
              not available once the AI has started processing your image,
              except in the cases above.
            </li>
          </ul>
        </section>
        <section
          className="mb-6"
          aria-labelledby="request-cancellation-refund-heading"
        >
          <h2
            id="request-cancellation-refund-heading"
            className="text-primary mb-2 text-xl font-semibold"
            tabIndex={0}
          >
            How to Request a Cancellation or Refund
          </h2>
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              Email us at{" "}
              <a
                href="mailto:support@stylesmap.ai"
                className="text-secondary focus-visible:ring-primary rounded underline focus:outline-none focus-visible:ring-2"
                aria-label="Send email to support@stylesmap.ai"
              >
                support@stylesmap.ai
              </a>{" "}
              with your order details.
            </li>
            <li>
              Include your order ID and a brief description of your issue.
            </li>
            <li>
              Our team will review your request and respond within 2 business
              days.
            </li>
          </ol>
        </section>
        <section aria-labelledby="additional-notes-heading">
          <h2
            id="additional-notes-heading"
            className="text-primary mb-2 text-xl font-semibold"
            tabIndex={0}
          >
            Additional Notes
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Refunds are processed to your original payment method.</li>
            <li>
              Processing times may vary depending on your bank or payment
              provider.
            </li>
            <li>
              For any questions, please contact our support team at{" "}
              <a
                href="mailto:support@stylesmap.ai"
                className="text-secondary focus-visible:ring-primary rounded underline focus:outline-none focus-visible:ring-2"
                aria-label="Send email to support@stylesmap.ai"
              >
                support@stylesmap.ai
              </a>
              .
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
