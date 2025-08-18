import { SocialIcon } from "@/components/SocialIcon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | StyleSnap AI",
  description:
    "Contact StyleSnap AI for questions, feedback, or collaboration. Reach out via email or X (formerly Twitter).",
  openGraph: {
    title: "Contact | StyleSnap AI",
    description:
      "Contact StyleSnap AI for questions, feedback, or collaboration. Reach out via email or X (formerly Twitter).",
    url: "https://stylesnap.ai/contact",
    siteName: "StyleSnap AI",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact | StyleSnap AI",
    description:
      "Contact StyleSnap AI for questions, feedback, or collaboration. Reach out via email or X (formerly Twitter).",
  },
};

export default function ContactPage() {
  return (
    <main
      className="bg-background text-text-color flex min-h-screen flex-col items-center justify-center px-4 py-12"
      aria-label="Contact page"
      tabIndex={-1}
    >
      <section
        className="bg-card flex w-full max-w-md flex-col gap-6 rounded-2xl p-8 shadow-lg"
        aria-labelledby="contact-heading"
        role="region"
      >
        <header>
          <h1
            id="contact-heading"
            className="text-primary mb-2 text-3xl font-bold"
            tabIndex={0}
          >
            Contact
          </h1>
          <p className="text-base text-gray-300">
            Feel free to reach out for questions, feedback, or collaboration.
          </p>
        </header>
        <div className="flex flex-col gap-4">
          <div>
            <h2
              className="text-primary mb-1 text-xl font-semibold"
              id="contact-email-heading"
              tabIndex={0}
            >
              Email
            </h2>
            <a
              href="mailto:itsmeaius@gmail.com"
              className="text-secondary focus-visible:ring-primary inline-flex items-center gap-2 rounded underline focus:outline-none focus-visible:ring-2"
              aria-labelledby="contact-email-heading contact-email-address"
              tabIndex={0}
            >
              <svg
                aria-hidden="true"
                width={22}
                height={22}
                fill="none"
                viewBox="0 0 24 24"
                className="text-secondary"
                focusable="false"
              >
                <path
                  d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75Zm2.25-.75a.75.75 0 0 0-.75.75v.637l8.25 5.775 8.25-5.775V6.75a.75.75 0 0 0-.75-.75h-15Zm16.5 2.363-7.728 5.41a.75.75 0 0 1-.844 0L3.75 8.363v8.887a.75.75 0 0 0 .75.75h15a.75.75 0 0 0 .75-.75V8.363Z"
                  fill="currentColor"
                />
              </svg>
              <span id="contact-email-address" className="break-all">
                itsmeaius@gmail.com
              </span>
            </a>
          </div>
          <div>
            <h2
              className="text-primary mb-1 text-xl font-semibold"
              id="contact-x-heading"
              tabIndex={0}
            >
              X (formerly Twitter)
            </h2>
            <a
              href="https://x.com/_asius"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary focus-visible:ring-primary inline-flex items-center gap-2 rounded underline focus:outline-none focus-visible:ring-2"
              aria-labelledby="contact-x-heading contact-x-handle"
              tabIndex={0}
            >
              <SocialIcon
                name="x"
                width={22}
                height={22}
                className="text-secondary"
                aria-hidden="true"
                focusable="false"
              />
              <span id="contact-x-handle">@_asius</span>
            </a>
          </div>
        </div>
        <footer
          className="mt-4 text-center text-xs text-gray-500"
          aria-label="Copyright"
        >
          &copy; {new Date().getFullYear()} StyleSnap AI. All rights reserved.
        </footer>
      </section>
    </main>
  );
}
