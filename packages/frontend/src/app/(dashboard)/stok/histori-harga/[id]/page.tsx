'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useItemPriceHistory, useItemPriceComparison } from '@/hooks/queries/use-price-history';
import { formatRupiah } from '@/lib/utils';

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', '#0891b2'];

export default function PriceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const itemId = Number(id);
  const { data: historyData, isLoading: historyLoading } = useItemPriceHistory(itemId);
  const { data: comparison, isLoading: comparisonLoading } = useItemPriceComparison(itemId);

  const stats = historyData?.stats;
  const chartData = historyData?.chartData ?? [];

  // Group chart data by date, with supplier prices as separate keys
  const supplierNames = Array.from(new Set<string>(chartData.map((d: any) => String(d.supplierName))));
  const groupedByDate = new Map<string, any>();
  for (const point of chartData) {
    if (!groupedByDate.has(point.date)) {
      groupedByDate.set(point.date, { date: point.date });
    }
    groupedByDate.get(point.date)![point.supplierName] = point.price;
  }
  const chartDataGrouped = Array.from(groupedByDate.values());

  const minSupplier = comparison && comparison.length > 0 ? comparison[0] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/stok/histori-harga">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={historyData?.itemName ?? 'Detail Harga Item'}
          description="Histori dan perbandingan harga per supplier"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {historyLoading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Harga Saat Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{formatRupiah(stats?.currentPrice ?? 0)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata 30 Hari</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{formatRupiah(stats?.avgPrice30d ?? 0)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Harga Terendah</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-green-600">{formatRupiah(stats?.minPrice ?? 0)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Harga Tertinggi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-red-600">{formatRupiah(stats?.maxPrice ?? 0)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Perubahan 30 Hari</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-xl font-bold inline-flex items-center gap-1 ${(stats?.priceChange30d ?? 0) > 0 ? 'text-red-600' : (stats?.priceChange30d ?? 0) < 0 ? 'text-green-600' : ''}`}>
                  {(stats?.priceChange30d ?? 0) > 0 ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (stats?.priceChange30d ?? 0) < 0 ? (
                    <ArrowDown className="h-4 w-4" />
                  ) : null}
                  {(stats?.priceChange30d ?? 0) > 0 ? '+' : ''}{stats?.priceChange30d ?? 0}%
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Price Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Harga (6 Bulan Terakhir)</CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : chartDataGrouped.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Belum ada data histori harga
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartDataGrouped}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v) => `Rp ${(v / 1000).toFixed(0)}rb`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [formatRupiah(value), name]}
                  labelFormatter={(label) => `Tanggal: ${label}`}
                />
                <Legend />
                {supplierNames.map((name: string, i: number) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={COLORS[i % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Supplier Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Harga per Supplier</CardTitle>
        </CardHeader>
        <CardContent>
          {comparisonLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !comparison || comparison.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada data perbandingan supplier
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Harga Terakhir</TableHead>
                  <TableHead className="text-right">Rata-rata</TableHead>
                  <TableHead className="text-right">Terendah</TableHead>
                  <TableHead className="text-right">Tertinggi</TableHead>
                  <TableHead>Pembelian Terakhir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparison.map((sup: any) => (
                  <TableRow
                    key={sup.supplierId}
                    className={minSupplier && sup.supplierId === minSupplier.supplierId ? 'bg-green-50 dark:bg-green-950/20' : ''}
                  >
                    <TableCell className="font-medium">
                      {sup.supplierName}
                      {minSupplier && sup.supplierId === minSupplier.supplierId && (
                        <span className="ml-2 text-xs text-green-600 font-medium">Termurah</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{formatRupiah(sup.lastPrice)}</TableCell>
                    <TableCell className="text-right">{formatRupiah(sup.avgPrice)}</TableCell>
                    <TableCell className="text-right">{formatRupiah(sup.minPrice)}</TableCell>
                    <TableCell className="text-right">{formatRupiah(sup.maxPrice)}</TableCell>
                    <TableCell>{sup.lastDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
