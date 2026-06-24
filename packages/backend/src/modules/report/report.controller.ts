import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'OWNER')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get('purchase')
  async purchase(@Query('from') from: string, @Query('to') to: string) {
    return this.reportService.purchaseReport(from, to);
  }

  @Get('stock')
  async stock(@Query('date') date: string) {
    return this.reportService.stockReport(date);
  }

  @Get('production')
  async production(@Query('from') from: string, @Query('to') to: string) {
    return this.reportService.productionReport(from, to);
  }

  @Get('waste')
  async waste(@Query('from') from: string, @Query('to') to: string) {
    return this.reportService.wasteReport(from, to);
  }

  @Get('food-cost')
  async foodCost() {
    return this.reportService.foodCostReport();
  }

  @Get('branch-comparison')
  async branchComparison(@Query('from') from: string, @Query('to') to: string) {
    return this.reportService.branchComparison(from, to);
  }
}
