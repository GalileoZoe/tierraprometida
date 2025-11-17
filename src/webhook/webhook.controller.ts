import { Controller, Post, Body, Logger } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {

  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async handleWebhook(@Body() body: any) {
    this.logger.log('Webhook recibido: ' + JSON.stringify(body));

    // 1️⃣ Extraer ID de pago real
    const mpPaymentId =
      body?.data?.id ||
      body?.resource_id ||
      body?.id;

    if (!mpPaymentId) {
      this.logger.error('❌ No se encontró ID de pago en el body.');
      return { received: false };
    }

    // 2️⃣ Procesar
    await this.webhookService.processPaymentUpdate(mpPaymentId);

    return { received: true };
  }
}
