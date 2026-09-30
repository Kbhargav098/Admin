import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('org/:organizationId')
@UseGuards(OrganizationGuard)
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get()
  async getOrg(@Param('organizationId') organizationId: string) {
    return this.organizationsService.getOrganization(organizationId);
  }

  @Patch()
  @Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN)
  async updateOrg(
    @Param('organizationId') organizationId: string,
    @Body() body: any,
  ) {
    return this.organizationsService.updateOrganization(organizationId, body);
  }
}
