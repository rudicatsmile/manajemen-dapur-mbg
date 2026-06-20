import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { OpnameService } from './opname/opname.service';

@Module({
  controllers: [StockController],
  providers: [StockService, OpnameService],
  exports: [StockService],
})
export class StockModule {}
