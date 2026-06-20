import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { WasteService } from './waste.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createWasteSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('wastes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WasteController {
  constructor(private wasteService: WasteService) {}

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.wasteService.findAll(query.page, query.perPage, query.search, from, to);
  }

  @Post()
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async create(
    @Body(new ZodValidationPipe(createWasteSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    return this.wasteService.create(body, user.id);
  }
}
