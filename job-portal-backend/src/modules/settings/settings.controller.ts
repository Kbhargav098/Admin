import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('org/:organizationId/settings')
@UseGuards(OrganizationGuard, RolesGuard)
export class SettingsController {
  constructor(private service: SettingsService) {}

  @Get()
  async getSettings(@Param('organizationId') organizationId: string) {
    return this.service.getSettings(organizationId);
  }

  @Patch()
  @Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN)
  async updateSettings(
    @Param('organizationId') organizationId: string,
    @Body() body: any,
  ) {
    return this.service.updateSettings(organizationId, body);
  }
}
