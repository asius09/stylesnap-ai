"use client";
import Link from "next/link";

export function AppHeader() {
  return (
    <nav
      id="app-header"
      className="border-primary/10 bg-primary/10 fixed top-0 left-0 z-[1000] flex h-16 w-full items-center justify-between border-b px-2 py-1 shadow-[0_4px_32px_0_rgba(120,90,255,0.22),0_1.5px_8px_0_rgba(120,90,255,0.10)_inset] backdrop-blur-xl md:h-16 md:px-24"
      role="navigation"
      aria-label="Application Header"
      style={{ overflow: "hidden" }}
    >
      {/* Glow overlay effect (no gradient, just glow and shine) */}
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none absolute inset-0 z-0 shadow-[0_0_32px_8px_rgba(120,90,255,0.18),0_1.5px_8px_0_rgba(120,90,255,0.08)_inset] backdrop-blur-md"
      />
      <Link
        href="/"
        className="relative z-10 text-lg font-bold tracking-tight text-nowrap text-white drop-shadow md:text-xl lg:text-2xl"
        tabIndex={0}
        aria-label="StyleSnap AI Home"
      >
        StyleSnap AI
      </Link>
      <div
        className="border-primary/20 bg-primary/85 selection:bg-primary/50 relative z-10 shrink-0 rounded-2xl border px-3 py-1 text-sm font-semibold text-white shadow-[0_0_16px_0_rgba(120,90,255,0.22),0_1.5px_8px_0_rgba(120,90,255,0.10)_inset] backdrop-blur-md selection:text-white"
        aria-live="polite"
        aria-label="Free usage: 0 out of 1"
        tabIndex={0}
        style={{ overflow: "hidden" }}
      >
        {/* Glow effect for the badge (no gradient, just glow and shine) */}
        <div
          aria-hidden="true"
          className="bg-primary/15 pointer-events-none absolute inset-0 z-0 rounded-2xl shadow-[0_0_16px_0_rgba(120,90,255,0.18),0_1.5px_8px_0_rgba(120,90,255,0.08)_inset] backdrop-blur-sm"
        />
        <span className="relative z-10">
          Free{" "}
          <span className="font-mono" aria-label="0 out of 1">
            0/1
          </span>
        </span>
      </div>
    </nav>
  );
}
