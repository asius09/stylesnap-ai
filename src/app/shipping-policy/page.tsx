
import React from "react";

export default function ShippingPolicyPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-background text-text-color px-4 py-12"
      aria-label="Shipping Policy Page"
      tabIndex={-1}
    >
      <article
        className="w-full max-w-2xl bg-card rounded-2xl shadow-lg p-8"
        role="region"
        aria-labelledby="shipping-policy-heading"
      >
        <header>
          <h1
            id="shipping-policy-heading"
            className="text-3xl font-bold mb-4 text-primary"
            tabIndex={0}
          >
            Shipping Policy
          </h1>
          <p className="mb-6 text-base text-gray-300">
            <span className="font-semibold text-primary">StyleSnap AI</span> delivers all products and services digitally. There is no physical shipping involved.
          </p>
        </header>
        <section className="mb-6" aria-labelledby="digital-delivery-heading">
          <h2
            id="digital-delivery-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            Digital Delivery
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Instant Access:</span>{" "}
              Once your payment is successful and your image is generated, you can download your styled image directly from the website.
            </li>
            <li>
              <span className="font-medium">No Physical Goods:</span>{" "}
              All products are digital files (images) delivered online. No items will be shipped to a physical address.
            </li>
            <li>
              <span className="font-medium">Download Link:</span>{" "}
              The download link will be available on the results page after generation. Please save your image promptly.
            </li>
          </ul>
        </section>
        <section className="mb-6" aria-labelledby="delivery-time-heading">
          <h2
            id="delivery-time-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            Delivery Time
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Processing:</span>{" "}
              Image generation typically takes less than 1 minute, depending on server load and image complexity.
            </li>
            <li>
              <span className="font-medium">Immediate Download:</span>{" "}
              Your digital product is available for download as soon as processing is complete.
            </li>
          </ul>
        </section>
        <section className="mb-6" aria-labelledby="failed-delivery-heading">
          <h2
            id="failed-delivery-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            Failed Delivery
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              If you experience any issues accessing or downloading your image, please contact our support team at{" "}
              <a
                href="mailto:itsmeaius@gmail.com"
                className="text-secondary underline break-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                aria-label="Send email to itsmeaius@gmail.com"
              >
                itsmeaius@gmail.com
              </a>
              .
            </li>
            <li>
              We will assist you promptly to ensure you receive your digital product.
            </li>
          </ul>
        </section>
        <section aria-labelledby="contact-heading">
          <h2
            id="contact-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            Contact
          </h2>
          <p className="text-base text-gray-300">
            For any questions about digital delivery or if you need help with your download, please email us at{" "}
            <a
              href="mailto:itsmeaius@gmail.com"
              className="text-secondary underline break-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-label="Send email to itsmeaius@gmail.com"
            >
              itsmeaius@gmail.com
            </a>
            .
          </p>
        </section>
        <footer className="text-xs text-gray-500 mt-8 text-center" aria-label="Copyright">
          &copy; {new Date().getFullYear()} StyleSnap AI. All rights reserved.
        </footer>
      </article>
    </main>
  );
}
