import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';

export interface SupplierJwtPayload {
  sub: number;
  supplierId: number;
  email: string;
  type: 'SUPPLIER';
}

export interface SupplierPrincipal {
  supplierUserId: number;
  supplierId: number;
  email: string;
}

@Injectable()
export class SupplierJwtStrategy extends PassportStrategy(Strategy, 'supplier-jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret-change-me',
    });
  }

  async validate(payload: SupplierJwtPayload): Promise<SupplierPrincipal> {
    if (payload.type !== 'SUPPLIER') {
      throw new UnauthorizedException('Token bukan untuk portal supplier');
    }
    const supplierUser = await this.prisma.supplierUser.findUnique({
      where: { id: payload.sub },
      include: { supplier: true },
    });
    if (!supplierUser || !supplierUser.isActive) {
      throw new UnauthorizedException('Akun supplier tidak aktif atau tidak ditemukan');
    }
    if (!supplierUser.supplier.isActive) {
      throw new UnauthorizedException('Supplier tidak aktif');
    }
    return {
      supplierUserId: supplierUser.id,
      supplierId: supplierUser.supplierId,
      email: supplierUser.email,
    };
  }
}
