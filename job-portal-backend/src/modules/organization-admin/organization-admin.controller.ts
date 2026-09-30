import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OrganizationAdminService } from './organization-admin.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('org/:organizationId/admin')
@UseGuards(OrganizationGuard, RolesGuard)
@Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN)
export class OrganizationAdminController {
  constructor(private service: OrganizationAdminService) {}

  @Get()
  async getDashboard(@Param('organizationId') organizationId: string) {
    return this.service.getAdminData(organizationId);
  }
}
