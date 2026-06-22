import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const ALL = 'ALL';

/**
 * Meresolusi cabang aktif dari header `X-Branch-Id` dan memvalidasi akses user.
 * - Nilai `ALL` (konsolidasi) hanya untuk OWNER/ADMIN.
 * - Cabang spesifik: OWNER bebas akses semua; role lain wajib anggota cabang (UserBranch).
 * - Jika header kosong, fallback ke defaultBranch user.
 * Hasil di-attach ke `request.branchContext` ({ branchId, isAll }).
 */
@Injectable()
export class BranchAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as { id: number; role: string } | undefined;
    if (!user) {
      throw new ForbiddenException('Tidak terautentikasi');
    }

    const headerVal = request.headers['x-branch-id'];
    const raw = Array.isArray(headerVal) ? headerVal[0] : headerVal;

    // Mode konsolidasi semua cabang
    if (raw === ALL) {
      if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
        throw new ForbiddenException('Hanya Owner/Admin yang dapat melihat semua cabang');
      }
      request.branchContext = { branchId: null, isAll: true };
      return true;
    }

    // Tentukan branchId dari header atau defaultBranch user
    let branchId: number | null = null;
    if (raw !== undefined && raw !== '') {
      const parsed = parseInt(raw, 10);
      if (Number.isNaN(parsed)) {
        throw new BadRequestException('Header X-Branch-Id tidak valid');
      }
      branchId = parsed;
    } else {
      const dbUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { defaultBranchId: true },
      });
      branchId = dbUser?.defaultBranchId ?? null;
    }

    if (branchId === null) {
      throw new BadRequestException('Cabang aktif belum ditentukan');
    }

    // OWNER akses semua cabang; role lain wajib menjadi anggota cabang
    if (user.role !== 'OWNER') {
      const membership = await this.prisma.userBranch.findUnique({
        where: { userId_branchId: { userId: user.id, branchId } },
      });
      if (!membership) {
        throw new ForbiddenException('Anda tidak memiliki akses ke cabang ini');
      }
    }

    request.branchContext = { branchId, isAll: false };
    return true;
  }
}
