import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('org/:organizationId/interviews')
@UseGuards(OrganizationGuard, RolesGuard)
@Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN, Role.RECRUITER)
export class InterviewsController {
  constructor(private service: InterviewsService) {}

  @Get()
  async listInterviews(@Param('organizationId') organizationId: string) {
    return this.service.listInterviews(organizationId);
  }

  @Post()
  async schedule(@Body() body: any) {
    return this.service.scheduleInterview(body);
  }

  @Patch(':id/reschedule')
  async reschedule(@Param('id') id: string, @Body() body: { scheduledAt: string }) {
    return this.service.rescheduleInterview(id, body.scheduledAt);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @Body() body: { feedback?: string }) {
    return this.service.cancelInterview(id, body.feedback);
  }
}
