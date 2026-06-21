import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SeasonalFactorService } from './seasonal-factor.service';
import { generateDocNumber } from '../../common/helpers/doc-number.helper';

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;
const HISTORY_DAYS = 60;
const DEFAULT_LEAD_TIME = 3;
const Z_SCORE = 1.65; // 95% service level

interface DailyConsumption {
  date: Date;
  dayOfWeek: number;
  qty: number;
}

export interface ForecastItem {
  itemId: number;
  itemName: string;
  sku: string;
  categoryName: string;
  unit: string;
  currentStock: number;
  minStock: number;
  predictedDemand: number;
  dailyAverage: number;
  safetyStock: number;
  totalNeeded: number;
  shortage: number;
  confidence: 'TINGGI' | 'SEDANG' | 'RENDAH';
  seasonalFactors: string[];
}

export interface DailyBreakdown {
  date: string;
  dayName: string;
  predictedQty: number;
  seasonalMultiplier: number;
}

export interface DayOfWeekPattern {
  day: string;
  avgConsumption: number;
}

@Injectable()
export class ForecastingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly seasonalFactorService: SeasonalFactorService,
  ) {}

  async getDemandForecast(horizonDays: number = 7): Promise<ForecastItem[]> {
    const now = new Date();
    const historyStart = new Date(now);
    historyStart.setDate(historyStart.getDate() - HISTORY_DAYS);

    // Get all items that have been used in completed productions
    const productionItems = await this.prisma.productionItem.findMany({
      where: {
        production: {
          status: 'COMPLETED',
          productionDate: { gte: historyStart },
        },
      },
      include: {
        production: { select: { productionDate: true } },
        item: {
          include: {
            category: true,
            baseUnit: true,
          },
        },
      },
    });

    // Group by item
    const itemConsumptionMap = new Map<number, {
      item: typeof productionItems[0]['item'];
      dailyData: DailyConsumption[];
    }>();

    for (const pi of productionItems) {
      const itemId = pi.itemId;
      if (!itemConsumptionMap.has(itemId)) {
        itemConsumptionMap.set(itemId, { item: pi.item, dailyData: [] });
      }
      const entry = itemConsumptionMap.get(itemId)!;
      const date = pi.production.productionDate;
      const qty = Number(pi.actualQty ?? pi.plannedQty);

      // Aggregate by date
      const dateStr = date.toISOString().slice(0, 10);
      const existing = entry.dailyData.find(d => d.date.toISOString().slice(0, 10) === dateStr);
      if (existing) {
        existing.qty += qty;
      } else {
        entry.dailyData.push({ date, dayOfWeek: date.getDay(), qty });
      }
    }

    const results: ForecastItem[] = [];

    for (const [itemId, { item, dailyData }] of itemConsumptionMap) {
      const { dayAvgs, mean, stdDev } = this.calculateStats(dailyData);

      // Forecast each day in horizon
      let predictedDemand = 0;
      const activeFactorNames = new Set<string>();

      for (let d = 1; d <= horizonDays; d++) {
        const forecastDate = new Date(now);
        forecastDate.setDate(forecastDate.getDate() + d);
        const dow = forecastDate.getDay();

        let dailyPrediction = dayAvgs[dow] ?? mean;

        // Apply seasonal factors
        const factors = await this.seasonalFactorService.getActiveFactors(forecastDate, item.categoryId);
        for (const f of factors) {
          dailyPrediction *= Number(f.multiplier);
          activeFactorNames.add(f.name);
        }

        predictedDemand += dailyPrediction;
      }

      const safetyStock = Z_SCORE * stdDev * Math.sqrt(DEFAULT_LEAD_TIME);
      const totalNeeded = predictedDemand + safetyStock;
      const currentStock = Number(item.currentStock);
      const shortage = Math.max(0, totalNeeded - currentStock);

      // Confidence
      const daysWithData = dailyData.length;
      const cv = mean > 0 ? stdDev / mean : Infinity;
      let confidence: 'TINGGI' | 'SEDANG' | 'RENDAH';
      if (daysWithData >= 30 && cv < 0.5) {
        confidence = 'TINGGI';
      } else if (daysWithData >= 15 && cv < 1.0) {
        confidence = 'SEDANG';
      } else {
        confidence = 'RENDAH';
      }

      results.push({
        itemId,
        itemName: item.name,
        sku: item.sku,
        categoryName: item.category.name,
        unit: item.baseUnit.abbreviation,
        currentStock,
        minStock: Number(item.minStock),
        predictedDemand: Math.round(predictedDemand * 1000) / 1000,
        dailyAverage: Math.round(mean * 1000) / 1000,
        safetyStock: Math.round(safetyStock * 1000) / 1000,
        totalNeeded: Math.round(totalNeeded * 1000) / 1000,
        shortage: Math.round(shortage * 1000) / 1000,
        confidence,
        seasonalFactors: Array.from(activeFactorNames),
      });
    }

    return results.sort((a, b) => b.shortage - a.shortage);
  }

  async getItemForecastDetail(itemId: number, horizonDays: number = 14) {
    const now = new Date();
    const historyStart = new Date(now);
    historyStart.setDate(historyStart.getDate() - HISTORY_DAYS);

    const item = await this.prisma.item.findUniqueOrThrow({
      where: { id: itemId },
      include: { category: true, baseUnit: true },
    });

    const productionItems = await this.prisma.productionItem.findMany({
      where: {
        itemId,
        production: {
          status: 'COMPLETED',
          productionDate: { gte: historyStart },
        },
      },
      include: { production: { select: { productionDate: true } } },
    });

    // Build daily consumption
    const dailyMap = new Map<string, number>();
    for (const pi of productionItems) {
      const dateStr = pi.production.productionDate.toISOString().slice(0, 10);
      dailyMap.set(dateStr, (dailyMap.get(dateStr) ?? 0) + Number(pi.actualQty ?? pi.plannedQty));
    }

    const dailyData: DailyConsumption[] = [];
    for (const [dateStr, qty] of dailyMap) {
      const date = new Date(dateStr);
      dailyData.push({ date, dayOfWeek: date.getDay(), qty });
    }

    const { dayAvgs, mean, stdDev } = this.calculateStats(dailyData);

    // Day-of-week pattern
    const dayOfWeekPattern: DayOfWeekPattern[] = [];
    for (let i = 0; i < 7; i++) {
      dayOfWeekPattern.push({
        day: DAY_NAMES[i],
        avgConsumption: Math.round((dayAvgs[i] ?? 0) * 1000) / 1000,
      });
    }

    // Daily breakdown for horizon
    const dailyBreakdown: DailyBreakdown[] = [];
    for (let d = 1; d <= horizonDays; d++) {
      const forecastDate = new Date(now);
      forecastDate.setDate(forecastDate.getDate() + d);
      const dow = forecastDate.getDay();

      let dailyPrediction = dayAvgs[dow] ?? mean;
      let multiplier = 1;

      const factors = await this.seasonalFactorService.getActiveFactors(forecastDate, item.categoryId);
      for (const f of factors) {
        multiplier *= Number(f.multiplier);
      }
      dailyPrediction *= multiplier;

      dailyBreakdown.push({
        date: forecastDate.toISOString().slice(0, 10),
        dayName: DAY_NAMES[dow],
        predictedQty: Math.round(dailyPrediction * 1000) / 1000,
        seasonalMultiplier: multiplier,
      });
    }

    // Historical daily consumption (last 30 days)
    const last30Start = new Date(now);
    last30Start.setDate(last30Start.getDate() - 30);
    const historicalConsumption: Array<{ date: string; qty: number }> = [];
    for (let d = 30; d >= 0; d--) {
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      const dateStr = date.toISOString().slice(0, 10);
      historicalConsumption.push({
        date: dateStr,
        qty: dailyMap.get(dateStr) ?? 0,
      });
    }

    const safetyStock = Z_SCORE * stdDev * Math.sqrt(DEFAULT_LEAD_TIME);
    const daysWithData = dailyData.length;
    const cv = mean > 0 ? stdDev / mean : Infinity;
    let confidence: 'TINGGI' | 'SEDANG' | 'RENDAH';
    if (daysWithData >= 30 && cv < 0.5) {
      confidence = 'TINGGI';
    } else if (daysWithData >= 15 && cv < 1.0) {
      confidence = 'SEDANG';
    } else {
      confidence = 'RENDAH';
    }

    return {
      item: {
        id: item.id,
        name: item.name,
        sku: item.sku,
        categoryName: item.category.name,
        unit: item.baseUnit.abbreviation,
        currentStock: Number(item.currentStock),
        minStock: Number(item.minStock),
      },
      stats: {
        mean: Math.round(mean * 1000) / 1000,
        stdDev: Math.round(stdDev * 1000) / 1000,
        cv: Math.round(cv * 1000) / 1000,
        confidence,
        safetyStock: Math.round(safetyStock * 1000) / 1000,
        daysWithData,
      },
      dayOfWeekPattern,
      dailyBreakdown,
      historicalConsumption,
    };
  }

  async generateDraftPO(horizonDays: number, userId: number): Promise<{ poIds: number[] }> {
    const forecast = await this.getDemandForecast(horizonDays);
    const shortageItems = forecast.filter(f => f.shortage > 0);

    if (shortageItems.length === 0) {
      return { poIds: [] };
    }

    // Find best supplier for each item
    const itemSupplierMap = new Map<number, { supplierId: number; unitPrice: number }>();
    for (const fi of shortageItems) {
      const latestPrice = await this.prisma.priceHistory.findFirst({
        where: { itemId: fi.itemId },
        orderBy: { recordedAt: 'desc' },
      });

      if (latestPrice) {
        itemSupplierMap.set(fi.itemId, {
          supplierId: latestPrice.supplierId,
          unitPrice: Number(latestPrice.price),
        });
      } else {
        // fallback to item.lastPrice, pick first active supplier
        const firstSupplier = await this.prisma.supplier.findFirst({ where: { isActive: true } });
        if (firstSupplier) {
          itemSupplierMap.set(fi.itemId, {
            supplierId: firstSupplier.id,
            unitPrice: Number(fi.currentStock > 0 ? fi.minStock : 0), // use lastPrice from item
          });
        }
      }
    }

    // Group by supplier
    const supplierGroups = new Map<number, Array<{ itemId: number; qty: number; unitPrice: number; unitId: number }>>();
    for (const fi of shortageItems) {
      const supplierInfo = itemSupplierMap.get(fi.itemId);
      if (!supplierInfo) continue;

      const item = await this.prisma.item.findUnique({ where: { id: fi.itemId } });
      if (!item) continue;

      if (!supplierGroups.has(supplierInfo.supplierId)) {
        supplierGroups.set(supplierInfo.supplierId, []);
      }
      supplierGroups.get(supplierInfo.supplierId)!.push({
        itemId: fi.itemId,
        qty: fi.shortage,
        unitPrice: supplierInfo.unitPrice || Number(item.lastPrice),
        unitId: item.purchaseUnitId ?? item.baseUnitId,
      });
    }

    const poIds: number[] = [];

    for (const [supplierId, poItems] of supplierGroups) {
      const poNumber = await generateDocNumber(
        this.prisma as any,
        'PO',
        'purchase_orders',
        'po_number',
      );

      let totalAmount = 0;
      for (const pi of poItems) {
        totalAmount += pi.qty * pi.unitPrice;
      }

      const po = await this.prisma.purchaseOrder.create({
        data: {
          poNumber,
          supplierId,
          poDate: new Date(),
          expectedDate: new Date(Date.now() + DEFAULT_LEAD_TIME * 24 * 60 * 60 * 1000),
          status: 'DRAFT',
          totalAmount: totalAmount,
          notes: `Auto-generated dari demand forecast (${horizonDays} hari)`,
          createdBy: userId,
        },
      });

      for (const pi of poItems) {
        await this.prisma.purchaseOrderItem.create({
          data: {
            poId: po.id,
            itemId: pi.itemId,
            quantity: pi.qty,
            unitId: pi.unitId,
            unitPrice: pi.unitPrice,
            totalPrice: pi.qty * pi.unitPrice,
          },
        });
      }

      poIds.push(po.id);
    }

    // Save forecast snapshots
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (const fi of forecast) {
      await this.prisma.demandForecast.create({
        data: {
          itemId: fi.itemId,
          forecastDate: today,
          horizonDays,
          predictedQty: fi.predictedDemand,
          safetyStock: fi.safetyStock,
          confidence: fi.confidence,
          generatedBy: userId,
        },
      });
    }

    return { poIds };
  }

  async getAccuracy(months: number = 3) {
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const forecasts = await this.prisma.demandForecast.findMany({
      where: {
        forecastDate: { gte: since },
        actualQty: { not: null },
      },
      include: { item: true },
    });

    if (forecasts.length === 0) {
      return { overallMAPE: 0, items: [], count: 0 };
    }

    // Per-item aggregation
    const itemMap = new Map<number, { name: string; predictions: number[]; actuals: number[] }>();
    for (const f of forecasts) {
      if (!itemMap.has(f.itemId)) {
        itemMap.set(f.itemId, { name: f.item.name, predictions: [], actuals: [] });
      }
      const entry = itemMap.get(f.itemId)!;
      entry.predictions.push(Number(f.predictedQty));
      entry.actuals.push(Number(f.actualQty));
    }

    let totalAPE = 0;
    let apeCount = 0;
    const items: Array<{
      itemName: string;
      avgPredicted: number;
      avgActual: number;
      mape: number;
      accuracy: number;
    }> = [];

    for (const [, { name, predictions, actuals }] of itemMap) {
      const avgPredicted = predictions.reduce((a, b) => a + b, 0) / predictions.length;
      const avgActual = actuals.reduce((a, b) => a + b, 0) / actuals.length;

      let itemAPE = 0;
      for (let i = 0; i < predictions.length; i++) {
        const actual = actuals[i];
        if (actual > 0) {
          const ape = Math.abs(predictions[i] - actual) / actual * 100;
          itemAPE += ape;
          totalAPE += ape;
          apeCount++;
        }
      }

      const mape = predictions.length > 0 ? itemAPE / predictions.length : 0;
      items.push({
        itemName: name,
        avgPredicted: Math.round(avgPredicted * 1000) / 1000,
        avgActual: Math.round(avgActual * 1000) / 1000,
        mape: Math.round(mape * 100) / 100,
        accuracy: Math.round((100 - mape) * 100) / 100,
      });
    }

    return {
      overallMAPE: apeCount > 0 ? Math.round((totalAPE / apeCount) * 100) / 100 : 0,
      items: items.sort((a, b) => b.accuracy - a.accuracy),
      count: forecasts.length,
    };
  }

  async reconcileForecasts(): Promise<{ updated: number }> {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const pendingForecasts = await this.prisma.demandForecast.findMany({
      where: {
        forecastDate: { lt: now },
        actualQty: null,
      },
    });

    let updated = 0;
    for (const forecast of pendingForecasts) {
      const forecastDateStart = new Date(forecast.forecastDate);
      forecastDateStart.setHours(0, 0, 0, 0);
      const forecastDateEnd = new Date(forecastDateStart);
      forecastDateEnd.setDate(forecastDateEnd.getDate() + 1);

      const consumption = await this.prisma.productionItem.aggregate({
        where: {
          itemId: forecast.itemId,
          production: {
            status: 'COMPLETED',
            productionDate: {
              gte: forecastDateStart,
              lt: forecastDateEnd,
            },
          },
        },
        _sum: { actualQty: true, plannedQty: true },
      });

      const actualQty = Number(consumption._sum.actualQty ?? consumption._sum.plannedQty ?? 0);
      await this.prisma.demandForecast.update({
        where: { id: forecast.id },
        data: { actualQty },
      });
      updated++;
    }

    return { updated };
  }

  private calculateStats(dailyData: DailyConsumption[]): {
    dayAvgs: Record<number, number>;
    mean: number;
    stdDev: number;
  } {
    // Day-of-week averages
    const dayGroups: Record<number, number[]> = {};
    for (let i = 0; i < 7; i++) dayGroups[i] = [];

    for (const d of dailyData) {
      dayGroups[d.dayOfWeek].push(d.qty);
    }

    const dayAvgs: Record<number, number> = {};
    for (let i = 0; i < 7; i++) {
      const vals = dayGroups[i];
      dayAvgs[i] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    }

    // Overall stats
    const allQty = dailyData.map(d => d.qty);
    const mean = allQty.length > 0 ? allQty.reduce((a, b) => a + b, 0) / allQty.length : 0;
    const variance = allQty.length > 0
      ? allQty.reduce((sum, v) => sum + (v - mean) ** 2, 0) / allQty.length
      : 0;
    const stdDev = Math.sqrt(variance);

    return { dayAvgs, mean, stdDev };
  }
}
