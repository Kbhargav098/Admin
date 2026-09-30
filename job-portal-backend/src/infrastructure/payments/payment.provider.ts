export interface PaymentIntentOptions {
  amountCents: number;
  currency: string;
  planName: string;
  organizationId: string;
}

export interface PaymentProvider {
  createPaymentIntent(options: PaymentIntentOptions): Promise<{ transactionId: string; status: string; clientSecret?: string }>;
  verifyWebhookSignature(signature: string, payload: any): boolean;
}

export class MockPaymentProvider implements PaymentProvider {
  async createPaymentIntent(options: PaymentIntentOptions) {
    const transactionId = `mock_tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    return {
      transactionId,
      status: 'COMPLETED',
      clientSecret: `mock_sec_${transactionId}`,
    };
  }

  verifyWebhookSignature(signature: string, payload: any): boolean {
    return true;
  }
}

export class RazorpayPaymentProvider implements PaymentProvider {
  async createPaymentIntent(options: PaymentIntentOptions) {
    // Razorpay SDK skeleton
    const transactionId = `rzp_order_${Date.now()}`;
    return {
      transactionId,
      status: 'PENDING',
    };
  }

  verifyWebhookSignature(signature: string, payload: any): boolean {
    return !!signature;
  }
}

export class StripePaymentProvider implements PaymentProvider {
  async createPaymentIntent(options: PaymentIntentOptions) {
    // Stripe SDK skeleton
    const transactionId = `pi_${Date.now()}`;
    return {
      transactionId,
      status: 'PENDING',
    };
  }

  verifyWebhookSignature(signature: string, payload: any): boolean {
    return !!signature;
  }
}
