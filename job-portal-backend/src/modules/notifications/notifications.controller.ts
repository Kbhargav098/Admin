import { Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('org/:organizationId/notifications')
@UseGuards(OrganizationGuard)
export class NotificationsController {
  constructor(private service: NotificationsService) {}

  @Get()
  async getNotifications(
    @Param('organizationId') organizationId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.service.listNotifications(organizationId, userId);
  }

  @Patch(':id/read')
  async markRead(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
  ) {
    return this.service.markAsRead(organizationId, id);
  }

  @Post('read-all')
  async markAllRead(
    @Param('organizationId') organizationId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.service.markAllRead(organizationId, userId);
  }
}
