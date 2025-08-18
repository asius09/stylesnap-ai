
export default function PrivacyPolicyPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-background text-text-color px-4 py-12"
      aria-label="Privacy Policy Page"
      tabIndex={-1}
    >
      <article
        className="w-full max-w-2xl bg-card rounded-2xl shadow-lg p-8"
        role="region"
        aria-labelledby="privacy-policy-heading"
      >
        <header>
          <h1
            id="privacy-policy-heading"
            className="text-3xl font-bold mb-4 text-primary"
            tabIndex={0}
          >
            Privacy Policy
          </h1>
          <p className="mb-6 text-base text-gray-300">
            <span className="font-semibold text-primary">StyleSnap AI</span> is committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our website and services.
          </p>
        </header>

        <section className="mb-6" aria-labelledby="info-we-collect-heading">
          <h2
            id="info-we-collect-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">No Personal Information Required:</span>{" "}
              We do <span className="underline">not</span> require you to create an account or provide any personal information (such as your name, email, or phone number) to use our AI photo generation features.
            </li>
            <li>
              <span className="font-medium">Image Uploads:</span>{" "}
              The images you upload are used solely for the purpose of generating your requested artwork. We do not use your images for training, sharing, or any other purpose.
            </li>
            <li>
              <span className="font-medium">Payment Information:</span>{" "}
              If you choose to make a purchase, payment processing is handled securely by our payment provider (e.g., Razorpay). We do not store your card or payment details on our servers.
            </li>
            <li>
              <span className="font-medium">Analytics:</span>{" "}
              We may use basic analytics tools (such as Vercel Speed Insights) to understand site usage and improve our service. These tools do not collect personally identifiable information.
            </li>
          </ul>
        </section>

        <section className="mb-6" aria-labelledby="how-we-use-heading">
          <h2
            id="how-we-use-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To generate AI artwork based on your uploaded images and selected styles.</li>
            <li>To process payments securely (if you make a purchase).</li>
            <li>To monitor and improve the performance and reliability of our website.</li>
          </ul>
        </section>

        <section className="mb-6" aria-labelledby="data-retention-heading">
          <h2
            id="data-retention-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            3. Data Retention
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Uploaded images are stored temporarily for the duration of the generation process and are deleted automatically after your session or shortly thereafter.
            </li>
            <li>
              We do not retain your images or generated artwork after you leave the site, except as necessary to fulfill your request.
            </li>
          </ul>
        </section>

        <section className="mb-6" aria-labelledby="cookies-tracking-heading">
          <h2
            id="cookies-tracking-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            4. Cookies &amp; Tracking
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              We use only essential cookies for site functionality and analytics. No tracking or advertising cookies are used.
            </li>
          </ul>
        </section>

        <section className="mb-6" aria-labelledby="third-party-heading">
          <h2
            id="third-party-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            5. Third-Party Services
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Payments are processed by trusted third-party providers (such as Razorpay). Please refer to their privacy policies for details on how they handle your payment information.
            </li>
            <li>
              We do not share your data with any third parties for marketing or advertising purposes.
            </li>
          </ul>
        </section>

        <section className="mb-6" aria-labelledby="your-rights-contact-heading">
          <h2
            id="your-rights-contact-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            6. Your Rights &amp; Contact
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Since we do not collect or store personal information, there is no personal data to access, modify, or delete.
            </li>
            <li>
              If you have any questions or concerns about your privacy, please contact us at{" "}
              <a
                href="mailto:itsmeaius@gmail.com"
                className="text-secondary underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                aria-label="Send email to itsmeaius@gmail.com"
              >
                itsmeaius@gmail.com
              </a>
              .
            </li>
          </ul>
        </section>

        <section aria-labelledby="changes-policy-heading">
          <h2
            id="changes-policy-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            7. Changes to This Policy
          </h2>
          <p className="text-gray-300">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
          </p>
        </section>

        <footer className="mt-8 text-xs text-gray-500 text-center" aria-label="Effective date">
          <time dateTime="2025-12-08">Effective date: 8 December 2025</time>
        </footer>
      </article>
    </main>
  );
}
