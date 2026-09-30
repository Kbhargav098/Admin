import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('org/:organizationId/applications')
@UseGuards(OrganizationGuard, RolesGuard)
@Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN, Role.RECRUITER)
export class ApplicationsController {
  constructor(private service: ApplicationsService) {}

  @Get()
  async listApplications(
    @Param('organizationId') organizationId: string,
    @Query() query: any,
  ) {
    return this.service.listApplications(organizationId, query);
  }

  @Get(':id')
  async getApplication(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
  ) {
    return this.service.getApplication(organizationId, id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() body: { status: string; reason?: string },
  ) {
    return this.service.updateStatus(
      organizationId,
      id,
      userId,
      body.status,
      body.reason,
    );
  }

  @Patch(':id/notes')
  async updateNotes(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() body: { notes: string },
  ) {
    return this.service.updateNotes(organizationId, id, body.notes);
  }
}
