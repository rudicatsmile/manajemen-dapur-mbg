'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupplierRatingDetail } from '@/hooks/queries/use-supplier-ratings';
import { cn } from '@/lib/utils';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

function scoreColor(score: number) {
  if (score >= 4) return 'bg-green-500';
  if (score >= 3) return 'bg-yellow-500';
  return 'bg-red-500';
}

function scoreTextColor(score: number) {
  if (score >= 4) return 'text-green-600';
  if (score >= 3) return 'text-yellow-600';
  return 'text-red-600';
}

function onTimeStatusBadge(status: string) {
  switch (status) {
    case 'ON_TIME':
      return <Badge variant="success">Tepat Waktu</Badge>;
    case 'LATE':
      return <Badge variant="destructive">Terlambat</Badge>;
    case 'PENDING':
      return <Badge variant="secondary">Belum Diterima</Badge>;
    default:
      return <Badge variant="outline">-</Badge>;
  }
}

export default function SupplierRatingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supplierId = Number(params.id);

  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  const [from, setFrom] = useState(threeMonthsAgo.toISOString().slice(0, 10));
  const [to, setTo] = useState(today.toISOString().slice(0, 10));

  const { data, isLoading } = useSupplierRatingDetail(supplierId, from, to);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Supplier Rating" description="Memuat data..." />
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Memuat data supplier...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Supplier Rating" description="Data tidak ditemukan" />
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </div>
    );
  }

  const radarData = [
    { criteria: 'Ketepatan Waktu', value: data.scores.onTimeDelivery, fullMark: 5 },
    { criteria: 'Kelengkapan', value: data.scores.orderFulfillment, fullMark: 5 },
    { criteria: 'Kualitas', value: data.scores.quality, fullMark: 5 },
    { criteria: 'Harga', value: data.scores.priceCompetitiveness, fullMark: 5 },
  ];

  const scoreCards = [
    { label: 'Ketepatan Waktu', value: data.scores.onTimeDelivery, weight: '30%' },
    { label: 'Kelengkapan Pesanan', value: data.scores.orderFulfillment, weight: '25%' },
    { label: 'Kualitas Barang', value: data.scores.quality, weight: '25%' },
    { label: 'Harga Kompetitif', value: data.scores.priceCompetitiveness, weight: '20%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/pembelian/supplier-rating')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{data.supplierName}</h1>
          <p className="text-muted-foreground">
            {data.category || 'Tanpa kategori'} &middot; {data.totalPOs} PO &middot; {formatCurrency(data.totalValue)}
          </p>
        </div>
        <div className="text-right">
          <div className={cn('text-3xl font-bold', scoreTextColor(data.overallScore))}>
            {data.overallScore.toFixed(1)}
          </div>
          <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
            Skor Keseluruhan
            {data.trend === 'UP' && <ArrowUp className="h-4 w-4 text-green-500" />}
            {data.trend === 'DOWN' && <ArrowDown className="h-4 w-4 text-red-500" />}
            {data.trend === 'STABLE' && <Minus className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="space-y-1">
          <Label htmlFor="from">Dari</Label>
          <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-44" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="to">Sampai</Label>
          <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-44" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Diagram Performa</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="criteria" className="text-xs" />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6} />
                <Radar
                  name="Skor"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rincian Skor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scoreCards.map((sc) => (
              <div key={sc.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{sc.label}</span>
                  <span className="text-muted-foreground">Bobot: {sc.weight}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', scoreColor(sc.value))}
                      style={{ width: `${(sc.value / 5) * 100}%` }}
                    />
                  </div>
                  <span className={cn('text-sm font-bold w-8 text-right', scoreTextColor(sc.value))}>
                    {sc.value.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* PO History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Riwayat Purchase Order</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">No. PO</th>
                  <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                  <th className="px-4 py-3 text-left font-medium">Tgl. Diharapkan</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 text-center font-medium">Ketepatan</th>
                </tr>
              </thead>
              <tbody>
                {data.poHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Tidak ada data PO dalam periode ini.
                    </td>
                  </tr>
                ) : (
                  data.poHistory.map((po) => (
                    <tr key={po.poNumber} className="border-b">
                      <td className="px-4 py-3 font-medium">{po.poNumber}</td>
                      <td className="px-4 py-3">{new Date(po.date).toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-3">
                        {po.expectedDate ? new Date(po.expectedDate).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{po.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">{formatCurrency(po.totalAmount)}</td>
                      <td className="px-4 py-3 text-center">{onTimeStatusBadge(po.onTimeStatus)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Items Supplied */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Barang yang Disuplai</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Nama Barang</th>
                  <th className="px-4 py-3 text-right font-medium">Harga Terakhir</th>
                  <th className="px-4 py-3 text-right font-medium">Rata-rata Pasar</th>
                  <th className="px-4 py-3 text-center font-medium">Perbandingan</th>
                </tr>
              </thead>
              <tbody>
                {data.itemsSupplied.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      Tidak ada data barang.
                    </td>
                  </tr>
                ) : (
                  data.itemsSupplied.map((item) => {
                    let comparison: { label: string; variant: 'success' | 'destructive' | 'secondary' } = {
                      label: 'Satu-satunya',
                      variant: 'secondary',
                    };
                    if (item.avgMarketPrice !== null) {
                      const ratio = item.lastPrice / item.avgMarketPrice;
                      if (ratio < 0.95) comparison = { label: 'Lebih Murah', variant: 'success' };
                      else if (ratio > 1.05) comparison = { label: 'Lebih Mahal', variant: 'destructive' };
                      else comparison = { label: 'Rata-rata', variant: 'secondary' };
                    }
                    return (
                      <tr key={item.itemName} className="border-b">
                        <td className="px-4 py-3 font-medium">{item.itemName}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">{formatCurrency(item.lastPrice)}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {item.avgMarketPrice !== null ? formatCurrency(item.avgMarketPrice) : '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={comparison.variant}>{comparison.label}</Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
