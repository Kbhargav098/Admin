import { ValidationPipe as NestValidationPipe } from '@nestjs/common';

export const GlobalValidationPipe = new NestValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: false,
  transformOptions: {
    enableImplicitConversion: true,
  },
});
