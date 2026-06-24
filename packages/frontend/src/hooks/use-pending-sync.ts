'use client';

import { useEffect, useState } from 'react';
import { countPending, OUTBOX_CHANGED_EVENT } from '@/lib/offline-outbox';

/** Jumlah request tertunda di outbox offline. Re-baca saat outbox berubah / koneksi berubah. */
export function usePendingSync(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      countPending().then((n) => {
        if (active) setCount(n);
      });
    };
    refresh();
    window.addEventListener(OUTBOX_CHANGED_EVENT, refresh);
    window.addEventListener('online', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      active = false;
      window.removeEventListener(OUTBOX_CHANGED_EVENT, refresh);
      window.removeEventListener('online', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  return count;
}
