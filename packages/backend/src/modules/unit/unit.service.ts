import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UnitService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.unitOfMeasure.findMany({ orderBy: { name: 'asc' } });
    return { data };
  }

  async create(body: { name: string; abbreviation: string }) {
    return this.prisma.unitOfMeasure.create({ data: body });
  }

  async update(id: number, body: { name?: string; abbreviation?: string }) {
    const existing = await this.prisma.unitOfMeasure.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Satuan tidak ditemukan');
    return this.prisma.unitOfMeasure.update({ where: { id }, data: body });
  }
}
