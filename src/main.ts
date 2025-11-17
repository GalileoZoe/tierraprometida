import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Necesario para Mercado Pago Webhooks
  app.use(json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
    limit: '50mb',
  }));

  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Prefijo global
  app.setGlobalPrefix('api/tierraprometida/v1/');

  // CORS (solo una vez)
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://192.168.1.49:3001'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
