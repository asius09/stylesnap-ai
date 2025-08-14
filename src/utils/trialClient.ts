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
  let trialIdLocal = localStorage.getItem(TRIAL_ID_LOCAL_STORAGE_KEY);
  let trialIdIndexedDB = await getIndexedDB(TRIAL_ID_LOCAL_STORAGE_KEY);

  console.log("[ensureTrialId] trialId from localStorage:", trialIdLocal);
  console.log("[ensureTrialId] trialId from IndexedDB:", trialIdIndexedDB);

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
    console.log(
      "[ensureTrialId] trialId only in localStorage. Synced to IndexedDB:",
      trialIdLocal,
    );
  }
  // Only IndexedDB exists
  else if (!trialIdLocal && trialIdIndexedDB) {
    trialIdToUse = trialIdIndexedDB;
    localStorage.setItem(TRIAL_ID_LOCAL_STORAGE_KEY, trialIdIndexedDB);
    await setIndexedDB(TRIAL_ID_LOCAL_STORAGE_KEY, trialIdIndexedDB); // ensure it's set (could be stringified)
    console.log(
      "[ensureTrialId] trialId only in IndexedDB. Synced to localStorage:",
      trialIdIndexedDB,
    );
  }
  // Neither exists
  else {
    trialIdToUse = crypto.randomUUID();
    localStorage.setItem(TRIAL_ID_LOCAL_STORAGE_KEY, trialIdToUse);
    await setIndexedDB(TRIAL_ID_LOCAL_STORAGE_KEY, trialIdToUse);
    console.log(
      "[ensureTrialId] No trialId found. Generated new trialId:",
      trialIdToUse,
    );
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
        console.log(
          "[ensureTrialId] Deleted old trialId from server:",
          trialIdToDelete,
        );
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
 * Checks if the free trial has been used for a given trialId.
 *
 * @param trialId {string | null} - The trial ID to check. If null, returns null immediately.
 * @returns {Promise<boolean | null>} - Returns true if free_used is true, false if not, or null if trialId is not provided.
 * @throws {Error} - Throws an error if the fetch fails or the response is not successful.
 */
export const checkTrialFreeUsed = async (
  trialId: string | null,
): Promise<boolean | null> => {
  // If no trialId is provided, return null early
  if (!trialId) return null;

  try {
    // Make a GET request to the /api/trial endpoint to fetch the user trial data
    const res = await fetch(`/api/trial?trialId=${trialId}`, {
      method: "GET",
    });

    // Parse the JSON response
    const data = await res.json();

    // Check if the response indicates success
    if (data.statusCode === 200 && data.status === "successful") {
      const userTrial = data.userTrial;
      // Return true if free_used is true, otherwise false
      return userTrial.free_used === true;
    }

    // If the response is not successful, throw an error
    throw new Error("Error while fetching trial data");
  } catch (error: unknown) {
    // Catch any errors and throw a new error with a descriptive message
    throw new Error(
      "[checkTrialFreeUsed] Error while checking free_used status",
    );
  }
};
