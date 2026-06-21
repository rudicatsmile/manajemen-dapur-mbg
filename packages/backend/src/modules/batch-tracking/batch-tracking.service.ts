import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class BatchTrackingService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async createBatch(
    itemId: number,
    batchNumber: string,
    expiryDate?: Date,
    receivingItemId?: number,
    qty?: number,
    receivedDate?: Date,
    notes?: string,
  ) {
    const quantity = qty ?? 0;
    return this.prisma.itemBatch.create({
      data: {
        itemId,
        batchNumber,
        expiryDate: expiryDate ?? null,
        receivingItemId: receivingItemId ?? null,
        initialQty: new Decimal(quantity),
        currentQty: new Decimal(quantity),
        status: 'AVAILABLE',
        receivedDate: receivedDate ?? new Date(),
        notes: notes ?? null,
      },
    });
  }

  async getItemBatches(itemId: number) {
    return this.prisma.itemBatch.findMany({
      where: { itemId },
      orderBy: [
        { expiryDate: 'asc' },
        { receivedDate: 'asc' },
      ],
      include: {
        item: { select: { id: true, name: true, sku: true, baseUnitId: true } },
      },
    });
  }

  async getExpiringBatches(days: number = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    cutoff.setHours(23, 59, 59, 999);

    return this.prisma.itemBatch.findMany({
      where: {
        status: 'AVAILABLE',
        expiryDate: { not: null, lte: cutoff },
      },
      orderBy: { expiryDate: 'asc' },
      include: {
        item: { select: { id: true, name: true, sku: true, lastPrice: true } },
      },
    });
  }

  async getDashboard() {
    const now = new Date();
    const in1Day = new Date(now);
    in1Day.setDate(in1Day.getDate() + 1);
    in1Day.setHours(23, 59, 59, 999);
    const in3Days = new Date(now);
    in3Days.setDate(in3Days.getDate() + 3);
    in3Days.setHours(23, 59, 59, 999);
    const in7Days = new Date(now);
    in7Days.setDate(in7Days.getDate() + 7);
    in7Days.setHours(23, 59, 59, 999);

    const [totalActiveBatches, expiredCount, expiringIn7DaysBatches, expiringIn3DaysBatches, expiringIn1DayBatches] = await Promise.all([
      this.prisma.itemBatch.count({ where: { status: 'AVAILABLE' } }),
      this.prisma.itemBatch.count({ where: { status: 'EXPIRED' } }),
      this.prisma.itemBatch.findMany({
        where: { status: 'AVAILABLE', expiryDate: { not: null, lte: in7Days } },
        include: { item: { select: { lastPrice: true } } },
      }),
      this.prisma.itemBatch.count({
        where: { status: 'AVAILABLE', expiryDate: { not: null, lte: in3Days } },
      }),
      this.prisma.itemBatch.count({
        where: { status: 'AVAILABLE', expiryDate: { not: null, lte: in1Day } },
      }),
    ]);

    let atRiskValue = 0;
    for (const batch of expiringIn7DaysBatches) {
      atRiskValue += Number(batch.currentQty) * Number(batch.item.lastPrice);
    }

    return {
      totalActiveBatches,
      expiringIn7Days: expiringIn7DaysBatches.length,
      expiringIn3Days: expiringIn3DaysBatches,
      expiringIn1Day: expiringIn1DayBatches,
      expiredCount,
      atRiskValue: Math.round(atRiskValue),
    };
  }

  async getFifoSuggestion(itemId: number, qty: number) {
    const batches = await this.prisma.itemBatch.findMany({
      where: { itemId, status: 'AVAILABLE', currentQty: { gt: 0 } },
      orderBy: [
        { expiryDate: 'asc' },
        { receivedDate: 'asc' },
      ],
    });

    const suggestions: Array<{
      batchId: number;
      batchNumber: string;
      expiryDate: Date | null;
      allocatedQty: number;
      remainingAfter: number;
    }> = [];

    let remaining = qty;
    for (const batch of batches) {
      if (remaining <= 0) break;
      const available = Number(batch.currentQty);
      const allocated = Math.min(available, remaining);
      suggestions.push({
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        expiryDate: batch.expiryDate,
        allocatedQty: allocated,
        remainingAfter: available - allocated,
      });
      remaining -= allocated;
    }

    return {
      itemId,
      requestedQty: qty,
      fulfilledQty: qty - Math.max(0, remaining),
      shortfall: Math.max(0, remaining),
      suggestions,
    };
  }

  async deductFromBatches(itemId: number, qty: number, tx?: any) {
    const db = tx ?? this.prisma;

    const batches = await db.itemBatch.findMany({
      where: { itemId, status: 'AVAILABLE', currentQty: { gt: 0 } },
      orderBy: [
        { expiryDate: 'asc' },
        { receivedDate: 'asc' },
      ],
    });

    let remaining = qty;
    for (const batch of batches) {
      if (remaining <= 0) break;
      const available = Number(batch.currentQty);

      if (available >= remaining) {
        await db.itemBatch.update({
          where: { id: batch.id },
          data: { currentQty: new Decimal(available - remaining) },
        });
        remaining = 0;
      } else {
        await db.itemBatch.update({
          where: { id: batch.id },
          data: { currentQty: new Decimal(0), status: 'DEPLETED' },
        });
        remaining -= available;
      }
    }

    return { deducted: qty - remaining, shortfall: Math.max(0, remaining) };
  }

  async markExpired(batchId: number, userId: number) {
    const batch = await this.prisma.itemBatch.findUnique({
      where: { id: batchId },
      include: { item: true },
    });
    if (!batch) throw new NotFoundException('Batch tidak ditemukan');
    if (batch.status !== 'AVAILABLE') {
      throw new BadRequestException('Batch sudah tidak aktif');
    }

    const remainingQty = Number(batch.currentQty);
    if (remainingQty <= 0) {
      throw new BadRequestException('Batch sudah tidak memiliki stok');
    }

    return this.prisma.$transaction(async (tx) => {
      // Mark batch as expired
      await tx.itemBatch.update({
        where: { id: batchId },
        data: { currentQty: new Decimal(0), status: 'EXPIRED' },
      });

      // Create waste record
      const waste = await tx.wasteRecord.create({
        data: {
          wasteDate: new Date(),
          itemId: batch.itemId,
          quantity: new Decimal(remainingQty),
          unitId: batch.item.baseUnitId,
          category: 'EXPIRED',
          notes: `Batch ${batch.batchNumber} expired (expiry: ${batch.expiryDate ? batch.expiryDate.toISOString().split('T')[0] : 'N/A'})`,
          createdBy: userId,
        },
      });

      // Update item stock
      const item = await tx.item.findUniqueOrThrow({ where: { id: batch.itemId } });
      const qtyBefore = item.currentStock;
      const qtyChange = new Decimal(remainingQty).neg();
      const qtyAfter = qtyBefore.add(qtyChange);

      await tx.item.update({
        where: { id: batch.itemId },
        data: { currentStock: qtyAfter.lessThan(0) ? new Decimal(0) : qtyAfter },
      });

      // Create stock movement
      await tx.stockMovement.create({
        data: {
          itemId: batch.itemId,
          movementType: 'WST',
          referenceType: 'WASTE',
          referenceId: waste.id,
          qtyBefore,
          qtyChange,
          qtyAfter: qtyAfter.lessThan(0) ? new Decimal(0) : qtyAfter,
          notes: `Expired batch: ${batch.batchNumber}`,
          createdBy: userId,
        },
      });

      return { batch: { id: batchId, batchNumber: batch.batchNumber }, waste };
    });
  }

  async checkExpiryAlerts() {
    const alertLevels = [
      { days: 1, label: 'H-1' },
      { days: 3, label: 'H-3' },
      { days: 7, label: 'H-7' },
    ];

    let totalAlerts = 0;

    for (const level of alertLevels) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + level.days);
      cutoff.setHours(23, 59, 59, 999);

      const batches = await this.prisma.itemBatch.findMany({
        where: {
          status: 'AVAILABLE',
          expiryDate: { not: null, lte: cutoff, gte: new Date() },
          currentQty: { gt: 0 },
        },
        include: { item: { select: { name: true, sku: true } } },
      });

      if (batches.length === 0) continue;

      const title = `Peringatan Expiry ${level.label}: ${batches.length} batch`;
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      // Idempotent check
      const existing = await this.prisma.notification.findFirst({
        where: { type: 'EXPIRY_ALERT', title, createdAt: { gte: todayStart } },
      });
      if (existing) continue;

      const itemNames = batches.slice(0, 5).map(b => b.item.name).join(', ');
      const message = `${batches.length} batch akan expired dalam ${level.days} hari: ${itemNames}${batches.length > 5 ? ` dan ${batches.length - 5} lainnya` : ''}.`;

      for (const role of ['KITCHEN_MANAGER', 'ADMIN']) {
        await this.notificationService.createForRole(
          role,
          'EXPIRY_ALERT',
          title,
          message,
          '/batch-tracking',
          { level: level.label, count: batches.length },
        );
      }
      totalAlerts++;
    }

    return { alertsSent: totalAlerts };
  }

  async autoExpireBatches() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredBatches = await this.prisma.itemBatch.findMany({
      where: {
        status: 'AVAILABLE',
        expiryDate: { not: null, lt: today },
        currentQty: { gt: 0 },
      },
      include: { item: true },
    });

    let count = 0;
    for (const batch of expiredBatches) {
      const remainingQty = Number(batch.currentQty);

      await this.prisma.$transaction(async (tx) => {
        await tx.itemBatch.update({
          where: { id: batch.id },
          data: { currentQty: new Decimal(0), status: 'EXPIRED' },
        });

        const waste = await tx.wasteRecord.create({
          data: {
            wasteDate: new Date(),
            itemId: batch.itemId,
            quantity: new Decimal(remainingQty),
            unitId: batch.item.baseUnitId,
            category: 'EXPIRED',
            notes: `Auto-expired batch ${batch.batchNumber} (expiry: ${batch.expiryDate ? batch.expiryDate.toISOString().split('T')[0] : 'N/A'})`,
            createdBy: 1, // system user
          },
        });

        const item = await tx.item.findUniqueOrThrow({ where: { id: batch.itemId } });
        const qtyBefore = item.currentStock;
        const qtyChange = new Decimal(remainingQty).neg();
        const qtyAfter = qtyBefore.add(qtyChange);

        await tx.item.update({
          where: { id: batch.itemId },
          data: { currentStock: qtyAfter.lessThan(0) ? new Decimal(0) : qtyAfter },
        });

        await tx.stockMovement.create({
          data: {
            itemId: batch.itemId,
            movementType: 'WST',
            referenceType: 'WASTE',
            referenceId: waste.id,
            qtyBefore,
            qtyChange,
            qtyAfter: qtyAfter.lessThan(0) ? new Decimal(0) : qtyAfter,
            notes: `Auto-expired batch: ${batch.batchNumber}`,
            createdBy: 1,
          },
        });
      });

      count++;
    }

    return { expired: count };
  }
}
