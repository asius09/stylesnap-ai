import { useEffect, useState } from "react";
import { ensureTrialId } from "@/utils/trialClient";

export const useTrialId = () => {
  const [trialId, setTrialId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const id = await ensureTrialId();
        if (mounted) setTrialId(id);
      } catch {
        if (mounted) setTrialId(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { trialId };
};
