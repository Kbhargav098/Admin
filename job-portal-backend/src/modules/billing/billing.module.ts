import { Module } from '@nestjs/common';
import { BillingController, PaymentsWebhookController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
  controllers: [BillingController, PaymentsWebhookController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
