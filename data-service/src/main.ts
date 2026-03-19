import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  configDotenv();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
      },
      // whitelist: true,
      // forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    })
  );
  await app.listen(process.env.PORT || 3002);
}

bootstrap();
