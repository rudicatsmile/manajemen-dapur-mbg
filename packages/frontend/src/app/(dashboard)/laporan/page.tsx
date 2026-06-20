'use client';

import { useState } from 'react';
import { ShoppingCart, Package, ChefHat, Trash2, Calculator } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

const reports = [
  { title: 'Laporan Pembelian', desc: 'Rekapitulasi pembelian per periode', icon: ShoppingCart, endpoint: '/reports/purchase' },
  { title: 'Laporan Stok', desc: 'Ringkasan stok dan mutasi', icon: Package, endpoint: '/reports/stock' },
  { title: 'Laporan Produksi', desc: 'Rekapitulasi produksi harian', icon: ChefHat, endpoint: '/reports/production' },
  { title: 'Laporan Waste', desc: 'Rekapitulasi waste per periode', icon: Trash2, endpoint: '/reports/waste' },
  { title: 'Laporan Food Cost', desc: 'Analisis biaya per porsi', icon: Calculator, endpoint: '/reports/food-cost' },
];

export default function ReportPage() {
  const [dates, setDates] = useState<Record<string, { start: string; end: string }>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const handleGenerate = async (endpoint: string) => {
    const d = dates[endpoint] ?? { start: '', end: '' };
    if (!d.start || !d.end) {
      toast.error('Pilih tanggal mulai dan akhir');
      return;
    }
    setLoading(endpoint);
    try {
      const res = await apiClient.get(endpoint, {
        params: { startDate: d.start, endDate: d.end },
        responseType: 'blob',
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Laporan berhasil diunduh');
    } catch {
      toast.error('Gagal mengunduh laporan');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Laporan" description="Unduh laporan dalam format PDF" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.endpoint}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2"><r.icon className="h-5 w-5 text-primary" /></div>
                <div>
                  <CardTitle className="text-base">{r.title}</CardTitle>
                  <CardDescription>{r.desc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Dari</Label>
                  <Input type="date" value={dates[r.endpoint]?.start ?? ''} onChange={(e) => setDates((prev) => ({ ...prev, [r.endpoint]: { ...prev[r.endpoint], start: e.target.value, end: prev[r.endpoint]?.end ?? '' } }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Sampai</Label>
                  <Input type="date" value={dates[r.endpoint]?.end ?? ''} onChange={(e) => setDates((prev) => ({ ...prev, [r.endpoint]: { start: prev[r.endpoint]?.start ?? '', end: e.target.value } }))} />
                </div>
              </div>
              <Button className="w-full" size="sm" onClick={() => handleGenerate(r.endpoint)} disabled={loading === r.endpoint}>
                {loading === r.endpoint ? 'Mengunduh...' : 'Unduh PDF'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
