import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(type?: string) {
    const where = type ? { type: type as any } : {};
    const data = await this.prisma.category.findMany({ where, orderBy: { name: 'asc' } });
    return { data };
  }

  async create(body: { name: string; type: string; description?: string }) {
    return this.prisma.category.create({ data: { name: body.name, type: body.type as any, description: body.description } });
  }

  async update(id: number, body: { name?: string; description?: string; isActive?: boolean }) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Kategori tidak ditemukan');
    return this.prisma.category.update({ where: { id }, data: body });
  }
}
