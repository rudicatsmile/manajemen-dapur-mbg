'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { useOpnameList } from '@/hooks/queries/use-opnames';
import { formatDate } from '@/lib/utils';

interface Opname {
  id: number;
  opnameNumber: string;
  opnameDate: string;
  status: string;
  createdBy: { name: string };
  itemCount: number;
}

const columns: ColumnDef<Opname>[] = [
  { accessorKey: 'opnameNumber', header: 'No. Opname' },
  { accessorKey: 'opnameDate', header: 'Tanggal', cell: ({ row }) => formatDate(row.original.opnameDate) },
  { accessorKey: 'itemCount', header: 'Jumlah Item' },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  { accessorKey: 'createdBy.name', header: 'Dibuat Oleh' },
];

export default function OpnameListPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const { data, isLoading } = useOpnameList({ page, perPage });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stok Opname"
        description="Daftar stok opname"
        action={<Button asChild><Link href="/stok/opname/baru"><Plus className="mr-2 h-4 w-4" />Buat Opname</Link></Button>}
      />
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} currentPage={page} totalPages={data?.meta?.totalPages ?? 1} perPage={perPage} total={data?.meta?.total ?? 0} onPageChange={setPage} onPerPageChange={setPerPage} />
    </div>
  );
}
