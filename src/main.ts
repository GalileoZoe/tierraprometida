import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar límites para el tamaño de JSON y URL-encoded
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Establecer prefijo global para las rutas de la API
  app.setGlobalPrefix('api/tierraprometida/v1');

  // Habilitar CORS para permitir solicitudes desde otros orígenes
  app.enableCors({
    origin: 'http://localhost:3001',  // Reemplazar con el dominio de tu frontend si es necesario
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true  // Si necesitas permitir el envío de cookies
  });

  await app.listen(3000);
}

bootstrap();
