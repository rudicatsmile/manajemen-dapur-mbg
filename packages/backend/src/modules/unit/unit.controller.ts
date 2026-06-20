import { Controller, Get, Post, Patch, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UnitService } from './unit.service';

@Controller('units')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Get()
  findAll() {
    return this.unitService.findAll();
  }

  @Post()
  @Roles('OWNER', 'ADMIN')
  create(@Body() body: { name: string; abbreviation: string }) {
    return this.unitService.create(body);
  }

  @Patch(':id')
  @Roles('OWNER', 'ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: { name?: string; abbreviation?: string }) {
    return this.unitService.update(id, body);
  }
}
