'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStockMovements } from '@/hooks/queries/use-stock';
import { formatDate } from '@/lib/utils';

const typeLabels: Record<string, string> = {
  RCV: 'Penerimaan',
  PRD: 'Produksi',
  ADJ_PLUS: 'Penyesuaian (+)',
  ADJ_MINUS: 'Penyesuaian (-)',
  WST: 'Waste',
};

interface Movement {
  id: number;
  item: { name: string };
  type: string;
  quantity: number;
  unit: { abbreviation: string };
  reference: string;
  createdAt: string;
  createdBy: { name: string };
}

const columns: ColumnDef<Movement>[] = [
  { accessorKey: 'createdAt', header: 'Tanggal', cell: ({ row }) => formatDate(row.original.createdAt) },
  { accessorKey: 'item.name', header: 'Item' },
  {
    accessorKey: 'type',
    header: 'Tipe',
    cell: ({ row }) => {
      const t = row.original.type;
      const variant = t === 'RCV' || t === 'ADJ_PLUS' ? 'success' : 'destructive';
      return <Badge variant={variant as 'success' | 'destructive'}>{typeLabels[t] ?? t}</Badge>;
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Qty',
    cell: ({ row }) => `${row.original.quantity > 0 ? '+' : ''}${row.original.quantity} ${row.original.unit?.abbreviation ?? ''}`,
  },
  { accessorKey: 'reference', header: 'Referensi' },
  { accessorKey: 'createdBy.name', header: 'Oleh' },
];

export default function StockMovementsPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data, isLoading } = useStockMovements({ page, perPage, type: type || undefined, startDate: startDate || undefined, endDate: endDate || undefined });

  return (
    <div className="space-y-6">
      <PageHeader title="Mutasi Stok" description="Riwayat pergerakan stok" />
      <div className="flex flex-wrap gap-4">
        <div className="space-y-1">
          <Label className="text-xs">Tipe</Label>
          <Select value={type} onValueChange={(v) => { setType(v === 'ALL' ? '' : v); setPage(1); }}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Semua tipe" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua</SelectItem>
              {Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Dari Tanggal</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-40" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Sampai Tanggal</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40" />
        </div>
      </div>
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} currentPage={page} totalPages={data?.meta?.totalPages ?? 1} perPage={perPage} total={data?.meta?.total ?? 0} onPageChange={setPage} onPerPageChange={setPerPage} />
    </div>
  );
}
