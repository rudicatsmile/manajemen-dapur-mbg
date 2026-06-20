import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  async summary() {
    return this.dashboardService.summary();
  }

  @Get('purchase-trend')
  async purchaseTrend() {
    return this.dashboardService.purchaseTrend();
  }

  @Get('top-items')
  async topItems() {
    return this.dashboardService.topItems();
  }

  @Get('food-cost')
  async foodCost() {
    return this.dashboardService.foodCost();
  }
}
