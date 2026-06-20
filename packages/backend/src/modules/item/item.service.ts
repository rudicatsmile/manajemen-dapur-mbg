import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, perPage: number, search?: string, categoryId?: number, lowStock?: boolean) {
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
      // Prisma doesn't support field-to-field comparison, use raw query for low stock
      const items = await this.prisma.$queryRaw<any[]>`
        SELECT i.*, c.name as category_name, c.type as category_type,
               u.name as base_unit_name, u.abbreviation as base_unit_abbr
        FROM items i
        JOIN categories c ON i.category_id = c.id
        JOIN units_of_measure u ON i.base_unit_id = u.id
        WHERE i.is_active = true AND i.current_stock <= i.min_stock
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
        include: { category: true, baseUnit: true, purchaseUnit: true },
      }),
      this.prisma.item.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async findById(id: number) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: { category: true, baseUnit: true, purchaseUnit: true },
    });
    if (!item) throw new NotFoundException('Item tidak ditemukan');
    return item;
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

  async getMovements(itemId: number, page: number, perPage: number) {
    const { skip, take } = paginate(page, perPage);
    const where = { itemId };

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
