import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page: number,
    perPage: number,
    entityType?: string,
    userId?: number,
    from?: string,
    to?: string,
  ) {
    const { skip, take } = paginate(page, perPage);
    const where: any = {};
    if (entityType) where.entityType = entityType;
    if (userId) where.userId = userId;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to + 'T23:59:59');
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }
}
