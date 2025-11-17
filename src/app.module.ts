import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';
import { LoginModule } from './login/login.module';
import { ReportsModule } from './reports/reports.module';
import { PaymentModule } from './payment/payment.module';
import { IncomeModule } from './income/income.module';
import { ExpenseModule } from './expense/expense.module';
import { WebhookModule } from './webhook/webhook.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    // 🔥 Cargar variables de entorno globalmente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // opcional, pero recomendado
    }),

    MongooseModule.forRoot('mongodb://localhost:27017/tierraprometida'),

    StudentsModule,
    UsersModule,
    LoginModule,
    ReportsModule,
    PaymentModule,
    IncomeModule,
    ExpenseModule,
    WebhookModule,
    EmailModule,
  ],
  providers: [],
})
export class AppModule {}
