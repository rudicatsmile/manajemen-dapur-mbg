import { Module } from '@nestjs/common';
import { ReceivingController } from './receiving.controller';
import { ReceivingService } from './receiving.service';
import { PriceHistoryModule } from '../price-history/price-history.module';
import { BatchTrackingModule } from '../batch-tracking/batch-tracking.module';

@Module({
  imports: [PriceHistoryModule, BatchTrackingModule],
  controllers: [ReceivingController],
  providers: [ReceivingService],
  exports: [ReceivingService],
})
export class ReceivingModule {}
