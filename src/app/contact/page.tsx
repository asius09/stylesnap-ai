"use client";

import { SocialIcon } from "@/components/ui/SocialIcon";
import Link from "next/link";

export default function ContactPage() {
  const year = new Date().getFullYear();
  return (
    <main className="bg-background text-text-color flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <section className="bg-card flex w-full max-w-md flex-col gap-6 rounded-2xl p-8 shadow-lg">
        <h1 className="text-primary mb-2 text-3xl font-bold">Contact</h1>
        <p className="text-base text-gray-300">
          Reach out for questions, feedback, or collaboration.
        </p>
        <div className="flex flex-col gap-4">
          <ContactItem
            label="Email"
            href="mailto:itsmeaius@gmail.com"
            icon={
              <svg
                aria-hidden="true"
                width={22}
                height={22}
                fill="none"
                viewBox="0 0 24 24"
                className="text-secondary"
              >
                <path
                  d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75Zm2.25-.75a.75.75 0 0 0-.75.75v.637l8.25 5.775 8.25-5.775V6.75a.75.75 0 0 0-.75-.75h-15Zm16.5 2.363-7.728 5.41a.75.75 0 0 1-.844 0L3.75 8.363v8.887a.75.75 0 0 0 .75.75h15a.75.75 0 0 0 .75-.75V8.363Z"
                  fill="currentColor"
                />
              </svg>
            }
            value="itsmeaius@gmail.com"
          />
          <ContactItem
            label="X (Twitter)"
            href="https://x.com/_asius"
            icon={
              <SocialIcon
                name="x"
                width={22}
                height={22}
                className="text-secondary"
                aria-hidden="true"
              />
            }
            value="@_asius"
            external
          />
        </div>
        <footer className="mt-4 text-center text-xs text-gray-500">
          &copy; {year} StyleSnap AI. All rights reserved.
        </footer>
      </section>
    </main>
  );
}

function ContactItem({
  label,
  href,
  icon,
  value,
  external,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
  value: string;
  external?: boolean;
}) {
  return (
    <div>
      <h2 className="text-primary mb-1 text-xl font-semibold">{label}</h2>
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="text-secondary focus-visible:ring-primary inline-flex items-center gap-2 rounded underline focus:outline-none focus-visible:ring-2"
      >
        {icon}
        <span className="break-all">{value}</span>
      </Link>
    </div>
  );
}
