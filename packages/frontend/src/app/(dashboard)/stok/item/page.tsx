'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useItemList } from '@/hooks/queries/use-items';
import { cn } from '@/lib/utils';

interface Item {
  id: number;
  name: string;
  category: { name: string };
  baseUnit: { name: string; abbreviation: string };
  currentStock: number;
  minStock: number;
}

const columns: ColumnDef<Item>[] = [
  { accessorKey: 'name', header: 'Nama' },
  { accessorKey: 'category.name', header: 'Kategori' },
  {
    accessorKey: 'currentStock',
    header: 'Stok',
    cell: ({ row }) => {
      const isLow = row.original.currentStock <= row.original.minStock;
      return (
        <span className={cn(isLow && 'text-destructive font-bold')}>
          {row.original.currentStock} {row.original.baseUnit?.abbreviation}
        </span>
      );
    },
  },
  {
    accessorKey: 'minStock',
    header: 'Min Stok',
    cell: ({ row }) => `${row.original.minStock} ${row.original.baseUnit?.abbreviation}`,
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const isLow = row.original.currentStock <= row.original.minStock;
      return isLow ? <Badge variant="destructive">Rendah</Badge> : <Badge variant="success">Cukup</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild><Link href={`/stok/item/${row.original.id}/edit`}>Edit</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function ItemListPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useItemList({ page, perPage, search });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Item"
        description="Kelola data item/bahan baku"
        action={<Button asChild><Link href="/stok/item/baru"><Plus className="mr-2 h-4 w-4" />Tambah Item</Link></Button>}
      />
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} currentPage={page} totalPages={data?.meta?.totalPages ?? 1} perPage={perPage} total={data?.meta?.total ?? 0} onPageChange={setPage} onPerPageChange={setPerPage} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari item..." />
    </div>
  );
}
