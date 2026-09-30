import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('org/:organizationId/offers')
@UseGuards(OrganizationGuard, RolesGuard)
@Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN, Role.RECRUITER)
export class OffersController {
  constructor(private service: OffersService) {}

  @Get()
  async listOffers(@Param('organizationId') organizationId: string) {
    return this.service.listOffers(organizationId);
  }

  @Post()
  async createOffer(@Body() body: any) {
    return this.service.createOffer(body);
  }

  @Patch(':id/withdraw')
  async withdrawOffer(@Param('id') id: string) {
    return this.service.withdrawOffer(id);
  }
}
