import React from "react";

export default function ShippingPolicyPage() {
  return (
    <main
      className="bg-background text-text-color flex min-h-screen flex-col items-center justify-center px-4 py-12"
      aria-label="Shipping Policy Page"
      tabIndex={-1}
    >
      <article
        className="bg-card w-full max-w-2xl rounded-2xl p-8 shadow-lg"
        role="region"
        aria-labelledby="shipping-policy-heading"
      >
        <header>
          <h1
            id="shipping-policy-heading"
            className="text-primary mb-4 text-3xl font-bold"
            tabIndex={0}
          >
            Shipping Policy
          </h1>
          <p className="mb-6 text-base text-gray-300">
            <span className="text-primary font-semibold">StyleSnap AI</span>{" "}
            delivers all products and services digitally. There is no physical
            shipping involved.
          </p>
        </header>
        <section className="mb-6" aria-labelledby="digital-delivery-heading">
          <h2
            id="digital-delivery-heading"
            className="text-primary mb-2 text-xl font-semibold"
            tabIndex={0}
          >
            Digital Delivery
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <span className="font-medium">Instant Access:</span> Once your
              payment is successful and your image is generated, you can
              download your styled image directly from the website.
            </li>
            <li>
              <span className="font-medium">No Physical Goods:</span> All
              products are digital files (images) delivered online. No items
              will be shipped to a physical address.
            </li>
            <li>
              <span className="font-medium">Download Link:</span> The download
              link will be available on the results page after generation.
              Please save your image promptly.
            </li>
          </ul>
        </section>
        <section className="mb-6" aria-labelledby="delivery-time-heading">
          <h2
            id="delivery-time-heading"
            className="text-primary mb-2 text-xl font-semibold"
            tabIndex={0}
          >
            Delivery Time
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <span className="font-medium">Processing:</span> Image generation
              typically takes less than 1 minute, depending on server load and
              image complexity.
            </li>
            <li>
              <span className="font-medium">Immediate Download:</span> Your
              digital product is available for download as soon as processing is
              complete.
            </li>
          </ul>
        </section>
        <section className="mb-6" aria-labelledby="failed-delivery-heading">
          <h2
            id="failed-delivery-heading"
            className="text-primary mb-2 text-xl font-semibold"
            tabIndex={0}
          >
            Failed Delivery
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              If you experience any issues accessing or downloading your image,
              please contact our support team at{" "}
              <a
                href="mailto:itsmeaius@gmail.com"
                className="text-secondary focus-visible:ring-primary rounded break-all underline focus:outline-none focus-visible:ring-2"
                aria-label="Send email to itsmeaius@gmail.com"
              >
                itsmeaius@gmail.com
              </a>
              .
            </li>
            <li>
              We will assist you promptly to ensure you receive your digital
              product.
            </li>
          </ul>
        </section>
        <section aria-labelledby="contact-heading">
          <h2
            id="contact-heading"
            className="text-primary mb-2 text-xl font-semibold"
            tabIndex={0}
          >
            Contact
          </h2>
          <p className="text-base text-gray-300">
            For any questions about digital delivery or if you need help with
            your download, please email us at{" "}
            <a
              href="mailto:itsmeaius@gmail.com"
              className="text-secondary focus-visible:ring-primary rounded break-all underline focus:outline-none focus-visible:ring-2"
              aria-label="Send email to itsmeaius@gmail.com"
            >
              itsmeaius@gmail.com
            </a>
            .
          </p>
        </section>
        <footer
          className="mt-8 text-center text-xs text-gray-500"
          aria-label="Copyright"
        >
          &copy; {new Date().getFullYear()} StyleSnap AI. All rights reserved.
        </footer>
      </article>
    </main>
  );
}
