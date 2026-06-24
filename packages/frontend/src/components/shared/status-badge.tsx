import { Badge } from '@/components/ui/badge';

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' | 'success' }> = {
  DRAFT: { label: 'Draft', variant: 'secondary' },
  PENDING_APPROVAL: { label: 'Menunggu Persetujuan', variant: 'warning' },
  APPROVED: { label: 'Disetujui', variant: 'default' },
  REJECTED: { label: 'Ditolak', variant: 'destructive' },
  CANCELLED: { label: 'Dibatalkan', variant: 'destructive' },
  COMPLETED: { label: 'Selesai', variant: 'success' },
  IN_PROGRESS: { label: 'Dalam Proses', variant: 'default' },
  PARTIALLY_RECEIVED: { label: 'Diterima Sebagian', variant: 'warning' },
  SENT: { label: 'Terkirim', variant: 'default' },
  PLANNED: { label: 'Direncanakan', variant: 'secondary' },
  PENDING: { label: 'Menunggu', variant: 'warning' },
  VERIFIED: { label: 'Terverifikasi', variant: 'success' },
  REQUESTED: { label: 'Diminta', variant: 'warning' },
  SHIPPED: { label: 'Dikirim', variant: 'default' },
  RECEIVED: { label: 'Diterima', variant: 'success' },
  ACKNOWLEDGED: { label: 'Dikonfirmasi', variant: 'default' },
  PREPARING: { label: 'Disiapkan', variant: 'warning' },
  DELIVERED: { label: 'Terkirim ke Tujuan', variant: 'success' },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] ?? { label: status, variant: 'outline' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
