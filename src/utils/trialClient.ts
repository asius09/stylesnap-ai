import { TRIAL_ID_LOCAL_STORAGE_KEY } from "@/constant";
import { setIndexedDB, getIndexedDB } from "@/utils/idb";

/**
 * Ensures a trialId exists in both localStorage and IndexedDB, and on the server.
 * - Checks for trialId in localStorage and IndexedDB.
 * - If both exist and are the same, use it.
 * - If both exist and are different, pick one (prefer localStorage), sync both to match, and use it.
 *   - Also, delete the other (the one not chosen) from the server.
 * - If only one exists, sync to the other.
 * - If neither exists, generate a new one and store in both.
 * - Always sends the trialId to the server to ensure it's registered.
 * Returns the trialId if present, else null.
 */
export async function ensureTrialId() {
  const trialIdLocal = localStorage.getItem(TRIAL_ID_LOCAL_STORAGE_KEY);
  const trialIdIndexedDB = await getIndexedDB(TRIAL_ID_LOCAL_STORAGE_KEY);

  let trialIdToUse: string | null = null;
  let trialIdToDelete: string | null = null;

  // Both exist
  if (trialIdLocal && trialIdIndexedDB) {
    if (trialIdLocal === trialIdIndexedDB) {
      // Both match, all good
      trialIdToUse = trialIdLocal;
    } else {
      // Mismatch: prefer localStorage, sync both to localStorage value
      trialIdToUse = trialIdLocal;
      trialIdToDelete = trialIdIndexedDB;
      await setIndexedDB(TRIAL_ID_LOCAL_STORAGE_KEY, trialIdLocal);
      localStorage.setItem(TRIAL_ID_LOCAL_STORAGE_KEY, trialIdLocal);
      // Only keep warning for mismatch
      console.warn(
        "[ensureTrialId] trialId mismatch between localStorage and IndexedDB. Syncing both to localStorage value:",
        trialIdLocal,
      );
    }
  }
  // Only localStorage exists
  else if (trialIdLocal && !trialIdIndexedDB) {
    trialIdToUse = trialIdLocal;
    await setIndexedDB(TRIAL_ID_LOCAL_STORAGE_KEY, trialIdLocal);
  }
  // Only IndexedDB exists
  else if (!trialIdLocal && trialIdIndexedDB) {
    trialIdToUse = trialIdIndexedDB;
    localStorage.setItem(TRIAL_ID_LOCAL_STORAGE_KEY, trialIdIndexedDB);
    await setIndexedDB(TRIAL_ID_LOCAL_STORAGE_KEY, trialIdIndexedDB); // ensure it's set (could be stringified)
  }
  // Neither exists
  else {
    trialIdToUse = crypto.randomUUID();
    localStorage.setItem(TRIAL_ID_LOCAL_STORAGE_KEY, trialIdToUse);
    await setIndexedDB(TRIAL_ID_LOCAL_STORAGE_KEY, trialIdToUse);
  }

  // Always ensure both are in sync at the end
  if (trialIdToUse) {
    if (localStorage.getItem(TRIAL_ID_LOCAL_STORAGE_KEY) !== trialIdToUse) {
      localStorage.setItem(TRIAL_ID_LOCAL_STORAGE_KEY, trialIdToUse);
    }
    const idbValue = await getIndexedDB(TRIAL_ID_LOCAL_STORAGE_KEY);
    if (idbValue !== trialIdToUse) {
      await setIndexedDB(TRIAL_ID_LOCAL_STORAGE_KEY, trialIdToUse);
    }

    // If we had two and picked one, delete the other from the server
    if (trialIdToDelete && trialIdToDelete !== trialIdToUse) {
      try {
        await fetch("/api/trial", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trialId: trialIdToDelete }),
        });
        // No need to log success here
      } catch (e) {
        console.warn(
          "[ensureTrialId] Failed to delete old trialId from server:",
          e,
        );
      }
    }

    // Always ensure the chosen trialId is registered on the server
    try {
      await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trialId: trialIdToUse }),
      });
    } catch (e) {
      console.warn("[ensureTrialId] Failed to sync trialId to server:", e);
    }
    return trialIdToUse;
  }

  return null;
}

/**
 * Checks the trial usage and payment status for a given trialId.
 *
 * @param trialId {string | null} - The trial ID to check. If null, returns null immediately.
 * @returns {Promise<{hasUsedFreeTrial: boolean, isPaidUser: boolean} | null>} - Returns an object with hasUsedFreeTrial and isPaidUser, or null if trialId is not provided.
 * @throws {Error} - Throws an error if the fetch fails or the response is not successful.
 */
export const getTrialUsageStatus = async (
  trialId: string | null,
): Promise<{ hasUsedFreeTrial: boolean; isPaidUser: boolean } | null> => {
  if (!trialId) return null;

  try {
    const res = await fetch(`/api/trial?trialId=${trialId}`, {
      method: "GET",
    });

    const data = await res.json();

    if (data.success && data.data?.userTrial) {
      const userTrial = data.data.userTrial;
      const hasUsedFreeTrial = userTrial.free_used === true;
      const isPaidUser =
        typeof userTrial.paid_credits === "number" &&
        userTrial.paid_credits > 0;
      return { hasUsedFreeTrial, isPaidUser };
    }

    throw new Error("Error while fetching trial data");
  } catch (error: unknown) {
    throw new Error(
      `[getTrialUsageStatus] Error while checking trial usage/payment status: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
