import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';
import { PaymentStatus } from 'src/payment/schema/payment.schema';

export class CreatePayment {

  @IsOptional()
  _id?: Types.ObjectId;

  @IsOptional()
  student?: Types.ObjectId;

  @IsString()
  @IsOptional()
  concept?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  method?: string;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsString()
  @IsOptional()
  date?: string;

  @IsBoolean()
  @IsOptional()
  softdelete?: boolean;
}
