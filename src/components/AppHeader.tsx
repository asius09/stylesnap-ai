"use client";
import Link from "next/link";

export function AppHeader() {
  return (
    <nav
      id="app-header"
      className="bg-background/40 border-primary/10 absolute top-0 left-0 z-20 flex h-14 w-full items-center justify-between border-b px-2 py-1 backdrop-blur-md md:h-16 md:px-6 md:py-2"
      role="navigation"
      aria-label="Application Header"
    >
      <Link
        href="/"
        className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-lg font-extrabold tracking-tight text-nowrap text-transparent drop-shadow md:text-xl lg:text-2xl"
        tabIndex={0}
        aria-label="StyleSnap AI Home"
      >
        StyleSnap AI
      </Link>
      <div
        className="bg-primary border-primary/20 selection:bg-primary/50 shrink-0 rounded-2xl border px-3 py-1 text-sm font-semibold text-white shadow-lg selection:text-white"
        aria-live="polite"
        aria-label="Free usage: 0 out of 1"
        tabIndex={0}
      >
        Free{" "}
        <span className="font-mono" aria-label="0 out of 1">
          0/1
        </span>
      </div>
    </nav>
  );
}
