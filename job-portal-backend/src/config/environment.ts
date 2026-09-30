export interface EnvironmentVariables {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  CORS_ORIGIN: string;
  STORAGE_DRIVER: string;
  EMAIL_DRIVER: string;
  SEARCH_ENABLED: string;
  PAYMENT_PROVIDER: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  STRIPE_SECRET_KEY?: string;
}
