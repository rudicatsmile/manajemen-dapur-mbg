'use client';

import { RefreshCw } from 'lucide-react';
import { usePendingSync } from '@/hooks/use-pending-sync';

export function PendingSyncIndicator() {
  const pending = usePendingSync();

  if (pending === 0) return null;

  return (
    <div
      className="flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700"
      title="Data tersimpan offline, menunggu sinkronisasi"
    >
      <RefreshCw className="h-3 w-3" />
      {pending} menunggu sinkron
    </div>
  );
}
