'use client';

import { use } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { usePurchaseOrder, useApprovePurchaseOrder, useRejectPurchaseOrder, useCancelPurchaseOrder } from '@/hooks/queries/use-purchase-orders';
import { useAuthStore } from '@/stores/auth-store';
import { formatRupiah, formatDate } from '@/lib/utils';

export default function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const poId = Number(id);
  const { data: po, isLoading } = usePurchaseOrder(poId);
  const approve = useApprovePurchaseOrder();
  const reject = useRejectPurchaseOrder();
  const cancel = useCancelPurchaseOrder();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'OWNER' || user?.role === 'ADMIN';

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;
  if (!po) return <div>PO tidak ditemukan</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`PO ${po.poNumber}`}
        description={`Detail purchase order`}
        action={<StatusBadge status={po.status} />}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Informasi PO</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Supplier:</span> <span className="font-medium">{po.supplier?.name}</span></div>
            <div><span className="text-muted-foreground">Tanggal:</span> <span className="font-medium">{formatDate(po.poDate)}</span></div>
            {po.expectedDate && <div><span className="text-muted-foreground">Diharapkan:</span> <span className="font-medium">{formatDate(po.expectedDate)}</span></div>}
            <div><span className="text-muted-foreground">Total:</span> <span className="font-medium">{formatRupiah(po.totalAmount)}</span></div>
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
                {po.items?.map((item: { id: number; item?: { name: string }; quantity: number; unit?: { name: string }; unitPrice: number }) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.item?.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unit?.name}</TableCell>
                    <TableCell>{formatRupiah(item.unitPrice)}</TableCell>
                    <TableCell>{formatRupiah(item.quantity * item.unitPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {(po.status === 'PENDING_APPROVAL' && isAdmin) && (
        <div className="flex gap-2">
          <ConfirmDialog title="Setujui PO?" description="PO akan disetujui dan bisa diproses." onConfirm={() => approve.mutate(poId)}>
            <Button>Setujui</Button>
          </ConfirmDialog>
          <ConfirmDialog title="Tolak PO?" description="PO akan ditolak." onConfirm={() => reject.mutate(poId)} variant="destructive">
            <Button variant="destructive">Tolak</Button>
          </ConfirmDialog>
        </div>
      )}
      {(po.status === 'DRAFT' || po.status === 'PENDING_APPROVAL') && (
        <ConfirmDialog title="Batalkan PO?" description="PO akan dibatalkan." onConfirm={() => cancel.mutate(poId)} variant="destructive">
          <Button variant="outline">Batalkan PO</Button>
        </ConfirmDialog>
      )}
    </div>
  );
}
