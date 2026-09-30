import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('org/:organizationId/billing')
@UseGuards(OrganizationGuard, RolesGuard)
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Public()
  @Get('plans')
  async getPlans() {
    return this.billingService.getPlans();
  }

  @Post('checkout')
  @Roles(Role.ORG_SUPER_ADMIN)
  async checkout(
    @Param('organizationId') organizationId: string,
    @Body() body: { planName: string },
  ) {
    return this.billingService.checkout(organizationId, body.planName);
  }

  @Get('purchases')
  @Roles(Role.ORG_SUPER_ADMIN)
  async getPurchases(@Param('organizationId') organizationId: string) {
    return this.billingService.getPurchases(organizationId);
  }
}

@Controller('payments')
export class PaymentsWebhookController {
  constructor(private billingService: BillingService) {}

  @Public()
  @Post('webhook')
  async webhook(
    @Headers('x-signature') signature: string,
    @Body() body: any,
  ) {
    return this.billingService.handleWebhook(signature, body);
  }
}
