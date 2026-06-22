import { Controller, Get, Post, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReceivingService } from './receiving.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BranchAccessGuard } from '../../common/guards/branch-access.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBranch, type BranchContext } from '../../common/decorators/current-branch.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createReceivingSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('receivings')
@UseGuards(JwtAuthGuard, RolesGuard, BranchAccessGuard)
export class ReceivingController {
  constructor(private receivingService: ReceivingService) {}

  @Get()
  async findAll(
    @CurrentBranch() branch: BranchContext,
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
  ) {
    return this.receivingService.findAll(branch.branchId, query.page, query.perPage, query.search);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.receivingService.findById(id);
  }

  @Post()
  @Roles('ADMIN', 'OWNER', 'PURCHASER')
  async create(
    @Body(new ZodValidationPipe(createReceivingSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    return this.receivingService.create(body, user.id);
  }
}
