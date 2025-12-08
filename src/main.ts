import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar límites para el tamaño de JSON y URL-encoded
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Establecer prefijo global para las rutas de la API
  app.setGlobalPrefix('tierraprometida/api/v1');

  // Habilitar CORS para permitir solicitudes desde múltiples orígenes
  app.enableCors({
    origin: ['http://127.0.0.1:3000',
      'http://localhost:3001', 
      'exp://192.168.100.9:8081', 
      'http://localhost:19006',
      'http://192.168.100.7:8081',
      'http://192.168.100.9:8081',
      'http://192.168.100.37:8081',
      'http://192.168.100.4:8081',
       'http://192.168.100.37:19006', 
       'http://172.21.176.1:19006', 
       'http://192.168.1.82:19006', 
       'http://192.168.1.9:19006', 
       'http://192.168.1.7:19006', 
       'http://192.168.100.7:19006', 
       'http://187.190.186.217:3000',
        'http://187.190.186.217:19006', 
        'http://www.articulosmxapi.com:3000', 
        'http://articulosmxapi.com:3000', 
        'http://www.articulosmxapi.com:19006',
        'http://articulosmxapi.com:19006' ],  // Agrega todos los dominios necesarios
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Si necesitas permitir el envío de cookies
  });

  await app.listen(3000);
}

bootstrap();