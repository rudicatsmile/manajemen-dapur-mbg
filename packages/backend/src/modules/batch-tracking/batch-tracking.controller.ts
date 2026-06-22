import { Controller, Get, Post, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BranchAccessGuard } from '../../common/guards/branch-access.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBranch, type BranchContext } from '../../common/decorators/current-branch.decorator';
import { BatchTrackingService } from './batch-tracking.service';

@Controller('batch-tracking')
@UseGuards(JwtAuthGuard, RolesGuard, BranchAccessGuard)
export class BatchTrackingController {
  constructor(private readonly batchTrackingService: BatchTrackingService) {}

  @Get('dashboard')
  @Roles('OWNER', 'ADMIN', 'KITCHEN_MANAGER', 'PURCHASER')
  getDashboard(@CurrentBranch() branch: BranchContext) {
    return this.batchTrackingService.getDashboard(branch.branchId);
  }

  @Get('expiring')
  @Roles('OWNER', 'ADMIN', 'KITCHEN_MANAGER', 'PURCHASER')
  getExpiringBatches(@CurrentBranch() branch: BranchContext, @Query('days') days?: string) {
    return this.batchTrackingService.getExpiringBatches(
      days ? parseInt(days, 10) : 7,
      branch.branchId,
    );
  }

  @Get('item/:itemId')
  @Roles('OWNER', 'ADMIN', 'KITCHEN_MANAGER')
  getItemBatches(
    @Param('itemId', ParseIntPipe) itemId: number,
    @CurrentBranch() branch: BranchContext,
  ) {
    return this.batchTrackingService.getItemBatches(itemId, branch.branchId);
  }

  @Get('fifo-suggestion/:itemId')
  @Roles('OWNER', 'ADMIN', 'KITCHEN_MANAGER')
  getFifoSuggestion(
    @Param('itemId', ParseIntPipe) itemId: number,
    @CurrentBranch() branch: BranchContext,
    @Query('qty') qty?: string,
  ) {
    return this.batchTrackingService.getFifoSuggestion(
      itemId,
      qty ? parseFloat(qty) : 1,
      branch.branchId,
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
