import { Controller, Get, Post, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async findAll(
    @CurrentUser() user: { id: number },
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const result = await this.notificationService.findAllForUser(
      user.id,
      page ? parseInt(page, 10) : 1,
      perPage ? parseInt(perPage, 10) : 20,
      unreadOnly === 'true',
    );
    return { data: result.data, meta: result.meta };
  }

  @Get('count')
  async getUnreadCount(@CurrentUser() user: { id: number }) {
    const count = await this.notificationService.getUnreadCount(user.id);
    return { data: { count } };
  }

  @Post(':id/read')
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    const notification = await this.notificationService.markAsRead(id, user.id);
    return { data: notification };
  }

  @Post('read-all')
  async markAllAsRead(@CurrentUser() user: { id: number }) {
    const result = await this.notificationService.markAllAsRead(user.id);
    return { data: { updated: result.count } };
  }

  @Post('check')
  @Roles('ADMIN', 'OWNER')
  async checkAlerts() {
    const [lowStock, pendingPO, overduePO] = await Promise.all([
      this.notificationService.checkLowStock(),
      this.notificationService.checkPendingPO(),
      this.notificationService.checkOverduePO(),
    ]);
    return { data: { lowStock, pendingPO, overduePO } };
  }
}
