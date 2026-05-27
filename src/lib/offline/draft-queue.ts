/**
 * IndexedDB-backed offline draft queue for stock notes.
 *
 * When the user is offline at the moment of "Baca catatan", we persist the
 * raw textarea content here so they can pick up where they left off once the
 * connection returns. Each draft is read-only metadata plus the raw text —
 * we never store parsed items (those require server-side AI + DB writes).
 *
 * Phase 1 scope: surface the queue on /catat with a "Pulihkan draft" link.
 * Auto-sync (parse+confirm on reconnect) is intentionally deferred — the
 * confirm step needs the user in the loop to correct AI mismatches.
 */

const DB_NAME = 'stockast-offline';
const STORE = 'stock-drafts';
const VERSION = 1;
const MAX_DRAFTS = 5; // BUG-27: cap queue to prevent IndexedDB bloat

export type OfflineDraft = {
  id: number;
  rawInput: string;
  serviceDate: string;
  createdAt: string;
};

export type DraftInput = Pick<OfflineDraft, 'rawInput' | 'serviceDate'>;

function isAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onerror = () => reject(req.error ?? new Error('idb_open_failed'));
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

export async function pushDraft(input: DraftInput): Promise<number | null> {
  if (!isAvailable()) return null;
  const db = await openDb();
  try {
    return await new Promise<number>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      const store = tx.objectStore(STORE);

      // BUG-27: enforce cap — evict oldest entries before adding a new one
      const countReq = store.count();
      countReq.onsuccess = () => {
        const evictCount = countReq.result - MAX_DRAFTS + 1;
        if (evictCount > 0) {
          const cursorReq = store.openCursor();
          let evicted = 0;
          cursorReq.onsuccess = () => {
            const cursor = cursorReq.result;
            if (cursor && evicted < evictCount) {
              cursor.delete();
              evicted += 1;
              cursor.continue();
            } else {
              const addReq = store.add({
                rawInput: input.rawInput,
                serviceDate: input.serviceDate,
                createdAt: new Date().toISOString(),
              });
              addReq.onsuccess = () => resolve(addReq.result as number);
              addReq.onerror = () => reject(addReq.error ?? new Error('idb_put_failed'));
            }
          };
          cursorReq.onerror = () => reject(cursorReq.error ?? new Error('idb_cursor_failed'));
        } else {
          const addReq = store.add({
            rawInput: input.rawInput,
            serviceDate: input.serviceDate,
            createdAt: new Date().toISOString(),
          });
          addReq.onsuccess = () => resolve(addReq.result as number);
          addReq.onerror = () => reject(addReq.error ?? new Error('idb_put_failed'));
        }
      };
      countReq.onerror = () => reject(countReq.error ?? new Error('idb_count_failed'));
    });
  } finally {
    db.close();
  }
}

export async function listDrafts(): Promise<OfflineDraft[]> {
  if (!isAvailable()) return [];
  const db = await openDb();
  try {
    return await new Promise<OfflineDraft[]>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve((req.result as OfflineDraft[]) ?? []);
      req.onerror = () => reject(req.error ?? new Error('idb_list_failed'));
    });
  } finally {
    db.close();
  }
}

export async function removeDraft(id: number): Promise<void> {
  if (!isAvailable()) return;
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      const req = tx.objectStore(STORE).delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error('idb_delete_failed'));
    });
  } finally {
    db.close();
  }
}
