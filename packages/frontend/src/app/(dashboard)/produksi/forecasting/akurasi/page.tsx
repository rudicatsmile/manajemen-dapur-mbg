'use client';

import { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useForecastAccuracy, useReconcileForecasts } from '@/hooks/queries/use-forecasting';

function accuracyColor(val: number): string {
  if (val >= 85) return 'text-green-600';
  if (val >= 70) return 'text-yellow-600';
  return 'text-red-600';
}

function statusBadge(mape: number) {
  if (mape < 15) return <Badge variant="success">Akurat</Badge>;
  if (mape <= 30) return <Badge variant="warning">Cukup</Badge>;
  return <Badge variant="destructive">Perlu Perbaikan</Badge>;
}

interface AccuracyItem {
  itemName: string;
  avgPredicted: number;
  avgActual: number;
  mape: number;
  accuracy: number;
}

export default function AccuracyPage() {
  const router = useRouter();
  const [months, setMonths] = useState(3);
  const { data, isLoading } = useForecastAccuracy(months);
  const reconcile = useReconcileForecasts();

  const overallAccuracy = data ? 100 - Number(data.overallMAPE) : 0;
  const items: AccuracyItem[] = data?.items ?? [];
  const sorted = [...items].sort((a, b) => a.mape - b.mape);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/produksi/forecasting')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Akurasi Prediksi"
          description="Evaluasi ketepatan prediksi kebutuhan bahan dibandingkan konsumsi aktual"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={String(months)} onValueChange={(v) => setMonths(Number(v))}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Bulan</SelectItem>
            <SelectItem value="3">3 Bulan</SelectItem>
            <SelectItem value="6">6 Bulan</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => reconcile.mutate()}
          disabled={reconcile.isPending}
          className="ml-auto"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${reconcile.isPending ? 'animate-spin' : ''}`} />
          {reconcile.isPending ? 'Merekonsiliasi...' : 'Rekonsiliasi'}
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Akurasi Keseluruhan</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className={`text-2xl font-bold ${accuracyColor(overallAccuracy)}`}>
                {overallAccuracy.toFixed(1)}%
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">MAPE</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold">{Number(data?.overallMAPE ?? 0).toFixed(1)}%</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Prediksi Dianalisis</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold">{data?.totalForecasts ?? 0}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Accuracy table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Rata-rata Prediksi</TableHead>
                  <TableHead className="text-right">Rata-rata Aktual</TableHead>
                  <TableHead className="text-right">MAPE (%)</TableHead>
                  <TableHead className="text-right">Akurasi (%)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : sorted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Belum ada data akurasi
                    </TableCell>
                  </TableRow>
                ) : (
                  sorted.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.itemName}</TableCell>
                      <TableCell className="text-right">{Number(item.avgPredicted).toFixed(1)}</TableCell>
                      <TableCell className="text-right">{Number(item.avgActual).toFixed(1)}</TableCell>
                      <TableCell className="text-right">{Number(item.mape).toFixed(1)}</TableCell>
                      <TableCell className={`text-right font-medium ${accuracyColor(item.accuracy)}`}>
                        {Number(item.accuracy).toFixed(1)}
                      </TableCell>
                      <TableCell>{statusBadge(item.mape)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
