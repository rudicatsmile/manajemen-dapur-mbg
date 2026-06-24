import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BranchAccessGuard } from '../../common/guards/branch-access.guard';
import { CurrentBranch, type BranchContext } from '../../common/decorators/current-branch.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard, BranchAccessGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  async summary(@CurrentBranch() branch: BranchContext) {
    return this.dashboardService.summary(branch.branchId);
  }

  @Get('purchase-trend')
  async purchaseTrend(@CurrentBranch() branch: BranchContext) {
    return this.dashboardService.purchaseTrend(branch.branchId);
  }

  @Get('top-items')
  async topItems(@CurrentBranch() branch: BranchContext) {
    return this.dashboardService.topItems(branch.branchId);
  }

  @Get('food-cost')
  async foodCost() {
    return this.dashboardService.foodCost();
  }

  @Get('menu-engineering')
  async menuEngineering(
    @CurrentBranch() branch: BranchContext,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.dashboardService.getMenuEngineering(from, to, branch.branchId);
  }
}
