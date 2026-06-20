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
import { useSupplierList } from '@/hooks/queries/use-suppliers';

interface Supplier {
  id: number;
  name: string;
  category: string;
  phone: string;
  email: string;
  isActive: boolean;
}

const columns: ColumnDef<Supplier>[] = [
  { accessorKey: 'name', header: 'Nama' },
  { accessorKey: 'category', header: 'Kategori' },
  { accessorKey: 'phone', header: 'Telepon' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'success' : 'secondary'}>
        {row.original.isActive ? 'Aktif' : 'Nonaktif'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild><Link href={`/pembelian/supplier/${row.original.id}`}>Detail</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href={`/pembelian/supplier/${row.original.id}/edit`}>Edit</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function SupplierListPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useSupplierList({ page, perPage, search });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier"
        description="Kelola data supplier"
        action={
          <Button asChild><Link href="/pembelian/supplier/baru"><Plus className="mr-2 h-4 w-4" />Tambah Supplier</Link></Button>
        }
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        currentPage={page}
        totalPages={data?.meta?.totalPages ?? 1}
        perPage={perPage}
        total={data?.meta?.total ?? 0}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari supplier..."
      />
    </div>
  );
}
