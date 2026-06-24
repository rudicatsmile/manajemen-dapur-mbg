'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/status-badge';
import { usePortalOrders } from '@/hooks/queries/use-portal-orders';

const rp = (n: number) => `Rp ${Math.round(Number(n)).toLocaleString('id-ID')}`;
const fDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export default function PortalPurchaseOrderPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('');
  const { data, isLoading } = usePortalOrders({ page, status: status || undefined });

  const rows = (data?.data ?? []) as Array<{
    id: number; poNumber: string; status: string; shipmentStatus: string;
    poDate: string; totalAmount: number; branch?: { name: string };
    items: Array<{ item?: { name: string } }>;
  }>;
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Purchase Order</h1>
        <p className="text-muted-foreground">Daftar PO yang ditujukan ke Anda</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Filter</CardTitle>
          <Select value={status} onValueChange={(v) => { setStatus(v === 'ALL' ? '' : v); setPage(1); }}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Semua Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="APPROVED">Disetujui</SelectItem>
              <SelectItem value="SENT">Terkirim</SelectItem>
              <SelectItem value="PARTIALLY_RECEIVED">Diterima Sebagian</SelectItem>
              <SelectItem value="COMPLETED">Selesai</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Memuat...</div>
          ) : rows.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">Belum ada PO.</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. PO</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Cabang</TableHead>
                    <TableHead>Status PO</TableHead>
                    <TableHead>Pengiriman</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.poNumber}</TableCell>
                      <TableCell>{fDate(po.poDate)}</TableCell>
                      <TableCell>{po.branch?.name ?? '-'}</TableCell>
                      <TableCell><StatusBadge status={po.status} /></TableCell>
                      <TableCell><StatusBadge status={po.shipmentStatus} /></TableCell>
                      <TableCell className="text-right">{rp(po.totalAmount)}</TableCell>
                      <TableCell>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/portal/purchase-order/${po.id}`}><Eye className="h-4 w-4" /></Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
                  <span>Halaman {meta.page} dari {meta.totalPages} ({meta.total} data)</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Sebelumnya</Button>
                    <Button size="sm" variant="outline" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>Berikutnya</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
