import React from "react";
import { SocialIcon } from "./SocialIcon";

export const Footer = () => {
  return (
    <footer
      className="border-primary/50 selection-primary mt-16 flex w-full flex-col items-start justify-center gap-8 border-t-[0.2px] px-4 py-8 text-text-color/80 md:px-24"
      aria-label="Site footer"
    >
      <div className="justify-centre mt-4 mb-10 flex w-full max-w-4xl flex-col items-start gap-16 md:flex-row">
        {/* Name */}
        <div className="flex flex-col items-start">
          <span className="text-primary selection-primary text-2xl font-bold">
            StyleSnap AI
          </span>
          <span className="selection-primary text-base text-text-color/60">
            made by asius with pure energy
          </span>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-start gap-2">
          <span className="selection-primary text-base font-semibold text-text-color/90">
            Contact
          </span>
          <div className="flex items-center gap-3">
            <SocialIcon
              name="x"
              width={8}
              height={8}
              aria-hidden="true"
              className="focus-ring-primary focus:outline-none"
            />
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="focus-ring-primary selection-primary rounded-full focus:outline-none"
              tabIndex={0}
            >
              {/* GitHub is not in SocialIcon, so fallback to svg */}
              <svg
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
                className="hover:text-primary selection-primary focus-ring-primary h-7 w-7 cursor-pointer text-text-color transition-colors duration-200 focus:outline-none"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="focus-ring-primary selection-primary rounded-full focus:outline-none"
              tabIndex={0}
            >
              {/* LinkedIn is not in SocialIcon, so fallback to svg */}
              <svg
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
                className="hover:text-primary selection-primary focus-ring-primary h-7 w-7 cursor-pointer text-text-color transition-colors duration-200 focus:outline-none"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-primary/30 selection-primary mt-4 flex w-full items-start justify-between gap-2 border-t-[0.5px] py-4 text-xs text-text-color/60">
        <div>© 2025 StyleSnap AI</div>
        <div className="flex gap-4">
          <a
            href="/privacy-policy"
            className="hover:text-primary focus-ring-primary selection-primary rounded transition-colors hover:underline focus:outline-none"
            tabIndex={0}
            aria-label="Privacy Policy"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            className="hover:text-primary focus-ring-primary selection-primary rounded transition-colors hover:underline focus:outline-none"
            tabIndex={0}
            aria-label="Terms of Service"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};
