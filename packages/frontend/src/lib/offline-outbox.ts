'use client';

// Outbox berbasis IndexedDB untuk menyimpan request tulis (POST) saat offline,
// lalu di-replay otomatis saat koneksi kembali. Tanpa dependency tambahan.

const DB_NAME = 'mbg-outbox';
const STORE = 'requests';
const DB_VERSION = 1;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const OUTBOX_CHANGED_EVENT = 'mbg-outbox-changed';

function notifyChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(OUTBOX_CHANGED_EVENT));
  }
}

export interface OutboxRecord {
  id?: number;
  path: string; // mis. /stock/opnames
  method: string; // POST
  body: unknown;
  label: string; // teks ramah untuk UI, mis. "Stok Opname"
  token: string | null;
  branchId: string | null;
  createdAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const store = t.objectStore(STORE);
        const request = fn(store);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }),
  );
}

export async function enqueue(input: { path: string; method?: string; body: unknown; label: string }): Promise<void> {
  if (typeof window === 'undefined') return;
  const record: OutboxRecord = {
    path: input.path,
    method: input.method ?? 'POST',
    body: input.body,
    label: input.label,
    token: localStorage.getItem('accessToken'),
    branchId: localStorage.getItem('activeBranch'),
    createdAt: Date.now(),
  };
  await tx('readwrite', (store) => store.add(record));
  notifyChanged();
  // Daftarkan background sync bila tersedia
  try {
    const reg = await navigator.serviceWorker?.ready;
    // @ts-expect-error - sync API tidak ada di typings standar
    await reg?.sync?.register('mbg-outbox-sync');
  } catch {
    /* abaikan — fallback listener online di sync-manager */
  }
}

export async function listPending(): Promise<OutboxRecord[]> {
  if (typeof window === 'undefined') return [];
  return tx<OutboxRecord[]>('readonly', (store) => store.getAll());
}

export async function countPending(): Promise<number> {
  if (typeof window === 'undefined') return 0;
  return tx<number>('readonly', (store) => store.count());
}

async function remove(id: number): Promise<void> {
  await tx('readwrite', (store) => store.delete(id));
}

export interface ReplayResult {
  synced: number;
  failed: number;
}

/** Kirim ulang semua request tertunda. Hapus entry hanya bila HTTP 2xx. */
export async function replayAll(): Promise<ReplayResult> {
  const pending = await listPending();
  let synced = 0;
  let failed = 0;

  for (const rec of pending) {
    if (rec.id === undefined) continue;
    try {
      const res = await fetch(`${API_BASE}${rec.path}`, {
        method: rec.method,
        headers: {
          'Content-Type': 'application/json',
          ...(rec.token ? { Authorization: `Bearer ${rec.token}` } : {}),
          ...(rec.branchId ? { 'X-Branch-Id': rec.branchId } : {}),
        },
        body: JSON.stringify(rec.body),
      });
      if (res.ok) {
        await remove(rec.id);
        synced += 1;
      } else if (res.status >= 400 && res.status < 500 && res.status !== 401) {
        // Error validasi permanen (bukan auth) — buang agar tidak macet selamanya
        await remove(rec.id);
        failed += 1;
      } else {
        // 401 / 5xx / network: biarkan untuk dicoba lagi nanti
        failed += 1;
      }
    } catch {
      failed += 1; // masih offline / network error → tetap di outbox
    }
  }

  if (synced > 0 || failed > 0) notifyChanged();
  return { synced, failed };
}
