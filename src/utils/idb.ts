// idb.ts

// Helper to open the DB and ensure the object store exists
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MyAppDB", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("store")) {
        db.createObjectStore("store");
      }
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function setIndexedDB(
  key: string,
  value: unknown,
): Promise<boolean> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("store", "readwrite");
      const store = tx.objectStore("store");
      const req = store.put(value, key);
      req.onsuccess = () => {
        resolve(true);
      };
      req.onerror = () => {
        reject(req.error);
      };
      tx.oncomplete = () => {
        db.close();
      };
      tx.onerror = () => {
        db.close();
      };
      tx.onabort = () => {
        db.close();
      };
    });
  } catch (err) {
    return false;
  }
}

export async function getIndexedDB(
  key: string,
): Promise<string | undefined | null> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("store", "readonly");
      const store = tx.objectStore("store");
      const req = store.get(key);
      req.onsuccess = () => {
        const result = req.result;
        if (result === undefined || result === null) {
          resolve(result);
        } else {
          resolve(typeof result === "string" ? result : JSON.stringify(result));
        }
      };
      req.onerror = () => {
        reject(req.error);
      };
      tx.oncomplete = () => {
        db.close();
      };
      tx.onerror = () => {
        db.close();
      };
      tx.onabort = () => {
        db.close();
      };
    });
  } catch (err) {
    return undefined;
  }
}
