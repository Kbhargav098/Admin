import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OrganizationSuperAdminService } from './organization-super-admin.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('org/:organizationId/super-admin')
@UseGuards(OrganizationGuard, RolesGuard)
@Roles(Role.ORG_SUPER_ADMIN)
export class OrganizationSuperAdminController {
  constructor(private service: OrganizationSuperAdminService) {}

  @Get()
  async getDashboard(@Param('organizationId') organizationId: string) {
    return this.service.getSuperAdminData(organizationId);
  }
}
