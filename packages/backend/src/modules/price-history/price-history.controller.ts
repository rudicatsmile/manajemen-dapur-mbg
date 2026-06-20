import { Controller, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PriceHistoryService } from './price-history.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('price-history')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'ADMIN', 'PURCHASER')
export class PriceHistoryController {
  constructor(private priceHistoryService: PriceHistoryService) {}

  @Get('summary')
  async getSummary() {
    const data = await this.priceHistoryService.getPriceSummary();
    return { data };
  }

  @Get('alerts')
  async getAlerts(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.priceHistoryService.getPriceAlerts(
      Number(page) || 1,
      Number(perPage) || 20,
    );
  }

  @Get('item/:itemId')
  async getItemHistory(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Query('months') months?: string,
  ) {
    const data = await this.priceHistoryService.getItemPriceHistory(
      itemId,
      Number(months) || 6,
    );
    return { data };
  }

  @Get('item/:itemId/compare')
  async getItemComparison(
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    const data = await this.priceHistoryService.getItemPriceComparison(itemId);
    return { data };
  }
}
