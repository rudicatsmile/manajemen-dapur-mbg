import { Module } from '@nestjs/common';
import { SupplierRatingController } from './supplier-rating.controller';
import { SupplierRatingService } from './supplier-rating.service';

@Module({
  controllers: [SupplierRatingController],
  providers: [SupplierRatingService],
})
export class SupplierRatingModule {}
