import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TokensService } from '../tokens/tokens.service';
import { PaymentProvider } from '../../infrastructure/payments/payment.provider';

@Injectable()
export class BillingService {
  constructor(
    private prisma: PrismaService,
    private tokensService: TokensService,
    @Inject('PAYMENT_PROVIDER') private paymentProvider: PaymentProvider,
  ) {}

  async getPlans() {
    const plans = await this.prisma.tokenPlan.findMany({
      where: { isActive: true },
    });
    if (plans.length === 0) {
      return [
        { id: 'plan_basic', name: 'Basic', tokens: 100, priceCents: 4900, currency: 'USD', description: 'Great for small teams' },
        { id: 'plan_pro', name: 'Pro', tokens: 500, priceCents: 19900, currency: 'USD', description: 'Best for growing companies' },
        { id: 'plan_enterprise', name: 'Enterprise', tokens: 2000, priceCents: 69900, currency: 'USD', description: 'Maximum hiring velocity' },
      ];
    }
    return plans;
  }

  async checkout(organizationId: string, planName: string) {
    const plans = await this.getPlans();
    const plan = plans.find((p) => p.name.toLowerCase() === planName.toLowerCase());
    if (!plan) throw new NotFoundException('Token plan not found');

    const paymentResult = await this.paymentProvider.createPaymentIntent({
      amountCents: plan.priceCents,
      currency: plan.currency || 'USD',
      planName: plan.name,
      organizationId,
    });

    const payment = await this.prisma.payment.create({
      data: {
        organizationId,
        provider: 'MOCK',
        transactionId: paymentResult.transactionId,
        planName: plan.name,
        amountCents: plan.priceCents,
        tokensPurchased: plan.tokens,
        status: paymentResult.status,
      },
    });

    if (paymentResult.status === 'COMPLETED') {
      await this.tokensService.creditTokens(
        organizationId,
        plan.tokens,
        `Purchased ${plan.name} Token Plan (${plan.tokens} tokens)`,
      );
    }

    return {
      payment,
      clientSecret: paymentResult.clientSecret,
    };
  }

  async getPurchases(organizationId: string) {
    return this.prisma.payment.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async handleWebhook(signature: string, payload: any) {
    const isValid = this.paymentProvider.verifyWebhookSignature(signature, payload);
    if (!isValid) return { success: false, message: 'Invalid signature' };
    return { success: true };
  }
}
