import { Controller, Get, Post, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReceivingService } from './receiving.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createReceivingSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('receivings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReceivingController {
  constructor(private receivingService: ReceivingService) {}

  @Get()
  async findAll(@Query(new ZodValidationPipe(paginationQuerySchema)) query: any) {
    return this.receivingService.findAll(query.page, query.perPage, query.search);
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
