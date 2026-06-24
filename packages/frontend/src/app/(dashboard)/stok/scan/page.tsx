'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ScanLine, Package, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarcodeScanner } from '@/components/shared/barcode-scanner';
import { useItemLookup } from '@/hooks/queries/use-item-lookup';

const MOVEMENT_LABELS: Record<string, string> = {
  RCV: 'Penerimaan', PRD: 'Produksi', ADJ_PLUS: 'Penyesuaian +', ADJ_MINUS: 'Penyesuaian −',
  WST: 'Waste', TRF_OUT: 'Transfer Keluar', TRF_IN: 'Transfer Masuk',
};

export default function ScanItemPage() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const { data: item, isLoading, isError } = useItemLookup(code);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scan Item"
        description="Scan barcode/QR barang untuk melihat stok & histori"
        action={
          <Button onClick={() => setScannerOpen(true)}>
            <ScanLine className="mr-2 h-4 w-4" />Scan
          </Button>
        }
      />

      <BarcodeScanner
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onDetected={(c) => setCode(c)}
        title="Scan Item"
      />

      {!code && (
        <Card>
          <CardContent className="py-16 text-center">
            <ScanLine className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">Tekan tombol <strong>Scan</strong> untuk memindai barang.</p>
          </CardContent>
        </Card>
      )}

      {code && isLoading && (
        <Card><CardContent className="py-10 text-center text-muted-foreground">Mencari item...</CardContent></Card>
      )}

      {code && isError && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-destructive">Item dengan kode <strong>{code}</strong> tidak ditemukan.</p>
            <Button variant="outline" className="mt-4" onClick={() => setScannerOpen(true)}>Scan Lagi</Button>
          </CardContent>
        </Card>
      )}

      {item && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />{item.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><span className="text-sm text-muted-foreground">SKU:</span> <span className="font-medium">{item.sku}</span></div>
                <div><span className="text-sm text-muted-foreground">Barcode:</span> <span className="font-medium">{item.barcode ?? '-'}</span></div>
                <div><span className="text-sm text-muted-foreground">Kategori:</span> <span className="font-medium">{item.category?.name ?? '-'}</span></div>
                <div>
                  <span className="text-sm text-muted-foreground">Stok (cabang aktif):</span>{' '}
                  <span className="font-bold text-lg">{Number(item.currentStock)}</span>{' '}
                  <span className="text-sm text-muted-foreground">{item.baseUnit?.abbreviation}</span>
                  {Number(item.currentStock) <= Number(item.minStock) && (
                    <Badge variant="destructive" className="ml-2">Stok Rendah</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/stok/item/${item.id}`}>Detail Item <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setScannerOpen(true)}>Scan Lagi</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Mutasi Terakhir</CardTitle></CardHeader>
            <CardContent>
              {item.recentMovements.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">Belum ada mutasi.</p>
              ) : (
                <div className="space-y-2">
                  {item.recentMovements.map((m) => (
                    <div key={m.id} className="flex items-center justify-between border-b py-2 text-sm last:border-0">
                      <div>
                        <span className="font-medium">{MOVEMENT_LABELS[m.movementType] ?? m.movementType}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="text-right">
                        <span className={Number(m.qtyChange) >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {Number(m.qtyChange) >= 0 ? '+' : ''}{Number(m.qtyChange)}
                        </span>
                        <span className="ml-2 text-muted-foreground">→ {Number(m.qtyAfter)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
