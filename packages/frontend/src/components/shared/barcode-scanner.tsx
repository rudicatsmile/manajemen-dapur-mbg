'use client';

import { useEffect, useRef, useState } from 'react';
import { Keyboard, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BarcodeScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDetected: (code: string) => void;
  title?: string;
}

const READER_ID = 'mbg-barcode-reader';

export function BarcodeScanner({ open, onOpenChange, onDetected, title = 'Scan Barcode / QR' }: BarcodeScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [manual, setManual] = useState('');
  const [manualMode, setManualMode] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scannerRef = useRef<any>(null);
  const detectedRef = useRef(false);

  useEffect(() => {
    if (!open || manualMode) return;
    let cancelled = false;
    detectedRef.current = false;
    setError(null);
    setStarting(true);

    (async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (cancelled) return;
        const scanner = new Html5Qrcode(READER_ID, { verbose: false });
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => {
            if (detectedRef.current) return;
            detectedRef.current = true;
            onDetected(decodedText);
            stop();
            onOpenChange(false);
          },
          () => {
            /* abaikan frame yang gagal decode */
          },
        );
        if (!cancelled) setStarting(false);
      } catch (err) {
        if (cancelled) return;
        setStarting(false);
        setError('Tidak bisa mengakses kamera. Pastikan izin kamera diberikan, atau gunakan input manual.');
        setManualMode(true);
      }
    })();

    return () => {
      cancelled = true;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, manualMode]);

  function stop() {
    const scanner = scannerRef.current;
    if (scanner) {
      scanner
        .stop()
        .then(() => scanner.clear())
        .catch(() => {});
      scannerRef.current = null;
    }
  }

  const handleManualSubmit = () => {
    const code = manual.trim();
    if (!code) return;
    onDetected(code);
    setManual('');
    onOpenChange(false);
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      stop();
      setManualMode(false);
      setManual('');
      setError(null);
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {!manualMode ? (
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-lg border bg-black">
              <div id={READER_ID} className="w-full" />
              {starting && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Arahkan kamera ke barcode/QR pada barang.
            </p>
            <Button variant="outline" className="w-full" onClick={() => { stop(); setManualMode(true); }}>
              <Keyboard className="mr-2 h-4 w-4" />Input Kode Manual
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="space-y-1">
              <label className="text-sm font-medium">Masukkan kode barcode / SKU</label>
              <Input
                autoFocus
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleManualSubmit(); }}
                placeholder="mis. 8991234567890 atau ITM-PRO-0001"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setManualMode(false); setError(null); }}>
                Pakai Kamera
              </Button>
              <Button className="flex-1" onClick={handleManualSubmit} disabled={!manual.trim()}>
                Cari
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
