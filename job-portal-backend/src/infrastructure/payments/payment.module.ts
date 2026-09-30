import { Global, Module } from '@nestjs/common';
import { MockPaymentProvider } from './payment.provider';

@Global()
@Module({
  providers: [
    {
      provide: 'PAYMENT_PROVIDER',
      useClass: MockPaymentProvider,
    },
  ],
  exports: ['PAYMENT_PROVIDER'],
})
export class PaymentModule {}
