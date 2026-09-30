import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrganizationMembersService } from './organization-members.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller()
export class OrganizationMembersController {
  constructor(private membersService: OrganizationMembersService) {}

  @Get('org/:organizationId/members')
  @UseGuards(OrganizationGuard, RolesGuard)
  @Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN)
  async getMembers(@Param('organizationId') organizationId: string) {
    return this.membersService.listMembers(organizationId);
  }

  @Post('org/:organizationId/members')
  @UseGuards(OrganizationGuard, RolesGuard)
  @Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN)
  async inviteMember(
    @Param('organizationId') organizationId: string,
    @Body() body: any,
    @CurrentUser('role') role: string,
  ) {
    return this.membersService.inviteMember(organizationId, body, role);
  }

  @Patch('org/:organizationId/members/:id')
  @UseGuards(OrganizationGuard, RolesGuard)
  @Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN)
  async updateMemberRole(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() body: { role: string; recruiterType?: string },
  ) {
    return this.membersService.updateMemberRole(
      organizationId,
      id,
      body.role,
      body.recruiterType,
    );
  }

  @Delete('org/:organizationId/members/:id')
  @UseGuards(OrganizationGuard, RolesGuard)
  @Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN)
  async deleteMember(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
  ) {
    return this.membersService.removeMember(organizationId, id);
  }

  @Public()
  @Post('members/accept-invite')
  async acceptInvite(@Body() body: any) {
    return this.membersService.acceptInvite(
      body.token,
      body.password,
      body.firstName,
      body.lastName,
    );
  }
}
