import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PaymentModule } from 'src/payment/payment.module';
import { StudentsModule } from 'src/students/students.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [PaymentModule, StudentsModule, EmailModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}

