import { Controller, Get, Post, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BatchTrackingService } from './batch-tracking.service';

@Controller('batch-tracking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BatchTrackingController {
  constructor(private readonly batchTrackingService: BatchTrackingService) {}

  @Get('dashboard')
  @Roles('OWNER', 'ADMIN', 'KITCHEN_MANAGER', 'PURCHASER')
  getDashboard() {
    return this.batchTrackingService.getDashboard();
  }

  @Get('expiring')
  @Roles('OWNER', 'ADMIN', 'KITCHEN_MANAGER', 'PURCHASER')
  getExpiringBatches(@Query('days') days?: string) {
    return this.batchTrackingService.getExpiringBatches(
      days ? parseInt(days, 10) : 7,
    );
  }

  @Get('item/:itemId')
  @Roles('OWNER', 'ADMIN', 'KITCHEN_MANAGER')
  getItemBatches(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.batchTrackingService.getItemBatches(itemId);
  }

  @Get('fifo-suggestion/:itemId')
  @Roles('OWNER', 'ADMIN', 'KITCHEN_MANAGER')
  getFifoSuggestion(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Query('qty') qty?: string,
  ) {
    return this.batchTrackingService.getFifoSuggestion(
      itemId,
      qty ? parseFloat(qty) : 1,
    );
  }

  @Post('mark-expired/:batchId')
  @Roles('OWNER', 'ADMIN', 'KITCHEN_MANAGER')
  markExpired(
    @Param('batchId', ParseIntPipe) batchId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.batchTrackingService.markExpired(batchId, user.id);
  }

  @Post('check-expiry')
  @Roles('OWNER', 'ADMIN', 'KITCHEN_MANAGER')
  checkExpiryAlerts() {
    return this.batchTrackingService.checkExpiryAlerts();
  }

  @Post('auto-expire')
  @Roles('OWNER', 'ADMIN', 'KITCHEN_MANAGER')
  autoExpireBatches() {
    return this.batchTrackingService.autoExpireBatches();
  }
}
