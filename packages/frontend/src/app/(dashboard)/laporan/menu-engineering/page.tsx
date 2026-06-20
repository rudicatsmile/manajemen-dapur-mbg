'use client';

import { useState, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Star, Puzzle, Tractor, Dog } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/shared/data-table';
import {
  useMenuEngineering,
  type MenuEngineeringItem,
} from '@/hooks/queries/use-menu-engineering';
import { formatRupiah } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CLASSIFICATION_CONFIG = {
  STAR: { label: 'Star', color: '#eab308', icon: Star, recommendation: 'Pertahankan & promosikan' },
  PUZZLE: { label: 'Puzzle', color: '#3b82f6', icon: Puzzle, recommendation: 'Tingkatkan promosi' },
  PLOW_HORSE: { label: 'Plow Horse', color: '#f97316', icon: Tractor, recommendation: 'Optimasi resep / naikkan harga' },
  DOG: { label: 'Dog', color: '#ef4444', icon: Dog, recommendation: 'Pertimbangkan hapus' },
} as const;

function getDefaultDateRange() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as MenuEngineeringItem;
  const config = CLASSIFICATION_CONFIG[data.classification];
  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="font-semibold">{data.recipeName}</p>
      <p className="text-sm text-muted-foreground">{data.category}</p>
      <div className="mt-2 space-y-1 text-sm">
        <p>Volume Produksi: {data.totalProduced}</p>
        <p>Margin/Porsi: {formatRupiah(data.profitPerServing)}</p>
        <p>Biaya/Porsi: {formatRupiah(data.costPerServing)}</p>
        <p>Food Cost: {data.foodCostPercentage}%</p>
        <p>
          Klasifikasi:{' '}
          <span style={{ color: config.color, fontWeight: 600 }}>{config.label}</span>
        </p>
      </div>
    </div>
  );
}

export default function MenuEngineeringPage() {
  const defaults = getDefaultDateRange();
  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);
  const [filterClassification, setFilterClassification] = useState<string>('ALL');

  const { data, isLoading } = useMenuEngineering(from, to);

  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    if (filterClassification === 'ALL') return data.items;
    return data.items.filter((i) => i.classification === filterClassification);
  }, [data?.items, filterClassification]);

  const columns: ColumnDef<MenuEngineeringItem>[] = [
    { accessorKey: 'recipeName', header: 'Menu' },
    { accessorKey: 'category', header: 'Kategori' },
    {
      accessorKey: 'sellingPrice',
      header: 'Harga Jual',
      cell: ({ row }) => formatRupiah(row.original.sellingPrice),
    },
    {
      accessorKey: 'costPerServing',
      header: 'Biaya/Porsi',
      cell: ({ row }) => formatRupiah(row.original.costPerServing),
    },
    {
      accessorKey: 'foodCostPercentage',
      header: 'Food Cost %',
      cell: ({ row }) => {
        const pct = row.original.foodCostPercentage;
        const variant = pct > 40 ? 'destructive' : pct > 30 ? 'warning' : 'success';
        return <Badge variant={variant as 'destructive' | 'warning' | 'success'}>{pct.toFixed(1)}%</Badge>;
      },
    },
    {
      accessorKey: 'profitPerServing',
      header: 'Margin/Porsi',
      cell: ({ row }) => formatRupiah(row.original.profitPerServing),
    },
    {
      accessorKey: 'totalProduced',
      header: 'Volume Produksi',
    },
    {
      accessorKey: 'classification',
      header: 'Klasifikasi',
      cell: ({ row }) => {
        const config = CLASSIFICATION_CONFIG[row.original.classification];
        return (
          <Badge
            style={{ backgroundColor: config.color, color: '#fff' }}
            className="border-0"
          >
            {config.label}
          </Badge>
        );
      },
    },
    {
      id: 'recommendation',
      header: 'Rekomendasi',
      cell: ({ row }) => {
        const config = CLASSIFICATION_CONFIG[row.original.classification];
        return <span className="text-sm">{config.recommendation}</span>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Menu Engineering"
        description="Analisis klasifikasi menu berdasarkan popularitas dan profitabilitas"
      />

      {/* Date Range Filter */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <Label htmlFor="from">Dari</Label>
          <Input
            id="from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-auto"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="to">Sampai</Label>
          <Input
            id="to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-auto"
          />
        </div>
        <div className="space-y-1">
          <Label>Filter Klasifikasi</Label>
          <Select value={filterClassification} onValueChange={setFilterClassification}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua</SelectItem>
              <SelectItem value="STAR">Star</SelectItem>
              <SelectItem value="PUZZLE">Puzzle</SelectItem>
              <SelectItem value="PLOW_HORSE">Plow Horse</SelectItem>
              <SelectItem value="DOG">Dog</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {(
          [
            { key: 'starCount', label: 'Star', color: '#eab308', icon: Star },
            { key: 'puzzleCount', label: 'Puzzle', color: '#3b82f6', icon: Puzzle },
            { key: 'plowHorseCount', label: 'Plow Horse', color: '#f97316', icon: Tractor },
            { key: 'dogCount', label: 'Dog', color: '#ef4444', icon: Dog },
          ] as const
        ).map(({ key, label, color, icon: Icon }) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-5 w-5" style={{ color }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '...' : data?.summary?.[key] ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">menu items</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scatter Chart */}
      {data?.items && data.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Matriks Menu Engineering</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="totalProduced"
                  name="Volume Produksi"
                  label={{ value: 'Volume Produksi', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  type="number"
                  dataKey="profitPerServing"
                  name="Margin/Porsi"
                  label={{ value: 'Margin/Porsi (Rp)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  x={data.thresholds.medianPopularity}
                  stroke="#888"
                  strokeDasharray="5 5"
                  label={{ value: 'Median Popularitas', position: 'top' }}
                />
                <ReferenceLine
                  y={data.thresholds.medianProfit}
                  stroke="#888"
                  strokeDasharray="5 5"
                  label={{ value: 'Median Profit', position: 'right' }}
                />
                <Scatter name="Menu" data={data.items}>
                  {data.items.map((item, index) => (
                    <Cell
                      key={index}
                      fill={CLASSIFICATION_CONFIG[item.classification].color}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredItems}
            isLoading={isLoading}
            searchPlaceholder="Cari menu..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
