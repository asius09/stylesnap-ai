"use client";
import { useTrialId } from "@/hooks/useTrialId";
import { getTrialUsageStatus } from "@/utils/trialClient";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AppHeader() {
  const { trialId } = useTrialId();
  const [freeUsed, setFreeUsed] = useState<boolean>(false);
  // const [padiCredits, setPaidCredits] = useState<number>(0); //TODO: plan to implement this
  useEffect(() => {
    const fetchTrialUsageStatus = async () => {
      if (!trialId) return;
      const status = await getTrialUsageStatus(trialId);
      if (status && typeof status.hasUsedFreeTrial === "boolean") {
        setFreeUsed(status.hasUsedFreeTrial);
      }
    };
    fetchTrialUsageStatus();
  }, [trialId]);
  return (
    <nav
      id="app-header"
      className="border-primary/10 bg-background/10 fixed top-0 left-0 z-[1000] flex h-16 w-full items-center justify-center overflow-hidden border-b shadow-[0_2px_8px_0_rgba(120,90,255,0.10),0_1.5px_4px_0_rgba(120,90,255,0.08)_inset] backdrop-blur-xl"
      role="navigation"
      aria-label="Application Header"
    >
      <div className="flex h-full w-full max-w-7xl items-center justify-between px-6">
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

        <span
          className="border-primary/20 bg-primary/90 text-text-color pointer-events-none relative z-10 shrink-0 overflow-hidden rounded-2xl border px-3 py-1 text-sm font-semibold shadow-[0_0_16px_0_rgba(120,90,255,0.22),0_1.5px_8px_0_rgba(120,90,255,0.10)_inset] backdrop-blur-md select-none"
          aria-live="polite"
          aria-label={`Free usage: ${freeUsed ? "1" : "0"} out of 1`}
          tabIndex={-1}
        >
          <span
            aria-hidden="true"
            className="bg-primary/15 pointer-events-none absolute inset-0 z-0 rounded-2xl shadow-[0_0_16px_0_rgba(120,90,255,0.18),0_1.5px_8px_0_rgba(120,90,255,0.08)_inset] backdrop-blur-sm"
          />
          <span className="relative z-10">
            Free{" "}
            <span
              className="font-mono"
              aria-label={`${freeUsed ? "1" : "0"} out of 1`}
            >
              {`${freeUsed ? "1" : "0"}/1`}
            </span>
          </span>
        </span>
      </div>
    </nav>
  );
}
