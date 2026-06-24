import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, perPage: number, search?: string, status?: string) {
    const { skip, take } = paginate(page, perPage);
    const where: any = {};
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search } },
        { supplier: { name: { contains: search } } },
      ];
    }
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.purchaseInvoice.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          supplier: true,
          purchaseOrder: true,
          creator: { select: { id: true, name: true } },
          verifier: { select: { id: true, name: true } },
          submitter: { select: { id: true, name: true } },
        },
      }),
      this.prisma.purchaseInvoice.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async create(data: {
    invoiceNumber: string;
    poId?: number;
    supplierId: number;
    invoiceDate: string;
    totalAmount: number;
    imageUrl?: string;
    notes?: string;
  }, userId: number) {
    return this.prisma.purchaseInvoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        poId: data.poId || null,
        supplierId: data.supplierId,
        invoiceDate: new Date(data.invoiceDate),
        totalAmount: data.totalAmount,
        imageUrl: data.imageUrl || null,
        notes: data.notes || null,
        source: 'INTERNAL',
        createdBy: userId,
      },
      include: { supplier: true, purchaseOrder: true },
    });
  }

  async verify(id: number, userId: number) {
    const invoice = await this.prisma.purchaseInvoice.findUnique({ where: { id } });
    if (!invoice) throw new NotFoundException('Invoice tidak ditemukan');
    if (invoice.status !== 'PENDING') {
      throw new BadRequestException('Invoice sudah diverifikasi atau ditolak');
    }

    return this.prisma.purchaseInvoice.update({
      where: { id },
      data: { status: 'VERIFIED', verifiedBy: userId },
      include: { supplier: true },
    });
  }
}
