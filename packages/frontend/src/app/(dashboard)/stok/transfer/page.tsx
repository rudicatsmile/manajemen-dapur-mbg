'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, ArrowRight, Eye } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { useStockTransferList } from '@/hooks/queries/use-stock-transfers';

interface TransferRow {
  id: number;
  transferNumber: string;
  status: string;
  requestDate: string;
  fromBranch: { id: number; name: string };
  toBranch: { id: number; name: string };
  requester: { id: number; name: string };
  _count: { items: number };
}

export default function StockTransferListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useStockTransferList({ page });

  const columns: ColumnDef<TransferRow>[] = [
    { accessorKey: 'transferNumber', header: 'No. Transfer' },
    {
      id: 'route',
      header: 'Rute',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <span>{row.original.fromBranch.name}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span>{row.original.toBranch.name}</span>
        </div>
      ),
    },
    { id: 'items', header: 'Item', cell: ({ row }) => `${row.original._count.items} item` },
    {
      accessorKey: 'requestDate',
      header: 'Tanggal',
      cell: ({ row }) => new Date(row.original.requestDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/stok/transfer/${row.original.id}`}><Eye className="h-4 w-4" /></Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transfer Stok"
        description="Permintaan dan pemindahan stok antar cabang"
        action={
          <Button onClick={() => router.push('/stok/transfer/baru')}>
            <Plus className="mr-2 h-4 w-4" /> Buat Transfer
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={(data?.data as TransferRow[]) ?? []}
        isLoading={isLoading}
        totalPages={data?.meta?.totalPages}
        currentPage={page}
        total={data?.meta?.total}
        onPageChange={setPage}
      />
    </div>
  );
}
