import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  configDotenv();
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.enableCors({
    origin: `http://localhost:${process.env.FRONT_PORT || 5000}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
      },
      forbidUnknownValues: true,
    })
  );

  const swagger = new DocumentBuilder()
    .setTitle('User Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3001);
}

bootstrap();
