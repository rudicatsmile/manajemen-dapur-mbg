'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Package, AlertTriangle, Activity, Sun, Eye } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useDemandForecast, useGeneratePO } from '@/hooks/queries/use-forecasting';
import { formatRupiah } from '@/lib/utils';

interface ForecastItem {
  itemId: number;
  itemName: string;
  sku: string;
  categoryName: string;
  unit: string;
  currentStock: number;
  minStock: number;
  predictedDemand: number;
  dailyAverage: number;
  safetyStock: number;
  totalNeeded: number;
  shortage: number;
  confidence: string;
  seasonalFactors: Array<{ name: string }>;
}

const confidenceBadge = (confidence: string) => {
  switch (confidence) {
    case 'TINGGI':
      return <Badge variant="success">Tinggi</Badge>;
    case 'SEDANG':
      return <Badge variant="warning">Sedang</Badge>;
    case 'RENDAH':
      return <Badge variant="destructive">Rendah</Badge>;
    default:
      return <Badge variant="outline">{confidence}</Badge>;
  }
};

export default function ForecastingPage() {
  const [horizon, setHorizon] = useState(7);
  const { data: items, isLoading } = useDemandForecast(horizon);
  const generatePO = useGeneratePO();

  const forecast: ForecastItem[] = Array.isArray(items) ? items : [];
  const sorted = [...forecast].sort((a, b) => b.shortage - a.shortage);

  const totalItems = forecast.length;
  const needRestock = forecast.filter((i) => i.shortage > 0).length;
  const confidenceCounts = forecast.reduce(
    (acc, i) => {
      const key = i.confidence === 'TINGGI' ? 'high' : i.confidence === 'SEDANG' ? 'medium' : 'low';
      acc[key]++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 } as Record<string, number>,
  );
  const seasonalActive = forecast.filter((i) => i.seasonalFactors && i.seasonalFactors.length > 0).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prediksi Kebutuhan Bahan"
        description="Analisis prediksi kebutuhan bahan baku berdasarkan data historis konsumsi"
      />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={String(horizon)} onValueChange={(v) => setHorizon(Number(v))}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 Hari</SelectItem>
            <SelectItem value="14">14 Hari</SelectItem>
            <SelectItem value="30">30 Hari</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2 ml-auto">
          <Button variant="outline" asChild>
            <Link href="/produksi/forecasting/akurasi">
              <Activity className="mr-2 h-4 w-4" />
              Akurasi Prediksi
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={needRestock === 0 || generatePO.isPending}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {generatePO.isPending ? 'Membuat PO...' : 'Generate Draft PO'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Generate Draft PO</AlertDialogTitle>
                <AlertDialogDescription>
                  Ini akan membuat Draft PO untuk semua item yang kekurangan stok dalam {horizon} hari ke depan.
                  Total {needRestock} item perlu di-restock. Lanjutkan?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => generatePO.mutate(horizon)}>
                  Ya, Buat Draft PO
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Generate PO result */}
      {generatePO.data && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <p className="text-sm text-green-800">
              <strong>{generatePO.data.createdPOs.length} PO</strong> dibuat untuk{' '}
              <strong>{generatePO.data.totalItems} item</strong>, total{' '}
              <strong>{formatRupiah(generatePO.data.totalValue)}</strong>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Item Diprediksi</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{totalItems}</p>}
          </CardContent>
        </Card>
        <Card className={needRestock > 0 ? 'border-red-200' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Item Perlu Restock</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${needRestock > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className={`text-2xl font-bold ${needRestock > 0 ? 'text-red-600' : ''}`}>{needRestock}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Confidence</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs text-green-600 font-medium">{confidenceCounts.high} Tinggi</span>
                <span className="text-xs text-yellow-600 font-medium">{confidenceCounts.medium} Sedang</span>
                <span className="text-xs text-red-600 font-medium">{confidenceCounts.low} Rendah</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Faktor Musiman Aktif</CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{seasonalActive}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Main table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Stok Saat Ini</TableHead>
                  <TableHead className="text-right">Prediksi {horizon} Hari</TableHead>
                  <TableHead className="text-right">Safety Stock</TableHead>
                  <TableHead className="text-right">Total Dibutuhkan</TableHead>
                  <TableHead className="text-right">Kekurangan</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Musiman</TableHead>
                  <TableHead className="w-[60px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 10 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : sorted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      Tidak ada data prediksi
                    </TableCell>
                  </TableRow>
                ) : (
                  sorted.map((item) => (
                    <TableRow
                      key={item.itemId}
                      className={item.shortage > 0 ? 'bg-red-50/50' : ''}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.itemName}</p>
                          <p className="text-xs text-muted-foreground">{item.sku}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.categoryName}</TableCell>
                      <TableCell className="text-right">
                        {Number(item.currentStock).toFixed(1)} {item.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(item.predictedDemand).toFixed(1)} {item.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(item.safetyStock).toFixed(1)} {item.unit}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {Number(item.totalNeeded).toFixed(1)} {item.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.shortage > 0 ? (
                          <span className="text-red-600 font-semibold">
                            {Number(item.shortage).toFixed(1)} {item.unit}
                          </span>
                        ) : (
                          <span className="text-green-600 font-medium">Cukup</span>
                        )}
                      </TableCell>
                      <TableCell>{confidenceBadge(item.confidence)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.seasonalFactors && item.seasonalFactors.length > 0 ? (
                            item.seasonalFactors.map((f, idx) => (
                              <Badge key={idx} variant="outline" className="text-[10px] px-1.5 py-0">
                                {f.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/produksi/forecasting/${item.itemId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
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
