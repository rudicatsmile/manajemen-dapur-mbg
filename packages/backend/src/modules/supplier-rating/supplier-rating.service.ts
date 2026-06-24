import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

interface Period {
  from: string;
  to: string;
}

export interface SupplierScore {
  onTimeDelivery: number;
  orderFulfillment: number;
  quality: number;
  priceCompetitiveness: number;
}

export interface SupplierRating {
  supplierId: number;
  supplierName: string;
  category: string | null;
  overallScore: number;
  scores: SupplierScore;
  totalPOs: number;
  totalValue: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

@Injectable()
export class SupplierRatingService {
  constructor(private prisma: PrismaService) {}

  private getDefaultPeriod(): Period {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 3);
    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    };
  }

  private getPreviousPeriod(period: Period): Period {
    const fromDate = new Date(period.from);
    const toDate = new Date(period.to);
    const durationMs = toDate.getTime() - fromDate.getTime();
    const prevTo = new Date(fromDate.getTime() - 1);
    const prevFrom = new Date(prevTo.getTime() - durationMs);
    return {
      from: prevFrom.toISOString().slice(0, 10),
      to: prevTo.toISOString().slice(0, 10),
    };
  }

  private toNumber(val: Decimal | number): number {
    return typeof val === 'number' ? val : Number(val);
  }

  private rateToScore(rate: number): number {
    if (rate <= 0.2) return 1;
    if (rate <= 0.4) return 2;
    if (rate <= 0.6) return 3;
    if (rate <= 0.8) return 4;
    return 5;
  }

  private calcOverall(scores: SupplierScore): number {
    const raw =
      scores.onTimeDelivery * 0.3 +
      scores.orderFulfillment * 0.25 +
      scores.quality * 0.25 +
      scores.priceCompetitiveness * 0.2;
    return Math.round(raw * 10) / 10;
  }

  private async calcScoresForSupplier(
    supplierId: number,
    period: Period,
  ): Promise<{ scores: SupplierScore; totalPOs: number; totalValue: number }> {
    const dateFilter = {
      gte: new Date(period.from),
      lte: new Date(period.to),
    };

    // Get completed POs for this supplier in period
    const pos = await this.prisma.purchaseOrder.findMany({
      where: {
        supplierId,
        status: { in: ['COMPLETED', 'RECEIVED'] },
        poDate: dateFilter,
      },
      include: {
        items: true,
        receivings: true,
      },
    });

    const totalPOs = pos.length;
    const totalValue = pos.reduce((sum, po) => sum + this.toNumber(po.totalAmount), 0);

    // 1. On-time delivery
    let onTimeDelivery = 3;
    if (totalPOs > 0) {
      const posWithExpected = pos.filter((po) => po.expectedDate);
      if (posWithExpected.length > 0) {
        let onTimeCount = 0;
        for (const po of posWithExpected) {
          const lastReceiving = po.receivings.sort(
            (a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime(),
          )[0];
          if (lastReceiving) {
            const received = new Date(lastReceiving.receivedDate);
            const expected = new Date(po.expectedDate!);
            if (received <= expected) onTimeCount++;
          }
        }
        const rate = onTimeCount / posWithExpected.length;
        onTimeDelivery = this.rateToScore(rate);
      }
    }

    // 2. Order fulfillment
    let orderFulfillment = 3;
    if (totalPOs > 0) {
      let totalRate = 0;
      let countedPOs = 0;
      for (const po of pos) {
        const totalOrdered = po.items.reduce((s, i) => s + this.toNumber(i.quantity), 0);
        const totalReceived = po.items.reduce((s, i) => s + this.toNumber(i.receivedQty), 0);
        if (totalOrdered > 0) {
          totalRate += Math.min(totalReceived / totalOrdered, 1);
          countedPOs++;
        }
      }
      if (countedPOs > 0) {
        orderFulfillment = this.rateToScore(totalRate / countedPOs);
      }
    }

    // 3. Quality (based on waste records for items from this supplier)
    let quality = 4;
    if (totalPOs > 0) {
      const itemIds = [...new Set(pos.flatMap((po) => po.items.map((i) => i.itemId)))];
      if (itemIds.length > 0) {
        const [wasteRecords, totalReceived] = await Promise.all([
          this.prisma.wasteRecord.findMany({
            where: {
              itemId: { in: itemIds },
              wasteDate: dateFilter,
            },
          }),
          this.prisma.receivingItem.aggregate({
            where: {
              itemId: { in: itemIds },
              receiving: { receivedDate: dateFilter },
            },
            _sum: { quantity: true },
          }),
        ]);

        const totalWaste = wasteRecords.reduce((s, w) => s + this.toNumber(w.quantity), 0);
        const totalRecvQty = this.toNumber(totalReceived._sum.quantity || 0);

        if (totalRecvQty > 0 && totalWaste > 0) {
          const wasteRatio = totalWaste / totalRecvQty;
          // Lower waste = higher score. 0% waste = 5, 20%+ waste = 1
          if (wasteRatio <= 0.02) quality = 5;
          else if (wasteRatio <= 0.05) quality = 4;
          else if (wasteRatio <= 0.1) quality = 3;
          else if (wasteRatio <= 0.2) quality = 2;
          else quality = 1;
        }
      }
    }

    // 4. Price competitiveness
    let priceCompetitiveness = 3;
    if (totalPOs > 0) {
      const supplierItems = pos.flatMap((po) => po.items);
      const itemIds = [...new Set(supplierItems.map((i) => i.itemId))];

      if (itemIds.length > 0) {
        // Get avg unit price per item for this supplier
        const supplierPrices = new Map<number, number[]>();
        for (const item of supplierItems) {
          const prices = supplierPrices.get(item.itemId) || [];
          prices.push(this.toNumber(item.unitPrice));
          supplierPrices.set(item.itemId, prices);
        }

        // Get market avg from all suppliers for same items in period
        const allPOItems = await this.prisma.purchaseOrderItem.findMany({
          where: {
            itemId: { in: itemIds },
            purchaseOrder: {
              supplierId: { not: supplierId },
              poDate: dateFilter,
            },
          },
          select: { itemId: true, unitPrice: true },
        });

        const marketPrices = new Map<number, number[]>();
        for (const item of allPOItems) {
          const prices = marketPrices.get(item.itemId) || [];
          prices.push(this.toNumber(item.unitPrice));
          marketPrices.set(item.itemId, prices);
        }

        let comparisonCount = 0;
        let totalRatio = 0;

        for (const [itemId, prices] of supplierPrices) {
          const market = marketPrices.get(itemId);
          if (market && market.length > 0) {
            const avgSupplier = prices.reduce((a, b) => a + b, 0) / prices.length;
            const avgMarket = market.reduce((a, b) => a + b, 0) / market.length;
            if (avgMarket > 0) {
              totalRatio += avgSupplier / avgMarket;
              comparisonCount++;
            }
          }
        }

        if (comparisonCount > 0) {
          const avgRatio = totalRatio / comparisonCount;
          // ratio < 0.9 = very competitive (5), 0.9-0.95 = good (4), 0.95-1.05 = avg (3), 1.05-1.15 = above (2), >1.15 = expensive (1)
          if (avgRatio < 0.9) priceCompetitiveness = 5;
          else if (avgRatio < 0.95) priceCompetitiveness = 4;
          else if (avgRatio <= 1.05) priceCompetitiveness = 3;
          else if (avgRatio <= 1.15) priceCompetitiveness = 2;
          else priceCompetitiveness = 1;
        }
      }
    }

    return {
      scores: { onTimeDelivery, orderFulfillment, quality, priceCompetitiveness },
      totalPOs,
      totalValue,
    };
  }

  async getSupplierRatings(period?: Period) {
    const currentPeriod = period || this.getDefaultPeriod();
    const previousPeriod = this.getPreviousPeriod(currentPeriod);

    const suppliers = await this.prisma.supplier.findMany({
      where: { isActive: true },
      select: { id: true, name: true, category: true },
    });

    const ratings: SupplierRating[] = [];

    for (const supplier of suppliers) {
      const current = await this.calcScoresForSupplier(supplier.id, currentPeriod);
      const currentOverall = this.calcOverall(current.scores);

      // Trend: compare with previous period
      let trend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
      if (current.totalPOs > 0) {
        const previous = await this.calcScoresForSupplier(supplier.id, previousPeriod);
        const previousOverall = this.calcOverall(previous.scores);
        if (currentOverall > previousOverall + 0.3) trend = 'UP';
        else if (currentOverall < previousOverall - 0.3) trend = 'DOWN';
      }

      ratings.push({
        supplierId: supplier.id,
        supplierName: supplier.name,
        category: supplier.category,
        overallScore: currentOverall,
        scores: current.scores,
        totalPOs: current.totalPOs,
        totalValue: current.totalValue,
        trend,
      });
    }

    ratings.sort((a, b) => b.overallScore - a.overallScore);

    return ratings;
  }

  async getSupplierDetail(supplierId: number, period?: Period) {
    const currentPeriod = period || this.getDefaultPeriod();

    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });
    if (!supplier) throw new NotFoundException('Supplier tidak ditemukan');

    const current = await this.calcScoresForSupplier(supplierId, currentPeriod);
    const currentOverall = this.calcOverall(current.scores);

    const previousPeriod = this.getPreviousPeriod(currentPeriod);
    const previous = await this.calcScoresForSupplier(supplierId, previousPeriod);
    const previousOverall = this.calcOverall(previous.scores);
    let trend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
    if (currentOverall > previousOverall + 0.3) trend = 'UP';
    else if (currentOverall < previousOverall - 0.3) trend = 'DOWN';

    // PO history
    const dateFilter = {
      gte: new Date(currentPeriod.from),
      lte: new Date(currentPeriod.to),
    };

    const poHistory = await this.prisma.purchaseOrder.findMany({
      where: {
        supplierId,
        poDate: dateFilter,
      },
      include: {
        receivings: true,
      },
      orderBy: { poDate: 'desc' },
    });

    const poHistoryList = poHistory.map((po) => {
      let onTimeStatus: 'ON_TIME' | 'LATE' | 'PENDING' | 'NO_EXPECTED' = 'NO_EXPECTED';
      if (po.expectedDate) {
        const lastReceiving = po.receivings.sort(
          (a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime(),
        )[0];
        if (lastReceiving) {
          onTimeStatus =
            new Date(lastReceiving.receivedDate) <= new Date(po.expectedDate)
              ? 'ON_TIME'
              : 'LATE';
        } else {
          onTimeStatus = 'PENDING';
        }
      }
      return {
        poNumber: po.poNumber,
        date: po.poDate,
        expectedDate: po.expectedDate,
        status: po.status,
        totalAmount: this.toNumber(po.totalAmount),
        onTimeStatus,
      };
    });

    // Items supplied with price comparison
    const supplierPOItems = await this.prisma.purchaseOrderItem.findMany({
      where: {
        purchaseOrder: {
          supplierId,
          poDate: dateFilter,
        },
      },
      include: { item: true },
    });

    const itemMap = new Map<
      number,
      { itemName: string; prices: number[] }
    >();
    for (const poi of supplierPOItems) {
      const existing = itemMap.get(poi.itemId) || {
        itemName: poi.item.name,
        prices: [],
      };
      existing.prices.push(this.toNumber(poi.unitPrice));
      itemMap.set(poi.itemId, existing);
    }

    const itemIds = [...itemMap.keys()];
    const allMarketItems = itemIds.length > 0
      ? await this.prisma.purchaseOrderItem.findMany({
          where: {
            itemId: { in: itemIds },
            purchaseOrder: {
              supplierId: { not: supplierId },
              poDate: dateFilter,
            },
          },
          select: { itemId: true, unitPrice: true },
        })
      : [];

    const marketAvg = new Map<number, number>();
    const marketGroups = new Map<number, number[]>();
    for (const mi of allMarketItems) {
      const prices = marketGroups.get(mi.itemId) || [];
      prices.push(this.toNumber(mi.unitPrice));
      marketGroups.set(mi.itemId, prices);
    }
    for (const [itemId, prices] of marketGroups) {
      marketAvg.set(itemId, prices.reduce((a, b) => a + b, 0) / prices.length);
    }

    const itemsSupplied = [...itemMap.entries()].map(([itemId, data]) => ({
      itemName: data.itemName,
      lastPrice: data.prices[data.prices.length - 1],
      avgMarketPrice: marketAvg.get(itemId) || null,
    }));

    return {
      supplierId: supplier.id,
      supplierName: supplier.name,
      category: supplier.category,
      overallScore: currentOverall,
      scores: current.scores,
      totalPOs: current.totalPOs,
      totalValue: current.totalValue,
      trend,
      poHistory: poHistoryList,
      itemsSupplied,
    };
  }
}
