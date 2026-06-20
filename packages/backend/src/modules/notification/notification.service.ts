import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    type: string,
    title: string,
    message: string,
    link?: string,
    metadata?: any,
  ) {
    return this.prisma.notification.create({
      data: { userId, type, title, message, link, metadata },
    });
  }

  async findAllForUser(
    userId: number,
    page: number,
    perPage: number,
    unreadOnly?: boolean,
  ) {
    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const { skip, take } = paginate(page, perPage);
    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: number, userId: number) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) {
      throw new NotFoundException('Notifikasi tidak ditemukan');
    }
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async createForRole(
    role: string,
    type: string,
    title: string,
    message: string,
    link?: string,
    metadata?: any,
  ) {
    const users = await this.prisma.user.findMany({
      where: { role: role as any, isActive: true },
      select: { id: true },
    });

    if (users.length === 0) return;

    await this.prisma.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        type,
        title,
        message,
        link,
        metadata,
      })),
    });
  }

  private todayStart(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private async alreadyNotifiedToday(type: string, title: string): Promise<boolean> {
    const existing = await this.prisma.notification.findFirst({
      where: { type, title, createdAt: { gte: this.todayStart() } },
    });
    return !!existing;
  }

  async checkLowStock() {
    const lowStockItems = await this.prisma.item.findMany({
      where: {
        isActive: true,
        minStock: { gt: 0 },
      },
    });

    let count = 0;
    for (const item of lowStockItems) {
      if (Number(item.currentStock) > Number(item.minStock)) continue;

      const title = `Stok Rendah: ${item.name}`;
      if (await this.alreadyNotifiedToday('LOW_STOCK', title)) continue;

      const message = `Stok ${item.name} (${item.sku}) saat ini ${Number(item.currentStock)}, di bawah minimum ${Number(item.minStock)}.`;
      for (const role of ['PURCHASER', 'ADMIN']) {
        await this.createForRole(role, 'LOW_STOCK', title, message, '/stok/item');
      }
      count++;
    }

    return { checked: count };
  }

  async checkPendingPO() {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 24);

    const pendingPOs = await this.prisma.purchaseOrder.findMany({
      where: {
        status: 'PENDING_APPROVAL',
        createdAt: { lt: cutoff },
      },
      include: { supplier: { select: { name: true } } },
    });

    let count = 0;
    for (const po of pendingPOs) {
      const title = `PO Menunggu Persetujuan: ${po.poNumber}`;
      if (await this.alreadyNotifiedToday('PO_PENDING', title)) continue;

      const message = `Purchase Order ${po.poNumber} dari ${po.supplier.name} sudah lebih dari 24 jam menunggu persetujuan.`;
      for (const role of ['ADMIN', 'OWNER']) {
        await this.createForRole(role, 'PO_PENDING', title, message, `/pembelian/purchase-order/${po.id}`);
      }
      count++;
    }

    return { checked: count };
  }

  async checkOverduePO() {
    const overduePOs = await this.prisma.purchaseOrder.findMany({
      where: {
        status: { in: ['APPROVED', 'SENT'] },
        expectedDate: { lt: this.todayStart() },
      },
      include: { supplier: { select: { name: true } } },
    });

    let count = 0;
    for (const po of overduePOs) {
      const title = `PO Terlambat: ${po.poNumber}`;
      if (await this.alreadyNotifiedToday('PO_OVERDUE', title)) continue;

      const message = `Purchase Order ${po.poNumber} dari ${po.supplier.name} sudah melewati tanggal pengiriman yang diharapkan.`;
      await this.createForRole('PURCHASER', 'PO_OVERDUE', title, message, `/pembelian/purchase-order/${po.id}`);
      count++;
    }

    return { checked: count };
  }
}
