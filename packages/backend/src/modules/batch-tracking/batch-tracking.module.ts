import { Module } from '@nestjs/common';
import { BatchTrackingController } from './batch-tracking.controller';
import { BatchTrackingService } from './batch-tracking.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [BatchTrackingController],
  providers: [BatchTrackingService],
  exports: [BatchTrackingService],
})
export class BatchTrackingModule {}
