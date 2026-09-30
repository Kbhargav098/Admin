import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('org/:organizationId/analytics')
@UseGuards(OrganizationGuard)
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard(
    @Param('organizationId') organizationId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.service.getDashboardData(organizationId, userId, role);
  }
}
