'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRecipeList, useDuplicateRecipe } from '@/hooks/queries/use-recipes';
import { formatRupiah } from '@/lib/utils';

interface Recipe {
  id: number;
  name: string;
  category: { name: string };
  yieldQuantity: number;
  yieldUnit: string;
  estimatedCost: number;
  sellingPrice: number;
}

export default function RecipeListPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useRecipeList({ page, perPage, search });
  const duplicate = useDuplicateRecipe();

  const columns: ColumnDef<Recipe>[] = [
    { accessorKey: 'name', header: 'Nama Resep' },
    { accessorKey: 'category.name', header: 'Kategori' },
    { accessorKey: 'yieldQuantity', header: 'Hasil', cell: ({ row }) => `${row.original.yieldQuantity} ${row.original.yieldUnit}` },
    { accessorKey: 'estimatedCost', header: 'Est. Biaya', cell: ({ row }) => formatRupiah(row.original.estimatedCost ?? 0) },
    { accessorKey: 'sellingPrice', header: 'Harga Jual', cell: ({ row }) => formatRupiah(row.original.sellingPrice ?? 0) },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild><Link href={`/produksi/resep/${row.original.id}`}>Detail</Link></DropdownMenuItem>
            <DropdownMenuItem onClick={() => duplicate.mutate(row.original.id)}>Duplikat</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resep"
        description="Kelola resep masakan"
        action={<Button asChild><Link href="/produksi/resep/baru"><Plus className="mr-2 h-4 w-4" />Tambah Resep</Link></Button>}
      />
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} currentPage={page} totalPages={data?.meta?.totalPages ?? 1} perPage={perPage} total={data?.meta?.total ?? 0} onPageChange={setPage} onPerPageChange={setPerPage} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari resep..." />
    </div>
  );
}
