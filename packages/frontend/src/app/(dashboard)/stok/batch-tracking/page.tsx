'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package, XCircle, Banknote, AlertTriangle, Bell, Eye, Timer,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRupiah, formatDate } from '@/lib/utils';
import {
  useBatchDashboard, useExpiringBatches, useMarkExpired,
  useCheckExpiry, useAutoExpire,
} from '@/hooks/queries/use-batch-tracking';

interface BatchItem {
  id: number;
  itemId: number;
  batchNumber: string;
  expiryDate: string | null;
  currentQty: number;
  initialQty: number;
  status: string;
  receivedDate: string;
  notes: string | null;
  item: {
    id: number;
    name: string;
    sku: string;
    lastPrice: number;
    baseUnit: { abbreviation: string };
  };
}

const FILTER_OPTIONS = [
  { label: 'H-1', value: 1 },
  { label: 'H-3', value: 3 },
  { label: 'H-7', value: 7 },
  { label: 'H-30', value: 30 },
  { label: 'Semua', value: 365 },
] as const;

function getDaysUntilExpiry(expiryDate: string | null): number | null {
  if (!expiryDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function DaysRemainingBadge({ days }: { days: number | null }) {
  if (days === null) return <span className="text-muted-foreground text-xs">Tidak ada</span>;
  if (days < 0) return <Badge variant="destructive">EXPIRED</Badge>;
  if (days === 0) return <Badge variant="destructive">HARI INI</Badge>;
  if (days === 1) return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">1 hari</Badge>;
  if (days <= 3) return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">{days} hari</Badge>;
  if (days <= 7) return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">{days} hari</Badge>;
  return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{days} hari</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'AVAILABLE':
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">AVAILABLE</Badge>;
    case 'EXPIRED':
      return <Badge variant="destructive">EXPIRED</Badge>;
    case 'DEPLETED':
      return <Badge variant="secondary">DEPLETED</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getRowBgClass(days: number | null): string {
  if (days === null) return '';
  if (days <= 1) return 'bg-red-50 dark:bg-red-950/20';
  if (days <= 3) return 'bg-orange-50 dark:bg-orange-950/20';
  return '';
}

export default function BatchTrackingPage() {
  const [filterDays, setFilterDays] = useState(7);
  const { data: dashboard, isLoading: dashLoading } = useBatchDashboard();
  const { data: batches, isLoading: batchesLoading } = useExpiringBatches(filterDays);
  const markExpired = useMarkExpired();
  const checkExpiry = useCheckExpiry();
  const autoExpire = useAutoExpire();

  const batchList: BatchItem[] = Array.isArray(batches) ? batches : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch & Expiry Tracking"
        description="Kelola batch dan tanggal kadaluarsa bahan"
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => checkExpiry.mutate()}
              disabled={checkExpiry.isPending}
            >
              <Bell className="h-4 w-4 mr-2" />
              Cek Expiry Alert
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Proses Expired Otomatis
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Proses Batch Expired?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Semua batch yang sudah melewati tanggal kadaluarsa akan otomatis ditandai expired
                    dan dicatat sebagai waste. Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => autoExpire.mutate()}
                    disabled={autoExpire.isPending}
                  >
                    Ya, Proses
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      {/* Summary Cards */}
      {dashLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-16" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-950"><Package className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total Batch Aktif</p>
                <p className="text-2xl font-bold">{dashboard?.totalActiveBatches ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="rounded-lg bg-red-100 p-3 dark:bg-red-950"><XCircle className="h-5 w-5 text-red-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-red-600">{dashboard?.expiredCount ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-950"><Banknote className="h-5 w-5 text-purple-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Nilai At-Risk</p>
                <p className="text-2xl font-bold">{formatRupiah(dashboard?.atRiskValue ?? 0)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="rounded-lg bg-red-100 p-3 dark:bg-red-950"><Timer className="h-5 w-5 text-red-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Expired Besok (H-1)</p>
                <p className="text-2xl font-bold text-red-600">{dashboard?.expiringIn1Day ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-950"><Timer className="h-5 w-5 text-orange-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Expired 3 Hari (H-3)</p>
                <p className="text-2xl font-bold text-orange-600">{dashboard?.expiringIn3Days ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-950"><Timer className="h-5 w-5 text-yellow-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Expired 7 Hari (H-7)</p>
                <p className="text-2xl font-bold text-yellow-600">{dashboard?.expiringIn7Days ?? 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Separator />

      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        {FILTER_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={filterDays === opt.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterDays(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Expiring Items Table */}
      {batchesLoading ? (
        <Card><CardContent className="pt-6"><Skeleton className="h-64" /></CardContent></Card>
      ) : batchList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Tidak ada batch yang mendekati kadaluarsa</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Batch #</TableHead>
                    <TableHead>Tanggal Terima</TableHead>
                    <TableHead>Tanggal Expired</TableHead>
                    <TableHead>Hari Tersisa</TableHead>
                    <TableHead className="text-right">Sisa Qty</TableHead>
                    <TableHead className="text-right">Nilai</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchList.map((batch) => {
                    const days = getDaysUntilExpiry(batch.expiryDate);
                    const nilai = batch.currentQty * (batch.item?.lastPrice ?? 0);
                    return (
                      <TableRow key={batch.id} className={getRowBgClass(days)}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{batch.item?.name}</p>
                            <p className="text-xs text-muted-foreground">{batch.item?.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{batch.batchNumber}</TableCell>
                        <TableCell>{formatDate(batch.receivedDate)}</TableCell>
                        <TableCell>{batch.expiryDate ? formatDate(batch.expiryDate) : '-'}</TableCell>
                        <TableCell><DaysRemainingBadge days={days} /></TableCell>
                        <TableCell className="text-right">
                          {batch.currentQty} {batch.item?.baseUnit?.abbreviation}
                        </TableCell>
                        <TableCell className="text-right">{formatRupiah(nilai)}</TableCell>
                        <TableCell><StatusBadge status={batch.status} /></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/stok/batch-tracking/${batch.itemId}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            {batch.status === 'AVAILABLE' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Tandai Expired?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Batch {batch.batchNumber} akan ditandai expired dan sisa stok ({batch.currentQty} {batch.item?.baseUnit?.abbreviation}) akan dicatat sebagai waste.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => markExpired.mutate(batch.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Tandai Expired
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
