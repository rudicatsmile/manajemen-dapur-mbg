'use client';

import { use, useState } from 'react';
import { Loader2, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/shared/status-badge';
import { usePortalOrder, useUpdateShipment } from '@/hooks/queries/use-portal-orders';

const rp = (n: number) => `Rp ${Math.round(Number(n)).toLocaleString('id-ID')}`;
const fDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const SHIPMENT_OPTIONS = [
  { value: 'ACKNOWLEDGED', label: 'Dikonfirmasi' },
  { value: 'PREPARING', label: 'Sedang Disiapkan' },
  { value: 'SHIPPED', label: 'Sudah Dikirim' },
  { value: 'DELIVERED', label: 'Sudah Sampai Tujuan' },
];

export default function PortalPODetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const poId = Number(id);
  const { data: po, isLoading } = usePortalOrder(poId);
  const shipment = useUpdateShipment(poId);

  const [shipStatus, setShipStatus] = useState('');
  const [shipNote, setShipNote] = useState('');
  const [shipEta, setShipEta] = useState('');

  const handleShipmentSubmit = () => {
    if (!shipStatus) return;
    shipment.mutate(
      { status: shipStatus as 'ACKNOWLEDGED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED', note: shipNote || undefined, eta: shipEta || undefined },
      { onSuccess: () => { setShipStatus(''); setShipNote(''); setShipEta(''); } },
    );
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;
  if (!po) return <div>PO tidak ditemukan</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">PO {po.poNumber}</h1>
        <div className="flex items-center gap-2 mt-1">
          <StatusBadge status={po.status} />
          <StatusBadge status={po.shipmentStatus} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Informasi PO</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Tanggal:</span> <span className="font-medium">{fDate(po.poDate)}</span></div>
            {po.expectedDate && <div><span className="text-muted-foreground">Diharapkan:</span> <span className="font-medium">{fDate(po.expectedDate)}</span></div>}
            <div><span className="text-muted-foreground">Cabang:</span> <span className="font-medium">{po.branch?.name}</span></div>
            <div><span className="text-muted-foreground">Total:</span> <span className="font-medium">{rp(po.totalAmount)}</span></div>
            {po.notes && <div><span className="text-muted-foreground">Catatan:</span> <span className="font-medium">{po.notes}</span></div>}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Item</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(po.items ?? []).map((item: { id: number; item?: { name: string; sku: string }; quantity: number; unit?: { abbreviation: string }; unitPrice: number; totalPrice: number }) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.item?.name}</TableCell>
                    <TableCell>{Number(item.quantity)}</TableCell>
                    <TableCell>{item.unit?.abbreviation}</TableCell>
                    <TableCell>{rp(Number(item.unitPrice))}</TableCell>
                    <TableCell>{rp(Number(item.totalPrice))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ─── Update Pengiriman ─────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="h-4 w-4" />Update Status Pengiriman
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label>Status *</Label>
              <Select value={shipStatus} onValueChange={setShipStatus}>
                <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                <SelectContent>
                  {SHIPMENT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Estimasi Tiba (opsional)</Label>
              <Input type="date" value={shipEta} onChange={(e) => setShipEta(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Catatan (opsional)</Label>
            <Textarea value={shipNote} onChange={(e) => setShipNote(e.target.value)} placeholder="Mis. akan dikirim besok pagi" />
          </div>
          <Button onClick={handleShipmentSubmit} disabled={!shipStatus || shipment.isPending}>
            {shipment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kirim Update
          </Button>
        </CardContent>
      </Card>

      {/* ─── Riwayat Update ───────────────────────────── */}
      {po.shipmentUpdates && po.shipmentUpdates.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Riwayat Update Pengiriman</CardTitle></CardHeader>
          <CardContent>
            <div className="border-l-2 border-muted pl-4 space-y-3">
              {(po.shipmentUpdates as Array<{ id: number; status: string; note: string | null; eta: string | null; createdAt: string; createdBy?: { name: string } }>).map((u) => (
                <div key={u.id} className="text-sm">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={u.status} />
                    <span className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleString('id-ID')}</span>
                    {u.createdBy && <span className="text-xs text-muted-foreground">oleh {u.createdBy.name}</span>}
                  </div>
                  {u.note && <p className="mt-1 text-muted-foreground">{u.note}</p>}
                  {u.eta && <p className="text-xs text-muted-foreground">ETA: {fDate(u.eta)}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
