import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalValidationPipe } from './common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(GlobalValidationPipe);

  const config = new DocumentBuilder()
    .setTitle('Multi-Organisation Job Portal API')
    .setDescription('Organisation Portal & Multi-Tenant Hiring Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application running on http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger documentation at http://localhost:${port}/api/docs`);
  return app;
}
