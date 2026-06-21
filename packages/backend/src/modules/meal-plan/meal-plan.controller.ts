import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MealPlanService } from './meal-plan.service';

@Controller('meal-plans')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'ADMIN', 'PURCHASER', 'KITCHEN_MANAGER')
export class MealPlanController {
  constructor(private readonly mealPlanService: MealPlanService) {}

  // --- Static routes FIRST ---

  @Get('suggest')
  suggest(@Query('week') week: string) {
    return this.mealPlanService.suggest(week);
  }

  @Get('templates')
  getTemplates() {
    return this.mealPlanService.getTemplates();
  }

  @Post('templates')
  saveAsTemplate(
    @Body() body: { planId: number; name: string; description?: string },
    @CurrentUser() user: { id: number },
  ) {
    return this.mealPlanService.saveAsTemplate(body.planId, body.name, body.description, user.id);
  }

  @Post('templates/:id/apply')
  applyTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { weekStartDate: string },
    @CurrentUser() user: { id: number },
  ) {
    return this.mealPlanService.applyTemplate(id, body.weekStartDate, user.id);
  }

  @Delete('templates/:id')
  deleteTemplate(@Param('id', ParseIntPipe) id: number) {
    return this.mealPlanService.deleteTemplate(id);
  }

  // --- Param routes ---

  @Get()
  findAll(
    @Query() query: { page?: string; perPage?: string; status?: string; weekStart?: string },
  ) {
    return this.mealPlanService.findAll({
      page: query.page ? parseInt(query.page, 10) : 1,
      perPage: query.perPage ? parseInt(query.perPage, 10) : 20,
      status: query.status,
      weekStart: query.weekStart,
    });
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.mealPlanService.findById(id);
  }

  @Post()
  create(
    @Body() body: {
      name: string;
      weekStartDate: string;
      maxPortionsPerDay?: number;
      notes?: string;
      items: Array<{
        recipeId: number;
        dayOfWeek: number;
        portions: number;
        sortOrder?: number;
        notes?: string;
      }>;
    },
    @CurrentUser() user: { id: number },
  ) {
    return this.mealPlanService.create(body, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      name?: string;
      notes?: string;
      maxPortionsPerDay?: number;
      items?: Array<{
        recipeId: number;
        dayOfWeek: number;
        portions: number;
        sortOrder?: number;
        notes?: string;
      }>;
    },
    @CurrentUser() user: { id: number },
  ) {
    return this.mealPlanService.update(id, body, user.id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.mealPlanService.delete(id);
  }

  @Post(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.mealPlanService.activate(id);
  }

  @Post(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.mealPlanService.complete(id);
  }

  @Get(':id/stock-check')
  stockCheck(@Param('id', ParseIntPipe) id: number) {
    return this.mealPlanService.stockCheck(id);
  }

  @Post(':id/generate-shopping-list')
  generateShoppingList(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.mealPlanService.generateShoppingList(id, user.id);
  }
}
