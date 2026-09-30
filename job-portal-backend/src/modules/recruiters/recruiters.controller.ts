import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RecruitersService } from './recruiters.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('org/:organizationId/recruiters')
@UseGuards(OrganizationGuard, RolesGuard)
@Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN)
export class RecruitersController {
  constructor(private recruitersService: RecruitersService) {}

  @Get()
  async getRecruiters(@Param('organizationId') organizationId: string) {
    return this.recruitersService.listRecruiters(organizationId);
  }

  @Post()
  async createRecruiter(
    @Param('organizationId') organizationId: string,
    @Body() body: any,
  ) {
    return this.recruitersService.createRecruiter(organizationId, body);
  }

  @Patch(':id/role')
  async updateRecruiterRole(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() body: { recruiterType: string },
  ) {
    return this.recruitersService.updateRecruiterRole(
      organizationId,
      id,
      body.recruiterType,
    );
  }
}
