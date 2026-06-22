'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Loader2 } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BranchComparisonReport } from '@/components/pdf/branch-comparison-report';

interface Row {
  branchId: number;
  branchName: string;
  revenue: number;
  foodCost: number;
  foodCostPercentage: number;
  portions: number;
  wasteValue: number;
  wasteCount: number;
  purchaseTotal: number;
}
interface Totals {
  revenue: number; foodCost: number; foodCostPercentage: number;
  wasteValue: number; purchaseTotal: number; portions: number;
}

const rp = (n: number) => `Rp ${Math.round(n).toLocaleString('id-ID')}`;

// Threshold food cost % (CLAUDE.md): <30 hijau, 30-40 kuning, >40 merah
function fcColor(pct: number) {
  if (pct === 0) return 'text-muted-foreground';
  if (pct < 30) return 'text-green-600';
  if (pct <= 40) return 'text-yellow-600';
  return 'text-red-600';
}

function isoDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export default function BranchComparisonPage() {
  const [from, setFrom] = useState(isoDaysAgo(30));
  const [to, setTo] = useState(isoDaysAgo(0));
  const [downloading, setDownloading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['branch-comparison', from, to],
    queryFn: async () => {
      const res = await apiClient.get('/reports/branch-comparison', { params: { from, to } });
      return res.data.data as { data: Row[]; totals: Totals; period: { from: string; to: string } };
    },
    enabled: !!from && !!to,
  });

  const rows = data?.data ?? [];
  const totals = data?.totals;
  const maxRevenue = Math.max(1, ...rows.map((r) => r.revenue));

  const handleDownload = async () => {
    if (!data || rows.length === 0) {
      toast.error('Tidak ada data untuk diunduh');
      return;
    }
    setDownloading(true);
    try {
      const blob = await pdf(
        <BranchComparisonReport
          data={rows.map((r) => ({
            branchName: r.branchName,
            revenue: r.revenue,
            foodCostPercentage: r.foodCostPercentage,
            wasteValue: r.wasteValue,
            purchaseTotal: r.purchaseTotal,
          }))}
          totals={{
            revenue: totals?.revenue ?? 0,
            foodCostPercentage: totals?.foodCostPercentage ?? 0,
            wasteValue: totals?.wasteValue ?? 0,
            purchaseTotal: totals?.purchaseTotal ?? 0,
          }}
          period={`${from} s/d ${to}`}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `perbandingan-cabang-${from}-${to}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Laporan diunduh');
    } catch {
      toast.error('Gagal membuat PDF');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Perbandingan Cabang"
        description="Bandingkan performa antar cabang: revenue, food cost, waste, pembelian"
        action={
          <Button onClick={handleDownload} disabled={downloading || isLoading}>
            {downloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Unduh PDF
          </Button>
        }
      />

      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 pt-6">
          <div className="space-y-1">
            <Label htmlFor="from">Dari</Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-44" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="to">Sampai</Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-44" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Ringkasan per Cabang</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Memuat...</div>
          ) : rows.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">Tidak ada data pada periode ini.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cabang</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Porsi</TableHead>
                  <TableHead className="text-right">Food Cost %</TableHead>
                  <TableHead className="text-right">Waste</TableHead>
                  <TableHead className="text-right">Pembelian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.branchId}>
                    <TableCell className="font-medium">{r.branchName}</TableCell>
                    <TableCell className="text-right">
                      <div>{rp(r.revenue)}</div>
                      <div className="mt-1 h-1.5 w-full rounded bg-muted">
                        <div className="h-1.5 rounded bg-primary" style={{ width: `${(r.revenue / maxRevenue) * 100}%` }} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{r.portions.toLocaleString('id-ID')}</TableCell>
                    <TableCell className={`text-right font-semibold ${fcColor(r.foodCostPercentage)}`}>
                      {r.foodCostPercentage.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {rp(r.wasteValue)} <span className="text-xs text-muted-foreground">({r.wasteCount})</span>
                    </TableCell>
                    <TableCell className="text-right">{rp(r.purchaseTotal)}</TableCell>
                  </TableRow>
                ))}
                {totals && (
                  <TableRow className="border-t-2 font-semibold">
                    <TableCell>Total / Rata-rata</TableCell>
                    <TableCell className="text-right">{rp(totals.revenue)}</TableCell>
                    <TableCell className="text-right">{totals.portions.toLocaleString('id-ID')}</TableCell>
                    <TableCell className={`text-right ${fcColor(totals.foodCostPercentage)}`}>{totals.foodCostPercentage.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{rp(totals.wasteValue)}</TableCell>
                    <TableCell className="text-right">{rp(totals.purchaseTotal)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
