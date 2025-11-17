import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';
import { PaymentStatus } from '../schema/payment.schema';

export class UpdatePayment {

  @IsOptional()
  _id?: Types.ObjectId;

  @IsOptional()
  student?: Types.ObjectId; // Relación con Students

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
  
  @IsString()
  @IsOptional()
  date?: string;

  @IsBoolean()
  @IsOptional()
  softdelete?: boolean; // true = eliminado, false = activo
}
