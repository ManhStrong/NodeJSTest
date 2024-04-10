import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  });
  await app.listen(3000);
}
bootstrap();
