import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { ItemModule } from './modules/item/item.module';
import { PurchaseOrderModule } from './modules/purchase-order/purchase-order.module';
import { ReceivingModule } from './modules/receiving/receiving.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { StockModule } from './modules/stock/stock.module';
import { RecipeModule } from './modules/recipe/recipe.module';
import { ProductionModule } from './modules/production/production.module';
import { WasteModule } from './modules/waste/waste.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UserModule,
    SupplierModule,
    ItemModule,
    PurchaseOrderModule,
    ReceivingModule,
    InvoiceModule,
    StockModule,
    RecipeModule,
    ProductionModule,
    WasteModule,
    DashboardModule,
    AuditLogModule,
    ReportModule,
  ],
})
export class AppModule {}
