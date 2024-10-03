import { Injectable } from '@nestjs/common';


@Injectable()
export class AppService {
  getHello(): string {
    return 'API Official de Centro de Rehabilitación Tierra Prometida ';
  }
}