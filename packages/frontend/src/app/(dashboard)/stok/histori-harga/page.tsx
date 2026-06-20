'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUp, ArrowDown, Package, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePriceSummary, usePriceAlerts } from '@/hooks/queries/use-price-history';
import { formatRupiah } from '@/lib/utils';

export default function PriceHistoryPage() {
  const [page, setPage] = useState(1);
  const { data: summary, isLoading: summaryLoading } = usePriceSummary();
  const { data: alertsData, isLoading: alertsLoading } = usePriceAlerts(page, 20);

  const alerts = alertsData?.data ?? [];
  const meta = alertsData?.meta;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Histori & Alert Harga"
        description="Pantau perubahan harga item dan alert kenaikan harga"
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Item Terlacak</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{summary?.totalTracked ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Harga Naik &gt; 10%</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-red-600">{summary?.priceUp ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Harga Turun &gt; 10%</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-green-600">{summary?.priceDown ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Perubahan</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className={`text-2xl font-bold ${(summary?.avgChange ?? 0) > 0 ? 'text-red-600' : (summary?.avgChange ?? 0) < 0 ? 'text-green-600' : ''}`}>
                {(summary?.avgChange ?? 0) > 0 ? '+' : ''}{summary?.avgChange ?? 0}%
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Price Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Perubahan Harga</CardTitle>
        </CardHeader>
        <CardContent>
          {alertsLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada alert perubahan harga saat ini
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Harga Saat Ini</TableHead>
                    <TableHead className="text-right">Rata-rata 30 Hari</TableHead>
                    <TableHead className="text-right">Perubahan (%)</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert: any) => (
                    <TableRow
                      key={alert.itemId}
                      className={alert.changePercent > 0 ? 'bg-red-50 dark:bg-red-950/20' : 'bg-green-50 dark:bg-green-950/20'}
                    >
                      <TableCell className="font-medium">{alert.itemName}</TableCell>
                      <TableCell className="text-right">{formatRupiah(alert.currentPrice)}</TableCell>
                      <TableCell className="text-right">{formatRupiah(alert.avgPrice)}</TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex items-center gap-1 font-medium ${alert.changePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {alert.changePercent > 0 ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )}
                          {alert.changePercent > 0 ? '+' : ''}{alert.changePercent}%
                        </span>
                      </TableCell>
                      <TableCell>{alert.supplierName}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/stok/histori-harga/${alert.itemId}`}>Detail</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Menampilkan {alerts.length} dari {meta.total} item
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= meta.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Selanjutnya
                    </Button>
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
