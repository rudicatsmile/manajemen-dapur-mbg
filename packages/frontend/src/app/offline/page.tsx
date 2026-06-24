import { WifiOff } from 'lucide-react';

export const metadata = {
  title: 'Offline — Dapur MBG',
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <WifiOff className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-bold">Anda sedang offline</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Halaman ini belum tersimpan untuk akses offline. Periksa koneksi internet Anda,
        lalu coba lagi. Halaman yang sudah pernah dibuka tetap bisa diakses.
      </p>
    </div>
  );
}
