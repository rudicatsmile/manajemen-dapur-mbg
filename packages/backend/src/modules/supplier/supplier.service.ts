import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, perPage: number, search?: string) {
    const { skip, take } = paginate(page, perPage);
    const where: any = { isActive: true };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { contactPerson: { contains: search } },
        { category: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.supplier.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
      this.prisma.supplier.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async findById(id: number) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier tidak ditemukan');
    return supplier;
  }

  async create(data: any) {
    return this.prisma.supplier.create({ data });
  }

  async update(id: number, data: any) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier tidak ditemukan');
    return this.prisma.supplier.update({ where: { id }, data });
  }

  async deactivate(id: number) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier tidak ditemukan');
    return this.prisma.supplier.update({ where: { id }, data: { isActive: false } });
  }
}
