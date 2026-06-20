'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { useReceivingList } from '@/hooks/queries/use-receivings';
import { formatDate } from '@/lib/utils';

interface Receiving {
  id: number;
  receivingNumber: string;
  purchaseOrder: { poNumber: string };
  receivedDate: string;
  receivedBy: { name: string };
}

const columns: ColumnDef<Receiving>[] = [
  { accessorKey: 'receivingNumber', header: 'No. Penerimaan' },
  { accessorKey: 'purchaseOrder.poNumber', header: 'No. PO' },
  { accessorKey: 'receivedDate', header: 'Tanggal', cell: ({ row }) => formatDate(row.original.receivedDate) },
  { accessorKey: 'receivedBy.name', header: 'Diterima Oleh' },
];

export default function ReceivingListPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useReceivingList({ page, perPage, search });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Penerimaan Barang"
        description="Daftar penerimaan barang"
        action={<Button asChild><Link href="/pembelian/receiving/baru"><Plus className="mr-2 h-4 w-4" />Buat Penerimaan</Link></Button>}
      />
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} currentPage={page} totalPages={data?.meta?.totalPages ?? 1} perPage={perPage} total={data?.meta?.total ?? 0} onPageChange={setPage} onPerPageChange={setPerPage} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari penerimaan..." />
    </div>
  );
}
