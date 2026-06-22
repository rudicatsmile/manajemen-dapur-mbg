import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { WasteService } from './waste.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BranchAccessGuard } from '../../common/guards/branch-access.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBranch, type BranchContext } from '../../common/decorators/current-branch.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { createWasteSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('wastes')
@UseGuards(JwtAuthGuard, RolesGuard, BranchAccessGuard)
export class WasteController {
  constructor(private wasteService: WasteService) {}

  @Get()
  async findAll(
    @CurrentBranch() branch: BranchContext,
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.wasteService.findAll(branch.branchId, query.page, query.perPage, query.search, from, to);
  }

  @Post()
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async create(
    @CurrentBranch() branch: BranchContext,
    @Body(new ZodValidationPipe(createWasteSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    if (!branch.branchId) throw new BadRequestException('Pilih cabang spesifik untuk mencatat waste');
    return this.wasteService.create(branch.branchId, body, user.id);
  }
}
