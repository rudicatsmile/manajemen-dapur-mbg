import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BranchAccessGuard } from '../../common/guards/branch-access.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBranch, type BranchContext } from '../../common/decorators/current-branch.decorator';
import { BadRequestException } from '@nestjs/common';
import { ForecastingService } from './forecasting.service';
import { SeasonalFactorService } from './seasonal-factor.service';

@Controller('forecasting')
@UseGuards(JwtAuthGuard, RolesGuard, BranchAccessGuard)
export class ForecastingController {
  constructor(
    private readonly forecastingService: ForecastingService,
    private readonly seasonalFactorService: SeasonalFactorService,
  ) {}

  @Get('demand')
  @Roles('OWNER', 'ADMIN', 'PURCHASER')
  getDemandForecast(@CurrentBranch() branch: BranchContext, @Query('days') days?: string) {
    const horizonDays = days ? parseInt(days, 10) : 7;
    return this.forecastingService.getDemandForecast(branch.branchId, horizonDays);
  }

  @Get('item/:id')
  @Roles('OWNER', 'ADMIN', 'PURCHASER')
  getItemForecastDetail(
    @Param('id', ParseIntPipe) id: number,
    @CurrentBranch() branch: BranchContext,
    @Query('days') days?: string,
  ) {
    const horizonDays = days ? parseInt(days, 10) : 14;
    return this.forecastingService.getItemForecastDetail(branch.branchId, id, horizonDays);
  }

  @Post('generate-po')
  @Roles('OWNER', 'ADMIN', 'PURCHASER')
  generateDraftPO(
    @CurrentBranch() branch: BranchContext,
    @Body() body: { horizonDays: number },
    @CurrentUser() user: { id: number },
  ) {
    if (!branch.branchId) throw new BadRequestException('Pilih cabang spesifik untuk generate PO');
    return this.forecastingService.generateDraftPO(branch.branchId, body.horizonDays, user.id);
  }

  @Get('accuracy')
  @Roles('OWNER', 'ADMIN', 'PURCHASER')
  getAccuracy(@Query('months') months?: string) {
    const m = months ? parseInt(months, 10) : 3;
    return this.forecastingService.getAccuracy(m);
  }

  @Post('reconcile')
  @Roles('OWNER', 'ADMIN', 'PURCHASER')
  reconcileForecasts() {
    return this.forecastingService.reconcileForecasts();
  }

  // Seasonal factors CRUD

  @Get('seasonal-factors')
  @Roles('OWNER', 'ADMIN', 'PURCHASER')
  getSeasonalFactors() {
    return this.seasonalFactorService.findAll();
  }

  @Post('seasonal-factors')
  @Roles('OWNER', 'ADMIN')
  createSeasonalFactor(@Body() body: any) {
    return this.seasonalFactorService.create(body);
  }

  @Patch('seasonal-factors/:id')
  @Roles('OWNER', 'ADMIN')
  updateSeasonalFactor(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.seasonalFactorService.update(id, body);
  }

  @Delete('seasonal-factors/:id')
  @Roles('OWNER', 'ADMIN')
  deleteSeasonalFactor(@Param('id', ParseIntPipe) id: number) {
    return this.seasonalFactorService.delete(id);
  }
}
