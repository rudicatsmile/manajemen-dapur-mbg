import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SupplierAuthService } from './supplier-auth.service';
import { SupplierAuthController } from './supplier-auth.controller';
import { SupplierJwtStrategy } from './strategies/supplier-jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'default-secret-change-me',
        signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any },
      }),
    }),
  ],
  controllers: [SupplierAuthController],
  providers: [SupplierAuthService, SupplierJwtStrategy],
  exports: [SupplierAuthService],
})
export class SupplierAuthModule {}
