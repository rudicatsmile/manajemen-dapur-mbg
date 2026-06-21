import { Module } from '@nestjs/common';
import { ForecastingController } from './forecasting.controller';
import { ForecastingService } from './forecasting.service';
import { SeasonalFactorService } from './seasonal-factor.service';

@Module({
  controllers: [ForecastingController],
  providers: [ForecastingService, SeasonalFactorService],
  exports: [ForecastingService],
})
export class ForecastingModule {}
