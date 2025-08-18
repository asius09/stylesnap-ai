import React from "react";
import { SocialIcon } from "./SocialIcon";
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer
      className="border-primary/50 selection-primary text-text-color/80 mt-16 flex w-full flex-col items-start justify-center gap-8 border-t-[0.2px] px-4 py-8 md:px-24"
      aria-label="Site footer"
    >
      <div className="justify-centre mt-4 mb-10 flex w-full max-w-4xl flex-col items-start gap-16 md:flex-row">
        {/* Name */}
        <div className="flex flex-col items-start">
          <Link
            href="/"
            className="focus-visible:ring-primary text-text-color relative z-10 flex items-center justify-center text-lg font-medium tracking-tight text-nowrap drop-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            tabIndex={0}
            aria-label="Go to StyleSnap AI Home"
            role="link"
          >
            <Image
              src="/logo.svg"
              alt="stylesnap"
              aria-hidden="true"
              className="mr-2 inline-block h-7 w-7 align-middle"
              width={28}
              height={28}
              draggable={false}
              tabIndex={-1}
            />
            StyleSnap AI
          </Link>
          <span className="selection-primary text-text-color/90 mt-2 text-base">
            A small project by asius — thanks for visiting!
          </span>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-start gap-2">
          <span className="selection-primary text-text-color/90 text-base font-semibold">
            Contact
          </span>
          <div className="flex items-center gap-3">
            <SocialIcon
              name="x"
              width={32}
              aria-hidden="true"
              className="focus-ring-primary focus:outline-none"
            />
            <SocialIcon
              name="github"
              width={32}
              aria-hidden="true"
              className="focus-ring-primary focus:outline-none"
            />
            <SocialIcon
              name="linkedin"
              width={32}
              aria-hidden="true"
              className="focus-ring-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Responsive Footer Links */}
      <div className="border-primary/30 selection-primary text-text-color/60 mt-4 flex w-full flex-col items-start justify-between gap-4 border-t-[0.5px] py-4 text-xs md:flex-row md:items-center">
        <div className="mb-2 md:mb-0">© 2025 StyleSnap AI</div>
        <nav aria-label="Footer navigation" className="w-full md:w-auto">
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-end">
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-primary focus-ring-primary selection-primary rounded px-1 py-0.5 transition-colors hover:underline focus:outline-none"
                tabIndex={0}
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms-and-conditions"
                className="hover:text-primary focus-ring-primary selection-primary rounded px-1 py-0.5 transition-colors hover:underline focus:outline-none"
                tabIndex={0}
                aria-label="Terms and Conditions"
              >
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/cancellations-and-refunds"
                className="hover:text-primary focus-ring-primary selection-primary rounded px-1 py-0.5 transition-colors hover:underline focus:outline-none"
                tabIndex={0}
                aria-label="Cancellations and Refunds"
              >
                Cancellations &amp; Refunds
              </Link>
            </li>
            <li>
              <Link
                href="/shipping-policy"
                className="hover:text-primary focus-ring-primary selection-primary rounded px-1 py-0.5 transition-colors hover:underline focus:outline-none"
                tabIndex={0}
                aria-label="Shipping Policy"
              >
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-primary focus-ring-primary selection-primary rounded px-1 py-0.5 transition-colors hover:underline focus:outline-none"
                tabIndex={0}
                aria-label="Contact"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};
