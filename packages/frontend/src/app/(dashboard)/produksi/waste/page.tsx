'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWasteList } from '@/hooks/queries/use-wastes';
import { formatDate } from '@/lib/utils';

const categoryLabels: Record<string, string> = {
  EXPIRED: 'Kadaluarsa',
  DAMAGED: 'Rusak',
  SPILLED: 'Tumpah',
  PRODUCTION_LEFTOVER: 'Sisa Produksi',
  OTHER: 'Lainnya',
};

interface Waste {
  id: number;
  item: { name: string };
  quantity: number;
  unit: { abbreviation: string };
  category: string;
  wasteDate: string;
  notes: string;
}

const columns: ColumnDef<Waste>[] = [
  { accessorKey: 'wasteDate', header: 'Tanggal', cell: ({ row }) => formatDate(row.original.wasteDate) },
  { accessorKey: 'item.name', header: 'Item' },
  { accessorKey: 'quantity', header: 'Qty', cell: ({ row }) => `${row.original.quantity} ${row.original.unit?.abbreviation ?? ''}` },
  {
    accessorKey: 'category',
    header: 'Kategori',
    cell: ({ row }) => <Badge variant="outline">{categoryLabels[row.original.category] ?? row.original.category}</Badge>,
  },
  { accessorKey: 'notes', header: 'Catatan' },
];

export default function WasteListPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [category, setCategory] = useState('');
  const { data, isLoading } = useWasteList({ page, perPage, category: category || undefined });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Waste"
        description="Daftar catatan waste/pemborosan"
        action={<Button asChild><Link href="/produksi/waste/baru"><Plus className="mr-2 h-4 w-4" />Catat Waste</Link></Button>}
      />
      <div>
        <Select value={category} onValueChange={(v) => { setCategory(v === 'ALL' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Semua kategori" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua</SelectItem>
            {Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} currentPage={page} totalPages={data?.meta?.totalPages ?? 1} perPage={perPage} total={data?.meta?.total ?? 0} onPageChange={setPage} onPerPageChange={setPerPage} />
    </div>
  );
}
