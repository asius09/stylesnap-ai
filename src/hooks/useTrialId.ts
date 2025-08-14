import { useEffect, useState } from "react";
import { ensureTrialId, checkTrialFreeUsed } from "@/utils/trialClient";

export const useTrialId = () => {
  const [trialId, setTrialId] = useState<string | null>(null);
  const [freeUsed, setFreeUsed] = useState<boolean | null>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const id = await ensureTrialId();
        if (mounted) setTrialId(id);
        if (id) {
          const used = await checkTrialFreeUsed(id);
          if (mounted) setFreeUsed(used);
        } else {
          if (mounted) setFreeUsed(false);
        }
      } catch {
        if (mounted) {
          setTrialId(null);
          setFreeUsed(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { trialId, freeUsed };
};
