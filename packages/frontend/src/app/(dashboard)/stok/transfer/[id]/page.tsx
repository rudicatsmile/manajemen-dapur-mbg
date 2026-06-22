'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, X, Truck, PackageCheck, Ban, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuthStore } from '@/stores/auth-store';
import { useStockTransfer, useTransferAction } from '@/hooks/queries/use-stock-transfers';

interface TItem {
  id: number;
  itemId: number;
  requestedQty: string | number;
  shippedQty: string | number | null;
  receivedQty: string | number | null;
  item: { id: number; name: string; sku: string };
  unit: { abbreviation: string };
}

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

export default function StockTransferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const transferId = parseInt(id, 10);
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const { data: transfer, isLoading } = useStockTransfer(transferId);

  const approve = useTransferAction('approve');
  const reject = useTransferAction('reject');
  const cancel = useTransferAction('cancel');
  const ship = useTransferAction('ship');
  const receive = useTransferAction('receive');
  const anyPending = [approve, reject, cancel, ship, receive].some((m) => m.isPending);

  if (isLoading || !transfer) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">Memuat...</div>;
  }

  const items: TItem[] = transfer.items ?? [];
  const status: string = transfer.status;
  const isApprover = role === 'OWNER' || role === 'ADMIN';
  const isHandler = role === 'OWNER' || role === 'ADMIN' || role === 'KITCHEN_MANAGER';

  const shipBody = { items: items.map((it) => ({ itemId: it.itemId, shippedQty: Number(it.requestedQty) })) };
  const receiveBody = { items: items.map((it) => ({ itemId: it.itemId, receivedQty: Number(it.shippedQty ?? 0) })) };

  return (
    <div className="space-y-6">
      <PageHeader
        title={transfer.transferNumber}
        description="Detail transfer stok antar cabang"
        action={<Button variant="outline" onClick={() => router.push('/stok/transfer')}>Kembali</Button>}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-3 text-base">
              <span>{transfer.fromBranch?.name}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span>{transfer.toBranch?.name}</span>
            </CardTitle>
            <StatusBadge status={status} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Tanggal Permintaan" value={fmtDate(transfer.requestDate)} />
          <Info label="Diminta oleh" value={transfer.requester?.name ?? '-'} />
          <Info label="Disetujui" value={transfer.approver ? `${transfer.approver.name} · ${fmtDate(transfer.approvedAt)}` : '-'} />
          <Info label="Dikirim" value={transfer.shipper ? `${transfer.shipper.name} · ${fmtDate(transfer.shippedAt)}` : '-'} />
          <Info label="Diterima" value={transfer.receiver ? `${transfer.receiver.name} · ${fmtDate(transfer.receivedAt)}` : '-'} />
          {transfer.notes && <Info label="Catatan" value={transfer.notes} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Item Transfer</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Diminta</TableHead>
                <TableHead className="text-right">Dikirim</TableHead>
                <TableHead className="text-right">Diterima</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell>
                    <div className="font-medium">{it.item.name}</div>
                    <div className="text-xs text-muted-foreground">{it.item.sku}</div>
                  </TableCell>
                  <TableCell className="text-right">{Number(it.requestedQty)} {it.unit.abbreviation}</TableCell>
                  <TableCell className="text-right">{it.shippedQty != null ? `${Number(it.shippedQty)} ${it.unit.abbreviation}` : '-'}</TableCell>
                  <TableCell className="text-right">{it.receivedQty != null ? `${Number(it.receivedQty)} ${it.unit.abbreviation}` : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Aksi workflow */}
      {['REQUESTED', 'APPROVED', 'SHIPPED'].includes(status) && (
        <div className="flex flex-wrap justify-end gap-2">
          {status === 'REQUESTED' && isApprover && (
            <>
              <ConfirmButton
                label="Setujui" icon={<Check className="mr-2 h-4 w-4" />}
                title="Setujui transfer ini?" desc="Stok cabang asal akan dicek ketersediaannya."
                disabled={anyPending} onConfirm={() => approve.mutate({ id: transferId })}
              />
              <ConfirmButton
                label="Tolak" variant="destructive" icon={<X className="mr-2 h-4 w-4" />}
                title="Tolak transfer ini?" desc="Permintaan transfer akan ditolak."
                disabled={anyPending} onConfirm={() => reject.mutate({ id: transferId, body: {} })}
              />
            </>
          )}
          {['REQUESTED', 'APPROVED'].includes(status) && (
            <ConfirmButton
              label="Batalkan" variant="outline" icon={<Ban className="mr-2 h-4 w-4" />}
              title="Batalkan transfer ini?" desc="Transfer yang dibatalkan tidak dapat dilanjutkan."
              disabled={anyPending} onConfirm={() => cancel.mutate({ id: transferId })}
            />
          )}
          {status === 'APPROVED' && isHandler && (
            <ConfirmButton
              label="Kirim" icon={<Truck className="mr-2 h-4 w-4" />}
              title="Kirim transfer ini?" desc="Stok akan dikurangi dari cabang asal sesuai jumlah diminta."
              disabled={anyPending} onConfirm={() => ship.mutate({ id: transferId, body: shipBody })}
            />
          )}
          {status === 'SHIPPED' && isHandler && (
            <ConfirmButton
              label="Terima" icon={<PackageCheck className="mr-2 h-4 w-4" />}
              title="Konfirmasi penerimaan?" desc="Stok akan ditambahkan ke cabang tujuan sesuai jumlah dikirim."
              disabled={anyPending} onConfirm={() => receive.mutate({ id: transferId, body: receiveBody })}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function ConfirmButton({
  label, desc, title, icon, variant = 'default', disabled, onConfirm,
}: {
  label: string; desc: string; title: string; icon: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline'; disabled?: boolean; onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} disabled={disabled}>
          {disabled ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : icon}{label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{label}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
