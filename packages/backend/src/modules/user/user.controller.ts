import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createUserSchema, updateUserSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles('ADMIN', 'OWNER')
  async findAll(@Query(new ZodValidationPipe(paginationQuerySchema)) query: { page: number; perPage: number; search?: string }) {
    return this.userService.findAll(query.page, query.perPage, query.search);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Post()
  @Roles('ADMIN', 'OWNER')
  async create(@Body(new ZodValidationPipe(createUserSchema)) body: any) {
    return this.userService.create(body);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER')
  async update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(updateUserSchema)) body: any) {
    return this.userService.update(id, body);
  }
}
