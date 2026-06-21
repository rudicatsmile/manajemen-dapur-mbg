'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, AlertTriangle, XCircle, Search } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatRupiah, formatDate } from '@/lib/utils';
import { useItemBatches, useFifoSuggestion, useMarkExpired } from '@/hooks/queries/use-batch-tracking';

interface Batch {
  id: number;
  batchNumber: string;
  expiryDate: string | null;
  initialQty: number;
  currentQty: number;
  status: string;
  receivedDate: string;
  notes: string | null;
}

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

function ProgressBar({ current, initial }: { current: number; initial: number }) {
  const pct = initial > 0 ? (current / initial) * 100 : 0;
  const color = pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{Math.round(pct)}%</span>
    </div>
  );
}

export default function ItemBatchDetailPage() {
  const params = useParams();
  const itemId = Number(params.itemId);
  const { data, isLoading } = useItemBatches(itemId);
  const markExpired = useMarkExpired();

  const [fifoQty, setFifoQty] = useState(0);
  const [showFifo, setShowFifo] = useState(false);
  const { data: fifoData } = useFifoSuggestion(itemId, showFifo ? fifoQty : 0);

  const item = data?.item;
  const batches: Batch[] = data?.batches ?? [];

  const availableBatches = batches.filter((b) => b.status === 'AVAILABLE');
  const totalStock = availableBatches.reduce((sum, b) => sum + b.currentQty, 0);
  const nearExpiry = availableBatches.filter((b) => {
    const days = getDaysUntilExpiry(b.expiryDate);
    return days !== null && days <= 7;
  }).length;

  const firstAvailableId = availableBatches.length > 0 ? availableBatches[0]?.id : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-16" /></CardContent></Card>
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/stok/batch-tracking"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{item?.name ?? 'Item'}</h1>
          <p className="text-muted-foreground">{item?.sku} — Stok saat ini: {item?.currentStock} {item?.baseUnit?.abbreviation}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-950"><Package className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Stok (Batch)</p>
              <p className="text-2xl font-bold">{totalStock} {item?.baseUnit?.abbreviation}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-950"><Package className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Batch Aktif</p>
              <p className="text-2xl font-bold">{availableBatches.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-950"><AlertTriangle className="h-5 w-5 text-orange-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Mendekati Expired</p>
              <p className="text-2xl font-bold text-orange-600">{nearExpiry}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Tanggal Terima</TableHead>
                  <TableHead>Tanggal Expired</TableHead>
                  <TableHead className="text-right">Qty Awal</TableHead>
                  <TableHead className="text-right">Qty Sisa</TableHead>
                  <TableHead>Penggunaan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hari Tersisa</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      Belum ada batch untuk item ini
                    </TableCell>
                  </TableRow>
                ) : (
                  batches.map((batch, idx) => {
                    const days = getDaysUntilExpiry(batch.expiryDate);
                    const isFirstAvailable = batch.id === firstAvailableId;
                    return (
                      <TableRow
                        key={batch.id}
                        className={isFirstAvailable ? 'border-l-4 border-l-primary' : ''}
                      >
                        <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{batch.batchNumber}</span>
                            {isFirstAvailable && (
                              <Badge variant="outline" className="text-[10px] px-1 py-0">
                                FIFO: Pakai duluan
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(batch.receivedDate)}</TableCell>
                        <TableCell>{batch.expiryDate ? formatDate(batch.expiryDate) : 'Tidak ada'}</TableCell>
                        <TableCell className="text-right">{batch.initialQty}</TableCell>
                        <TableCell className="text-right">{batch.currentQty}</TableCell>
                        <TableCell><ProgressBar current={batch.currentQty} initial={batch.initialQty} /></TableCell>
                        <TableCell><StatusBadge status={batch.status} /></TableCell>
                        <TableCell><DaysRemainingBadge days={days} /></TableCell>
                        <TableCell>
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
                                    Batch {batch.batchNumber} (sisa {batch.currentQty}) akan ditandai expired dan dicatat sebagai waste.
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
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* FIFO Suggestion Tool */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Saran FIFO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 max-w-xs">
              <label className="text-sm font-medium mb-1.5 block">Berapa qty yang dibutuhkan?</label>
              <Input
                type="number"
                min={0}
                placeholder="Masukkan qty"
                value={fifoQty || ''}
                onChange={(e) => {
                  setFifoQty(Number(e.target.value));
                  setShowFifo(false);
                }}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFifo(true)}
              disabled={fifoQty <= 0}
            >
              <Search className="h-4 w-4 mr-2" />
              Lihat Saran FIFO
            </Button>
          </div>

          {showFifo && Array.isArray(fifoData) && fifoData.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead>Tanggal Expired</TableHead>
                    <TableHead className="text-right">Qty Dialokasikan</TableHead>
                    <TableHead className="text-right">Sisa Setelah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fifoData.map((suggestion: { batchId: number; batchNumber: string; expiryDate: string | null; allocatedQty: number; remainingAfter: number }) => (
                    <TableRow key={suggestion.batchId}>
                      <TableCell className="font-mono text-sm">{suggestion.batchNumber}</TableCell>
                      <TableCell>{suggestion.expiryDate ? formatDate(suggestion.expiryDate) : '-'}</TableCell>
                      <TableCell className="text-right font-medium">{suggestion.allocatedQty}</TableCell>
                      <TableCell className="text-right">{suggestion.remainingAfter}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {showFifo && Array.isArray(fifoData) && fifoData.length === 0 && (
            <p className="text-sm text-muted-foreground">Stok tidak mencukupi untuk qty yang diminta.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
