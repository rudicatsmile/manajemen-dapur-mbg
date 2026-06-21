import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface CreateSeasonalFactorInput {
  name: string;
  startDate: Date;
  endDate: Date;
  multiplier?: number;
  scope?: string;
  categoryId?: number;
  notes?: string;
}

interface UpdateSeasonalFactorInput {
  name?: string;
  startDate?: Date;
  endDate?: Date;
  multiplier?: number;
  scope?: string;
  categoryId?: number;
  notes?: string;
}

@Injectable()
export class SeasonalFactorService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.seasonalFactor.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async create(data: CreateSeasonalFactorInput) {
    return this.prisma.seasonalFactor.create({
      data: {
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        multiplier: data.multiplier ?? 1,
        scope: data.scope ?? 'GLOBAL',
        categoryId: data.categoryId ?? null,
        notes: data.notes ?? null,
      },
      include: { category: true },
    });
  }

  async update(id: number, data: UpdateSeasonalFactorInput) {
    const existing = await this.prisma.seasonalFactor.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Seasonal factor #${id} tidak ditemukan`);

    return this.prisma.seasonalFactor.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: new Date(data.endDate) }),
        ...(data.multiplier !== undefined && { multiplier: data.multiplier }),
        ...(data.scope !== undefined && { scope: data.scope }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: { category: true },
    });
  }

  async delete(id: number) {
    const existing = await this.prisma.seasonalFactor.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Seasonal factor #${id} tidak ditemukan`);

    return this.prisma.seasonalFactor.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getActiveFactors(date: Date, categoryId?: number) {
    return this.prisma.seasonalFactor.findMany({
      where: {
        isActive: true,
        startDate: { lte: date },
        endDate: { gte: date },
        OR: [
          { scope: 'GLOBAL' },
          ...(categoryId ? [{ scope: 'CATEGORY', categoryId }] : []),
        ],
      },
    });
  }
}
