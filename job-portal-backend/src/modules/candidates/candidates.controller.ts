import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('org/:organizationId/candidates')
@UseGuards(OrganizationGuard, RolesGuard)
@Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN, Role.RECRUITER)
export class CandidatesController {
  constructor(private candidatesService: CandidatesService) {}

  @Get('search')
  async searchCandidates(
    @Param('organizationId') organizationId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') userRole: string,
    @Query() query: any,
  ) {
    return this.candidatesService.searchCandidates(
      organizationId,
      userId,
      userRole,
      query,
    );
  }

  @Get(':id')
  async getCandidate(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.candidatesService.getCandidateDetail(
      organizationId,
      userId,
      userRole,
      id,
    );
  }

  @Public()
  @Post('apply')
  async applyJob(@Body() body: any) {
    return this.candidatesService.createApplication(body);
  }
}
