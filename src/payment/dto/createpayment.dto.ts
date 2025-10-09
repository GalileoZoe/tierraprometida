import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';
import { PaymentStatus } from 'src/payment/schema/payment.schema';

export class CreatePayment {
  @IsOptional()
  student?: Types.ObjectId; // Relación con Students, opcional para pruebas

  @IsString()
  @IsOptional()
  concept?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  method?: string; // Ej. 'Card', 'Cash', 'Transfer'

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus; // Pending | Completed | Failed

  @IsBoolean()
  @IsOptional()
  softdelete?: boolean; // true = eliminado, false = activo
}
