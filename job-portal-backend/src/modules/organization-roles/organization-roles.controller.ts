import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OrganizationRolesService } from './organization-roles.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';

@Controller('org/:organizationId/roles')
@UseGuards(OrganizationGuard)
export class OrganizationRolesController {
  constructor(private rolesService: OrganizationRolesService) {}

  @Get()
  async getRoles(@Param('organizationId') organizationId: string) {
    return this.rolesService.listRoles(organizationId);
  }
}
