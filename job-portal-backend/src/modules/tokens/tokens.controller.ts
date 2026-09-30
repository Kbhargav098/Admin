import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { OrganizationGuard } from '../../common/guards/organization.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('org/:organizationId/tokens')
@UseGuards(OrganizationGuard, RolesGuard)
export class TokensController {
  constructor(private tokensService: TokensService) {}

  @Get('balance')
  async getBalance(@Param('organizationId') organizationId: string) {
    return this.tokensService.getBalance(organizationId);
  }

  @Get('allocations')
  @Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN)
  async getAllocations(@Param('organizationId') organizationId: string) {
    return this.tokensService.getAllocations(organizationId);
  }

  @Get('transactions')
  async getTransactions(@Param('organizationId') organizationId: string) {
    return this.tokensService.getTransactions(organizationId);
  }

  @Post('allocate')
  @Roles(Role.ORG_SUPER_ADMIN, Role.ORG_ADMIN)
  async allocate(
    @Param('organizationId') organizationId: string,
    @Body() body: { recruiterId: string; amount: number },
  ) {
    return this.tokensService.allocateTokens(
      organizationId,
      body.recruiterId,
      body.amount,
    );
  }
}
