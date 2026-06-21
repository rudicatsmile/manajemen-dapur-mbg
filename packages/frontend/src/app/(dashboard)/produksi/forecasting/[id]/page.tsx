'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useItemForecast } from '@/hooks/queries/use-forecasting';

const dayLabels: Record<string, string> = {
  Monday: 'Senin',
  Tuesday: 'Selasa',
  Wednesday: 'Rabu',
  Thursday: 'Kamis',
  Friday: 'Jumat',
  Saturday: 'Sabtu',
  Sunday: 'Minggu',
};

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const day = days[d.getDay()] ?? '';
  return `${day} ${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getBarColor(multiplier: number): string {
  if (multiplier > 1) return '#f97316'; // orange
  if (multiplier < 1) return '#3b82f6'; // blue
  return 'hsl(var(--primary))';
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

export default function ItemForecastPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = Number(params.id);
  const [horizon, setHorizon] = useState(14);

  const { data, isLoading } = useItemForecast(itemId, horizon);

  const daily = data?.daily ?? [];
  const dayOfWeek = data?.dayOfWeekPattern ?? [];
  const history = data?.history ?? [];
  const stats = data?.stats;

  const maxDowConsumption = Math.max(...dayOfWeek.map((d: { avgConsumption: number }) => d.avgConsumption), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/produksi/forecasting')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Detail Prediksi Item"
          description={`Analisis prediksi untuk item #${itemId}`}
        />
      </div>

      {/* Horizon selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Horizon:</span>
        <Select value={String(horizon)} onValueChange={(v) => setHorizon(Number(v))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 Hari</SelectItem>
            <SelectItem value="14">14 Hari</SelectItem>
            <SelectItem value="30">30 Hari</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats cards */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Harian</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{Number(stats.mean).toFixed(1)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Standar Deviasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{Number(stats.stdDev).toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Variabilitas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{(Number(stats.cv) * 100).toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Semakin rendah semakin baik</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Safety Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{Number(stats.safetyStock).toFixed(1)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Confidence</CardTitle>
            </CardHeader>
            <CardContent>{confidenceBadge(stats.confidence)}</CardContent>
          </Card>
        </div>
      ) : null}

      {/* Daily Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prediksi Harian</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : daily.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Tidak ada data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatShortDate} fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const d = payload[0]?.payload as { date: string; dayName: string; predictedQty: number; seasonalMultiplier: number } | undefined;
                    if (!d) return null;
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-sm text-sm">
                        <p className="font-medium">{d.dayName} - {formatShortDate(d.date)}</p>
                        <p>Prediksi: {Number(d.predictedQty).toFixed(1)}</p>
                        <p>Faktor musiman: {Number(d.seasonalMultiplier).toFixed(2)}x</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="predictedQty" radius={[4, 4, 0, 0]}>
                  {daily.map((entry: { seasonalMultiplier: number }, idx: number) => (
                    <Cell key={idx} fill={getBarColor(entry.seasonalMultiplier)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Day-of-Week Pattern */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pola per Hari</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : dayOfWeek.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Tidak ada data</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dayOfWeek.map((d: { day: string; avgConsumption: number }) => ({
                  ...d,
                  dayLabel: dayLabels[d.day] ?? d.day,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dayLabel" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const d = payload[0]?.payload as { dayLabel: string; avgConsumption: number } | undefined;
                      if (!d) return null;
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-sm text-sm">
                          <p className="font-medium">{d.dayLabel}</p>
                          <p>Rata-rata: {Number(d.avgConsumption).toFixed(1)}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="avgConsumption" radius={[4, 4, 0, 0]}>
                    {dayOfWeek.map((entry: { avgConsumption: number }, idx: number) => (
                      <Cell
                        key={idx}
                        fill={entry.avgConsumption === maxDowConsumption ? '#f97316' : 'hsl(var(--primary))'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Historical Consumption */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Konsumsi Historis</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : history.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Tidak ada data</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatShortDate} fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const d = payload[0]?.payload as { date: string; qty: number } | undefined;
                      if (!d) return null;
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-sm text-sm">
                          <p className="font-medium">{formatShortDate(d.date)}</p>
                          <p>Konsumsi: {Number(d.qty).toFixed(1)}</p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="qty"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
