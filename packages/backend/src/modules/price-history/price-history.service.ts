import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { Decimal } from '@prisma/client/runtime/library';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';

@Injectable()
export class PriceHistoryService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async recordPrice(
    itemId: number,
    supplierId: number,
    price: number | Decimal,
    quantity: number | Decimal,
    poId: number,
    date: Date,
  ) {
    const record = await this.prisma.priceHistory.create({
      data: {
        itemId,
        supplierId,
        price: new Decimal(price.toString()),
        quantity: new Decimal(quantity.toString()),
        poId,
        recordedAt: date,
      },
    });

    // Check price increase > 10% from 30-day average
    await this.checkPriceAlert(itemId, Number(price));

    return record;
  }

  private async checkPriceAlert(itemId: number, currentPrice: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const history = await this.prisma.priceHistory.findMany({
      where: {
        itemId,
        recordedAt: { gte: thirtyDaysAgo },
      },
      select: { price: true },
    });

    // Need at least 1 previous record to compare
    if (history.length < 2) return;

    // Exclude the record we just created (the latest one) for avg calculation
    const previousPrices = history.slice(0, -1);
    if (previousPrices.length === 0) return;

    const avgPrice =
      previousPrices.reduce((sum, h) => sum + Number(h.price), 0) /
      previousPrices.length;

    if (avgPrice <= 0) return;

    const changePercent = ((currentPrice - avgPrice) / avgPrice) * 100;

    if (changePercent > 10) {
      const item = await this.prisma.item.findUnique({
        where: { id: itemId },
        select: { name: true, sku: true },
      });
      if (!item) return;

      const title = `Kenaikan Harga: ${item.name}`;
      const message = `Harga ${item.name} (${item.sku}) naik ${changePercent.toFixed(1)}% dari rata-rata 30 hari (Rp ${Math.round(avgPrice).toLocaleString('id-ID')} → Rp ${Math.round(currentPrice).toLocaleString('id-ID')}).`;
      const link = `/stok/histori-harga/${itemId}`;

      for (const role of ['PURCHASER', 'OWNER']) {
        await this.notificationService.createForRole(
          role,
          'PRICE_ALERT',
          title,
          message,
          link,
          { itemId, changePercent: changePercent.toFixed(1), avgPrice: Math.round(avgPrice), currentPrice: Math.round(currentPrice) },
        );
      }
    }
  }

  async getItemPriceHistory(itemId: number, months: number = 6) {
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const records = await this.prisma.priceHistory.findMany({
      where: {
        itemId,
        recordedAt: { gte: since },
      },
      include: {
        supplier: { select: { name: true } },
      },
      orderBy: { recordedAt: 'asc' },
    });

    const chartData = records.map((r) => ({
      date: r.recordedAt.toISOString().split('T')[0],
      price: Number(r.price),
      supplierName: r.supplier.name,
    }));

    // Stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const allPrices = records.map((r) => Number(r.price));
    const prices30d = records
      .filter((r) => r.recordedAt >= thirtyDaysAgo)
      .map((r) => Number(r.price));
    const prices90d = records
      .filter((r) => r.recordedAt >= ninetyDaysAgo)
      .map((r) => Number(r.price));

    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
      select: { name: true, lastPrice: true },
    });

    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const currentPrice = Number(item?.lastPrice ?? 0);
    const avgPrice30d = avg(prices30d);
    const avgPrice90d = avg(prices90d);
    const minPrice = allPrices.length ? Math.min(...allPrices) : 0;
    const maxPrice = allPrices.length ? Math.max(...allPrices) : 0;
    const priceChange30d =
      avgPrice30d > 0 ? ((currentPrice - avgPrice30d) / avgPrice30d) * 100 : 0;

    return {
      itemName: item?.name ?? '',
      chartData,
      stats: {
        currentPrice,
        avgPrice30d: Math.round(avgPrice30d),
        avgPrice90d: Math.round(avgPrice90d),
        minPrice,
        maxPrice,
        priceChange30d: Number(priceChange30d.toFixed(1)),
      },
    };
  }

  async getItemPriceComparison(itemId: number) {
    const suppliers = await this.prisma.priceHistory.groupBy({
      by: ['supplierId'],
      where: { itemId },
      _avg: { price: true },
      _min: { price: true },
      _max: { price: true },
    });

    const result = await Promise.all(
      suppliers.map(async (s) => {
        const supplier = await this.prisma.supplier.findUnique({
          where: { id: s.supplierId },
          select: { id: true, name: true },
        });

        const lastRecord = await this.prisma.priceHistory.findFirst({
          where: { itemId, supplierId: s.supplierId },
          orderBy: { recordedAt: 'desc' },
          select: { price: true, recordedAt: true },
        });

        return {
          supplierId: s.supplierId,
          supplierName: supplier?.name ?? '',
          lastPrice: Number(lastRecord?.price ?? 0),
          avgPrice: Math.round(Number(s._avg.price ?? 0)),
          minPrice: Number(s._min.price ?? 0),
          maxPrice: Number(s._max.price ?? 0),
          lastDate: lastRecord?.recordedAt?.toISOString().split('T')[0] ?? '',
        };
      }),
    );

    return result.sort((a, b) => a.lastPrice - b.lastPrice);
  }

  async getPriceAlerts(page: number, perPage: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all items that have price history
    const items = await this.prisma.item.findMany({
      where: {
        isActive: true,
        priceHistory: { some: {} },
      },
      select: { id: true, name: true, lastPrice: true },
    });

    const alerts: any[] = [];

    for (const item of items) {
      const history30d = await this.prisma.priceHistory.findMany({
        where: {
          itemId: item.id,
          recordedAt: { gte: thirtyDaysAgo },
        },
        select: { price: true },
      });

      if (history30d.length < 2) continue;

      const avgPrice =
        history30d.reduce((sum, h) => sum + Number(h.price), 0) /
        history30d.length;

      const currentPrice = Number(item.lastPrice);
      if (avgPrice <= 0) continue;

      const changePercent = ((currentPrice - avgPrice) / avgPrice) * 100;

      if (Math.abs(changePercent) > 10) {
        const lastRecord = await this.prisma.priceHistory.findFirst({
          where: { itemId: item.id },
          orderBy: { recordedAt: 'desc' },
          include: { supplier: { select: { name: true } } },
        });

        alerts.push({
          itemId: item.id,
          itemName: item.name,
          currentPrice,
          avgPrice: Math.round(avgPrice),
          changePercent: Number(changePercent.toFixed(1)),
          supplierName: lastRecord?.supplier.name ?? '-',
        });
      }
    }

    // Sort by absolute change descending
    alerts.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));

    const total = alerts.length;
    const { skip, take } = paginate(page, perPage);
    const data = alerts.slice(skip, skip + take);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async getPriceSummary() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const items = await this.prisma.item.findMany({
      where: {
        isActive: true,
        priceHistory: { some: {} },
      },
      select: { id: true, lastPrice: true },
    });

    let totalTracked = items.length;
    let priceUp = 0;
    let priceDown = 0;
    let totalChange = 0;
    let countWithChange = 0;

    for (const item of items) {
      const history30d = await this.prisma.priceHistory.findMany({
        where: {
          itemId: item.id,
          recordedAt: { gte: thirtyDaysAgo },
        },
        select: { price: true },
      });

      if (history30d.length < 2) continue;

      const avgPrice =
        history30d.reduce((sum, h) => sum + Number(h.price), 0) /
        history30d.length;
      if (avgPrice <= 0) continue;

      const currentPrice = Number(item.lastPrice);
      const changePercent = ((currentPrice - avgPrice) / avgPrice) * 100;

      totalChange += changePercent;
      countWithChange++;

      if (changePercent > 10) priceUp++;
      if (changePercent < -10) priceDown++;
    }

    return {
      totalTracked,
      priceUp,
      priceDown,
      avgChange: countWithChange > 0 ? Number((totalChange / countWithChange).toFixed(1)) : 0,
    };
  }
}
