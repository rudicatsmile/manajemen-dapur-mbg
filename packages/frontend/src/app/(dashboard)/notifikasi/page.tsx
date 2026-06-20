'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, PackageX, Clock, AlertTriangle, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from '@/hooks/queries/use-notifications';

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay === 1) return 'Kemarin';
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'LOW_STOCK':
      return <PackageX className="h-5 w-5 text-red-500" />;
    case 'PO_PENDING':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'PO_OVERDUE':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
}

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export default function NotifikasiPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const { data, isLoading } = useNotifications(page, unreadOnly);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications: Notification[] = data?.data ?? [];
  const meta = data?.meta;

  const handleClick = (notif: Notification) => {
    if (!notif.isRead) {
      markAsRead.mutate(notif.id);
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifikasi</h1>
          <p className="text-muted-foreground">Kelola semua notifikasi Anda</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAllAsRead.mutate()}
        >
          <Check className="h-4 w-4 mr-2" />
          Tandai semua dibaca
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={!unreadOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => { setUnreadOnly(false); setPage(1); }}
        >
          Semua
        </Button>
        <Button
          variant={unreadOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => { setUnreadOnly(true); setPage(1); }}
        >
          Belum Dibaca
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Memuat...</div>
      ) : notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {unreadOnly ? 'Tidak ada notifikasi yang belum dibaca' : 'Tidak ada notifikasi'}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                !notif.isRead ? 'border-primary/30 bg-accent/30' : ''
              }`}
              onClick={() => handleClick(notif)}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5">{getNotificationIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{notif.title}</p>
                    {!notif.isRead && (
                      <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatRelativeTime(notif.createdAt)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {meta.page} dari {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Selanjutnya
          </Button>
        </div>
      )}
    </div>
  );
}
