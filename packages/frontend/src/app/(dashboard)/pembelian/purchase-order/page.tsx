'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePurchaseOrderList } from '@/hooks/queries/use-purchase-orders';
import { formatRupiah, formatDate } from '@/lib/utils';

interface PO {
  id: number;
  poNumber: string;
  supplier: { name: string };
  poDate: string;
  totalAmount: number;
  status: string;
}

const columns: ColumnDef<PO>[] = [
  { accessorKey: 'poNumber', header: 'No. PO' },
  { accessorKey: 'supplier.name', header: 'Supplier' },
  { accessorKey: 'poDate', header: 'Tanggal', cell: ({ row }) => formatDate(row.original.poDate) },
  { accessorKey: 'totalAmount', header: 'Total', cell: ({ row }) => formatRupiah(row.original.totalAmount) },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild><Link href={`/pembelian/purchase-order/${row.original.id}`}>Detail</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const statusTabs = [
  { value: '', label: 'Semua' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING_APPROVAL', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'COMPLETED', label: 'Selesai' },
];

export default function PurchaseOrderListPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { data, isLoading } = usePurchaseOrderList({ page, perPage, search, status: status || undefined });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Order"
        description="Kelola purchase order"
        action={<Button asChild><Link href="/pembelian/purchase-order/baru"><Plus className="mr-2 h-4 w-4" />Buat PO</Link></Button>}
      />
      <Tabs value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
        <TabsList>
          {statusTabs.map((t) => <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>
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
        searchPlaceholder="Cari PO..."
      />
    </div>
  );
}
