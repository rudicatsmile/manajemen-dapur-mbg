'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { useRecipeList } from '@/hooks/queries/use-recipes';
import { formatRupiah } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RecipeCost {
  id: number;
  name: string;
  category: { name: string };
  estimatedCost: number;
  yieldQuantity: number;
  sellingPrice: number;
}

const columns: ColumnDef<RecipeCost>[] = [
  { accessorKey: 'name', header: 'Resep' },
  { accessorKey: 'category.name', header: 'Kategori' },
  {
    id: 'costPerServing',
    header: 'Biaya/Porsi',
    cell: ({ row }) => {
      const cost = row.original.yieldQuantity > 0 ? row.original.estimatedCost / row.original.yieldQuantity : 0;
      return formatRupiah(cost);
    },
  },
  { accessorKey: 'sellingPrice', header: 'Harga Jual', cell: ({ row }) => formatRupiah(row.original.sellingPrice ?? 0) },
  {
    id: 'foodCost',
    header: 'Food Cost %',
    cell: ({ row }) => {
      const cost = row.original.yieldQuantity > 0 ? row.original.estimatedCost / row.original.yieldQuantity : 0;
      const pct = row.original.sellingPrice > 0 ? (cost / row.original.sellingPrice) * 100 : 0;
      const variant = pct > 40 ? 'destructive' : pct > 30 ? 'warning' : 'success';
      return <Badge variant={variant as 'destructive' | 'warning' | 'success'}>{pct.toFixed(1)}%</Badge>;
    },
  },
  {
    id: 'margin',
    header: 'Margin',
    cell: ({ row }) => {
      const cost = row.original.yieldQuantity > 0 ? row.original.estimatedCost / row.original.yieldQuantity : 0;
      const margin = (row.original.sellingPrice ?? 0) - cost;
      return <span className={cn(margin < 0 && 'text-destructive')}>{formatRupiah(margin)}</span>;
    },
  },
];

export default function FoodCostPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useRecipeList({ page, perPage, search });

  return (
    <div className="space-y-6">
      <PageHeader title="Biaya Per Porsi" description="Analisis food cost setiap resep" />
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} currentPage={page} totalPages={data?.meta?.totalPages ?? 1} perPage={perPage} total={data?.meta?.total ?? 0} onPageChange={setPage} onPerPageChange={setPerPage} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari resep..." />
    </div>
  );
}
