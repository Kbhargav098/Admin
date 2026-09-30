import { registerAs } from '@nestjs/config';

export const paymentConfig = registerAs('payment', () => ({
  provider: process.env.PAYMENT_PROVIDER || 'mock',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
}));
