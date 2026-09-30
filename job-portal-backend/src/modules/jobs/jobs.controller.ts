import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('org/:organizationId/jobs')
@UseGuards(OrganizationGuard, RolesGuard)
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get('cost-preview')
  async getCostPreview() {
    return this.jobsService.getCostPreview();
  }

  @Get()
  async listJobs(
    @Param('organizationId') organizationId: string,
    @Query() query: any,
  ) {
    return this.jobsService.listJobs(organizationId, query);
  }

  @Get(':id')
  async getJob(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
  ) {
    return this.jobsService.getJob(organizationId, id);
  }

  @Post()
  @Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN, Role.RECRUITER)
  async createJob(
    @Param('organizationId') organizationId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') userRole: string,
    @Body() body: any,
  ) {
    return this.jobsService.createJob(organizationId, userId, userRole, body);
  }

  @Patch(':id')
  @Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN, Role.RECRUITER)
  async updateJob(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.jobsService.updateJob(organizationId, id, body);
  }

  @Post(':id/close')
  @Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN, Role.RECRUITER)
  async closeJob(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
  ) {
    return this.jobsService.closeJob(organizationId, id);
  }

  @Delete(':id')
  @Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN, Role.RECRUITER)
  async deleteJob(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
  ) {
    return this.jobsService.deleteJob(organizationId, id);
  }
}
