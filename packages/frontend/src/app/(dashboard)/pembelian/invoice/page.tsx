'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInvoiceList } from '@/hooks/queries/use-invoices';
import { formatRupiah, formatDate } from '@/lib/utils';

interface Invoice {
  id: number;
  invoiceNumber: string;
  supplier: { name: string };
  amount: number;
  invoiceDate: string;
  status: string;
  source?: string;
}

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: 'invoiceNumber', header: 'No. Invoice' },
  { accessorKey: 'supplier.name', header: 'Supplier' },
  { accessorKey: 'amount', header: 'Jumlah', cell: ({ row }) => formatRupiah(row.original.amount) },
  { accessorKey: 'invoiceDate', header: 'Tanggal', cell: ({ row }) => formatDate(row.original.invoiceDate) },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  {
    accessorKey: 'source',
    header: 'Sumber',
    cell: ({ row }) =>
      row.original.source === 'SUPPLIER'
        ? <Badge variant="outline" className="text-xs">Dari Supplier</Badge>
        : <span className="text-xs text-muted-foreground">Internal</span>,
  },
];

export default function InvoiceListPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useInvoiceList({ page, perPage, search });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bukti Pembelian"
        description="Daftar bukti pembelian / invoice"
        action={<Button asChild><Link href="/pembelian/invoice/baru"><Plus className="mr-2 h-4 w-4" />Tambah Invoice</Link></Button>}
      />
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} currentPage={page} totalPages={data?.meta?.totalPages ?? 1} perPage={perPage} total={data?.meta?.total ?? 0} onPageChange={setPage} onPerPageChange={setPerPage} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari invoice..." />
    </div>
  );
}
