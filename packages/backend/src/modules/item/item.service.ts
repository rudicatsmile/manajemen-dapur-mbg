import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  /** Override currentStock/minStock item dengan stok cabang aktif (atau agregat bila ALL). */
  private withBranchStock(item: any, branchId: number | null) {
    const stocks: any[] = item.branchStocks ?? [];
    const currentStock = stocks.reduce((sum, bs) => sum + Number(bs.currentStock), 0);
    const minStock = branchId && stocks[0] ? Number(stocks[0].minStock) : Number(item.minStock);
    const { branchStocks, ...rest } = item;
    return { ...rest, currentStock, minStock };
  }

  async findAll(branchId: number | null, page: number, perPage: number, search?: string, categoryId?: number, lowStock?: boolean) {
    const where: any = { isActive: true };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (lowStock) {
      // Item di bawah minimum pada cabang aktif (atau agregat semua cabang)
      const items = branchId
        ? await this.prisma.$queryRaw<any[]>`
            SELECT i.id, i.sku, i.name, i.category_id, i.base_unit_id, bs.current_stock, bs.min_stock,
                   c.name as category_name, u.abbreviation as base_unit_abbr
            FROM branch_stocks bs
            JOIN items i ON bs.item_id = i.id
            JOIN categories c ON i.category_id = c.id
            JOIN units_of_measure u ON i.base_unit_id = u.id
            WHERE i.is_active = true AND bs.branch_id = ${branchId} AND bs.current_stock <= bs.min_stock
            ORDER BY i.name ASC
          `
        : await this.prisma.$queryRaw<any[]>`
            SELECT i.id, i.sku, i.name, i.category_id, i.base_unit_id, SUM(bs.current_stock) as current_stock, i.min_stock,
                   c.name as category_name, u.abbreviation as base_unit_abbr
            FROM branch_stocks bs
            JOIN items i ON bs.item_id = i.id
            JOIN categories c ON i.category_id = c.id
            JOIN units_of_measure u ON i.base_unit_id = u.id
            WHERE i.is_active = true
            GROUP BY i.id, i.sku, i.name, i.category_id, i.base_unit_id, i.min_stock, c.name, u.abbreviation
            HAVING SUM(bs.current_stock) <= i.min_stock
            ORDER BY i.name ASC
          `;
      return { data: items, meta: paginationMeta(items.length, 1, items.length || 20) };
    }

    const { skip, take } = paginate(page, perPage);
    const [data, total] = await Promise.all([
      this.prisma.item.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
        include: {
          category: true,
          baseUnit: true,
          purchaseUnit: true,
          branchStocks: branchId ? { where: { branchId } } : true,
        },
      }),
      this.prisma.item.count({ where }),
    ]);

    return { data: data.map((i) => this.withBranchStock(i, branchId)), meta: paginationMeta(total, page, perPage) };
  }

  async findById(id: number, branchId: number | null) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        category: true,
        baseUnit: true,
        purchaseUnit: true,
        branchStocks: branchId ? { where: { branchId } } : true,
      },
    });
    if (!item) throw new NotFoundException('Item tidak ditemukan');
    return this.withBranchStock(item, branchId);
  }

  async create(data: any) {
    const category = await this.prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) throw new NotFoundException('Kategori tidak ditemukan');

    const abbrev = category.name.substring(0, 3).toUpperCase();
    const lastItem = await this.prisma.item.findFirst({
      where: { sku: { startsWith: `ITM-${abbrev}` } },
      orderBy: { sku: 'desc' },
    });

    let nextNum = 1;
    if (lastItem) {
      const parts = lastItem.sku.split('-');
      const lastSeq = parseInt(parts[2], 10);
      if (!isNaN(lastSeq)) nextNum = lastSeq + 1;
    }

    const sku = `ITM-${abbrev}-${String(nextNum).padStart(4, '0')}`;

    return this.prisma.item.create({
      data: {
        sku,
        name: data.name,
        categoryId: data.categoryId,
        baseUnitId: data.baseUnitId,
        purchaseUnitId: data.purchaseUnitId || null,
        conversionFactor: data.conversionFactor || 1,
        minStock: data.minStock || 0,
        imageUrl: data.imageUrl || null,
      },
      include: { category: true, baseUnit: true, purchaseUnit: true },
    });
  }

  async update(id: number, data: any) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item tidak ditemukan');

    return this.prisma.item.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.baseUnitId !== undefined && { baseUnitId: data.baseUnitId }),
        ...(data.purchaseUnitId !== undefined && { purchaseUnitId: data.purchaseUnitId }),
        ...(data.conversionFactor !== undefined && { conversionFactor: data.conversionFactor }),
        ...(data.minStock !== undefined && { minStock: data.minStock }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: { category: true, baseUnit: true, purchaseUnit: true },
    });
  }

  async getMovements(itemId: number, branchId: number | null, page: number, perPage: number) {
    const { skip, take } = paginate(page, perPage);
    const where: any = { itemId };
    if (branchId) where.branchId = branchId;

    const [data, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { creator: { select: { id: true, name: true } } },
      }),
      this.prisma.stockMovement.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }
}
