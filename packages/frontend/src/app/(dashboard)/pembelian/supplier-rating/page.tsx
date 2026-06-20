'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupplierRatings, type SupplierRating } from '@/hooks/queries/use-supplier-ratings';
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

function ScoreBar({ score, label }: { score: number; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-muted-foreground w-12 shrink-0">{label}</span>}
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', scoreColor(score))}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <span className={cn('text-xs font-medium w-6 text-right', scoreTextColor(score))}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}

function TrendIcon({ trend }: { trend: SupplierRating['trend'] }) {
  if (trend === 'UP') return <ArrowUp className="h-4 w-4 text-green-500" />;
  if (trend === 'DOWN') return <ArrowDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export default function SupplierRatingPage() {
  const router = useRouter();
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  const [from, setFrom] = useState(threeMonthsAgo.toISOString().slice(0, 10));
  const [to, setTo] = useState(today.toISOString().slice(0, 10));

  const { data: ratings, isLoading } = useSupplierRatings(from, to);

  const sortedRatings = useMemo(
    () => (ratings || []).slice().sort((a, b) => b.overallScore - a.overallScore),
    [ratings],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier Rating"
        description="Evaluasi dan peringkat supplier berdasarkan kinerja pengiriman, kelengkapan pesanan, kualitas barang, dan harga."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter Periode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <Label htmlFor="from">Dari</Label>
              <Input
                id="from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-44"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="to">Sampai</Label>
              <Input
                id="to"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-44"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">#</th>
                  <th className="px-4 py-3 text-left font-medium">Supplier</th>
                  <th className="px-4 py-3 text-left font-medium min-w-[140px]">Skor Keseluruhan</th>
                  <th className="px-4 py-3 text-left font-medium min-w-[120px]">Ketepatan Waktu</th>
                  <th className="px-4 py-3 text-left font-medium min-w-[120px]">Kelengkapan</th>
                  <th className="px-4 py-3 text-left font-medium min-w-[120px]">Kualitas</th>
                  <th className="px-4 py-3 text-left font-medium min-w-[120px]">Harga</th>
                  <th className="px-4 py-3 text-right font-medium">Total PO</th>
                  <th className="px-4 py-3 text-right font-medium">Total Nilai</th>
                  <th className="px-4 py-3 text-center font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                      Memuat data...
                    </td>
                  </tr>
                ) : sortedRatings.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                      Tidak ada data supplier.
                    </td>
                  </tr>
                ) : (
                  sortedRatings.map((r, idx) => (
                    <tr
                      key={r.supplierId}
                      className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => router.push(`/pembelian/supplier-rating/${r.supplierId}`)}
                    >
                      <td className="px-4 py-3 font-medium">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{r.supplierName}</div>
                        {r.category && (
                          <div className="text-xs text-muted-foreground">{r.category}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={cn('text-lg font-bold', scoreTextColor(r.overallScore))}>
                            {r.overallScore.toFixed(1)}
                          </span>
                          <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full', scoreColor(r.overallScore))}
                              style={{ width: `${(r.overallScore / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <ScoreBar score={r.scores.onTimeDelivery} />
                      </td>
                      <td className="px-4 py-3">
                        <ScoreBar score={r.scores.orderFulfillment} />
                      </td>
                      <td className="px-4 py-3">
                        <ScoreBar score={r.scores.quality} />
                      </td>
                      <td className="px-4 py-3">
                        <ScoreBar score={r.scores.priceCompetitiveness} />
                      </td>
                      <td className="px-4 py-3 text-right">{r.totalPOs}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">{formatCurrency(r.totalValue)}</td>
                      <td className="px-4 py-3 text-center">
                        <TrendIcon trend={r.trend} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
