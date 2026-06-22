import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createBranchSchema, updateBranchSchema, assignBranchMembersSchema } from '@mbg/shared';

@Controller('branches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BranchController {
  constructor(private branchService: BranchService) {}

  /** Cabang yang boleh diakses user saat ini (untuk branch switcher). */
  @Get()
  async findAccessible(@CurrentUser() user: { id: number; role: string }) {
    return this.branchService.findAccessible(user);
  }

  /** Daftar lengkap untuk halaman manajemen cabang. */
  @Get('manage')
  @Roles('OWNER', 'ADMIN')
  async findAll() {
    return this.branchService.findAll();
  }

  @Get(':id')
  @Roles('OWNER', 'ADMIN')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.findById(id);
  }

  @Post()
  @Roles('OWNER', 'ADMIN')
  async create(@Body(new ZodValidationPipe(createBranchSchema)) body: any) {
    return this.branchService.create(body);
  }

  @Patch(':id')
  @Roles('OWNER', 'ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateBranchSchema)) body: any,
  ) {
    return this.branchService.update(id, body);
  }

  @Delete(':id')
  @Roles('OWNER')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.deactivate(id);
  }

  @Get(':id/members')
  @Roles('OWNER', 'ADMIN')
  async getMembers(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.getMembers(id);
  }

  @Post(':id/members')
  @Roles('OWNER', 'ADMIN')
  async setMembers(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(assignBranchMembersSchema)) body: any,
  ) {
    return this.branchService.setMembers(id, body.userIds);
  }

  @Delete(':id/members/:userId')
  @Roles('OWNER', 'ADMIN')
  async removeMember(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.branchService.removeMember(id, userId);
  }
}
