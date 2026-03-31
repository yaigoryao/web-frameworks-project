import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { getCorsOptions, getValidationPipeOptions } from '@monorepo/shared';

async function bootstrap() {
  configDotenv();
  const app = await NestFactory.create(AppModule);

  app.enableCors(getCorsOptions(process.env.FRONTEND_ADDR));

  app.useGlobalPipes(new ValidationPipe(getValidationPipeOptions()));

  const swagger = new DocumentBuilder()
    .setTitle('User Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}

bootstrap();
