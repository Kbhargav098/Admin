import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('org/:organizationId/messaging')
@UseGuards(OrganizationGuard)
export class MessagingController {
  constructor(private service: MessagingService) {}

  @Get()
  async getMessages(@Param('organizationId') organizationId: string) {
    return this.service.listMessages(organizationId);
  }

  @Post()
  async sendMessage(
    @Param('organizationId') organizationId: string,
    @CurrentUser('sub') senderId: string,
    @Body() body: { content: string; recipientId?: string },
  ) {
    return this.service.sendMessage(organizationId, senderId, body.content, body.recipientId);
  }
}
