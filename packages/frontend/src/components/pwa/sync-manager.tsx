'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { replayAll, listPending } from '@/lib/offline-outbox';

/**
 * Mengelola replay outbox offline:
 * - saat browser kembali online (event `online`)
 * - saat service worker mengirim pesan REPLAY_OUTBOX (Background Sync)
 * - sekali saat mount jika ada yang tertunda & sedang online
 */
export function SyncManager() {
  const qc = useQueryClient();
  const running = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (running.current) return;
      if (typeof navigator !== 'undefined' && !navigator.onLine) return;
      const pending = await listPending();
      if (pending.length === 0) return;

      running.current = true;
      try {
        const { synced } = await replayAll();
        if (synced > 0) {
          qc.invalidateQueries({ queryKey: ['opnames'] });
          qc.invalidateQueries({ queryKey: ['productions'] });
          qc.invalidateQueries({ queryKey: ['stock'] });
          qc.invalidateQueries({ queryKey: ['items'] });
          toast.success(`${synced} data offline berhasil disinkronkan`);
        }
      } finally {
        running.current = false;
      }
    };

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'REPLAY_OUTBOX') run();
    };

    run(); // coba sinkron saat mount
    window.addEventListener('online', run);
    navigator.serviceWorker?.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('online', run);
      navigator.serviceWorker?.removeEventListener('message', onMessage);
    };
  }, [qc]);

  return null;
}
