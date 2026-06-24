import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';
import { adjustBranchStock, getBranchStockQty } from '../../common/helpers/stock.helper';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  /** Ringkasan stok per kategori untuk cabang aktif (atau agregat semua cabang bila ALL). */
  async summary(branchId: number | null) {
    const items = await this.prisma.item.findMany({
      where: { isActive: true },
      include: {
        category: true,
        baseUnit: true,
        branchStocks: branchId ? { where: { branchId } } : true,
      },
      orderBy: { name: 'asc' },
    });

    const grouped: Record<string, any[]> = {};
    for (const item of items) {
      const currentStock = item.branchStocks.reduce((sum, bs) => sum + Number(bs.currentStock), 0);
      const minStock =
        branchId && item.branchStocks[0]
          ? Number(item.branchStocks[0].minStock)
          : Number(item.minStock);
      const { branchStocks, ...rest } = item;
      const cat = item.category.name;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({ ...rest, currentStock, minStock });
    }

    return grouped;
  }

  /** Item di bawah stok minimum pada cabang aktif (atau agregat semua cabang bila ALL). */
  async lowStock(branchId: number | null) {
    if (branchId) {
      return this.prisma.$queryRaw<any[]>`
        SELECT i.id, i.sku, i.name, bs.current_stock, bs.min_stock,
               c.name as category_name, u.abbreviation as unit
        FROM branch_stocks bs
        JOIN items i ON bs.item_id = i.id
        JOIN categories c ON i.category_id = c.id
        JOIN units_of_measure u ON i.base_unit_id = u.id
        WHERE i.is_active = true AND bs.branch_id = ${branchId} AND bs.current_stock <= bs.min_stock
        ORDER BY (bs.current_stock - bs.min_stock) ASC
      `;
    }

    return this.prisma.$queryRaw<any[]>`
      SELECT i.id, i.sku, i.name, SUM(bs.current_stock) as current_stock, i.min_stock,
             c.name as category_name, u.abbreviation as unit
      FROM branch_stocks bs
      JOIN items i ON bs.item_id = i.id
      JOIN categories c ON i.category_id = c.id
      JOIN units_of_measure u ON i.base_unit_id = u.id
      WHERE i.is_active = true
      GROUP BY i.id, i.sku, i.name, i.min_stock, c.name, u.abbreviation
      HAVING SUM(bs.current_stock) <= i.min_stock
      ORDER BY (SUM(bs.current_stock) - i.min_stock) ASC
    `;
  }

  async adjustment(
    branchId: number,
    data: { itemId: number; quantity: number; reason: string; notes?: string },
    userId: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const before = await getBranchStockQty(tx, branchId, data.itemId);
      if (before + data.quantity < 0) {
        throw new BadRequestException('Stok tidak boleh kurang dari 0');
      }
      const movementType = data.quantity >= 0 ? 'ADJ_PLUS' : 'ADJ_MINUS';
      const { qtyBefore, qtyAfter } = await adjustBranchStock(tx, {
        branchId,
        itemId: data.itemId,
        qtyChange: data.quantity,
        movementType,
        referenceType: 'ADJUSTMENT',
        referenceId: 0,
        userId,
        notes: `${data.reason}${data.notes ? ': ' + data.notes : ''}`,
      });

      return { itemId: data.itemId, qtyBefore, qtyChange: data.quantity, qtyAfter };
    });
  }

  async movements(
    branchId: number | null,
    page: number,
    perPage: number,
    itemId?: number,
    type?: string,
    from?: string,
    to?: string,
  ) {
    const { skip, take } = paginate(page, perPage);
    const where: any = {};
    if (branchId) where.branchId = branchId;
    if (itemId) where.itemId = itemId;
    if (type) where.movementType = type;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to + 'T23:59:59');
    }

    const [data, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          item: { select: { id: true, name: true, sku: true } },
          creator: { select: { id: true, name: true } },
        },
      }),
      this.prisma.stockMovement.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }
}
