'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { useProductionList } from '@/hooks/queries/use-productions';
import { formatDate } from '@/lib/utils';

interface Production {
  id: number;
  productionNumber: string;
  recipe: { name: string };
  productionDate: string;
  plannedQty: number;
  actualQty: number;
  status: string;
}

const columns: ColumnDef<Production>[] = [
  { accessorKey: 'productionNumber', header: 'No. Produksi' },
  { accessorKey: 'recipe.name', header: 'Resep' },
  { accessorKey: 'productionDate', header: 'Tanggal', cell: ({ row }) => formatDate(row.original.productionDate) },
  { accessorKey: 'plannedQty', header: 'Rencana' },
  { accessorKey: 'actualQty', header: 'Aktual' },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
];

export default function ProductionListPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useProductionList({ page, perPage, search });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produksi Harian"
        description="Daftar produksi harian"
        action={<Button asChild><Link href="/produksi/harian/baru"><Plus className="mr-2 h-4 w-4" />Buat Produksi</Link></Button>}
      />
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} currentPage={page} totalPages={data?.meta?.totalPages ?? 1} perPage={perPage} total={data?.meta?.total ?? 0} onPageChange={setPage} onPerPageChange={setPerPage} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari produksi..." />
    </div>
  );
}
