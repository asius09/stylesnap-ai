
export default function TermsAndConditionsPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-background text-text-color px-4 py-12"
      aria-label="Terms and Conditions Page"
      tabIndex={-1}
    >
      <article
        className="w-full max-w-2xl bg-card rounded-2xl shadow-lg p-8"
        role="region"
        aria-labelledby="terms-heading"
      >
        <header>
          <h1
            id="terms-heading"
            className="text-3xl font-bold mb-4 text-primary"
            tabIndex={0}
          >
            Terms &amp; Conditions
          </h1>
          <p className="mb-6 text-base text-gray-300">
            Please read these Terms and Conditions (<span lang="en" aria-label="Terms">"Terms"</span>, <span lang="en" aria-label="Terms and Conditions">"Terms and Conditions"</span>) carefully before using the StyleSnap AI website (the <span lang="en" aria-label="Service">"Service"</span>, <span lang="en" aria-label="Site">"Site"</span>, "we", "us", or "our"). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
          </p>
        </header>
        <section className="mb-6" aria-labelledby="use-of-service-heading">
          <h2
            id="use-of-service-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            1. Use of Service
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              The Service allows you to upload images and generate AI-styled artwork for personal, non-commercial use only.
            </li>
            <li>
              You must be at least 18 years old or have the consent of a parent or legal guardian to use this Service.
            </li>
            <li>
              You agree not to use the Service for any unlawful, harmful, or abusive purposes, including but not limited to uploading illegal, offensive, or copyrighted material without permission.
            </li>
            <li>
              We reserve the right to refuse service, remove content, or terminate access at our sole discretion, without notice or liability.
            </li>
          </ul>
        </section>
        <section className="mb-6" aria-labelledby="intellectual-property-heading">
          <h2
            id="intellectual-property-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            2. Intellectual Property
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              All content, features, and functionality on this Site (excluding user-uploaded images) are the exclusive property of StyleSnap AI and its licensors.
            </li>
            <li>
              You retain ownership of images you upload. Generated artwork is provided for your personal use; you are responsible for ensuring you have the rights to use and upload any content.
            </li>
            <li>
              You may not use the Service or any generated content for commercial purposes, redistribution, or resale without explicit written permission.
            </li>
          </ul>
        </section>
        <section className="mb-6" aria-labelledby="disclaimer-heading">
          <h2
            id="disclaimer-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            3. Disclaimer of Warranties
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              The Service is provided on an <span lang="en" aria-label="as is">"AS IS"</span> and <span lang="en" aria-label="as available">"AS AVAILABLE"</span> basis. We make no warranties, express or implied, regarding the Service's accuracy, reliability, or availability.
            </li>
            <li>
              We do not guarantee that the Service will be uninterrupted, error-free, secure, or free from viruses or other harmful components.
            </li>
            <li>
              You use the Service at your own risk. We are not responsible for any loss, damage, or harm resulting from your use of the Service or generated content.
            </li>
          </ul>
        </section>
        <section className="mb-6" aria-labelledby="limitation-liability-heading">
          <h2
            id="limitation-liability-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            4. Limitation of Liability
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              To the fullest extent permitted by law, StyleSnap AI and its affiliates, partners, or licensors shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the Service.
            </li>
            <li>
              We are not liable for any content uploaded by users or for any third-party claims related to your use of the Service.
            </li>
            <li>
              You agree to indemnify and hold harmless StyleSnap AI from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
            </li>
          </ul>
        </section>
        <section className="mb-6" aria-labelledby="modifications-heading">
          <h2
            id="modifications-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            5. Modifications to Terms
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              We reserve the right to update or modify these Terms at any time without prior notice. Changes are effective immediately upon posting.
            </li>
            <li>
              Your continued use of the Service after changes constitutes acceptance of the new Terms.
            </li>
          </ul>
        </section>
        <section className="mb-6" aria-labelledby="governing-law-heading">
          <h2
            id="governing-law-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            6. Governing Law
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the Service operates, without regard to its conflict of law provisions.
            </li>
            <li>
              Any disputes arising from these Terms or your use of the Service shall be resolved exclusively in the courts of the applicable jurisdiction.
            </li>
          </ul>
        </section>
        <section className="mb-6" aria-labelledby="contact-heading">
          <h2
            id="contact-heading"
            className="text-xl font-semibold mb-2 text-primary"
            tabIndex={0}
          >
            7. Contact
          </h2>
          <p className="text-base text-gray-300">
            If you have any questions about these Terms, please contact us at{" "}
            <a
              href="mailto:support@stylesmap.ai"
              className="text-secondary underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-label="Send email to support@stylesmap.ai"
            >
              support@stylesmap.ai
            </a>
            .
          </p>
        </section>
        <footer
          className="text-xs text-gray-500 mt-8 text-center"
          aria-label="Copyright"
        >
          &copy; {new Date().getFullYear()} StyleSnap AI. All rights reserved.
        </footer>
      </article>
    </main>
  );
}
