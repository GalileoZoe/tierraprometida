import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';
import { AppointmentStatus } from '../schema/appointment.schema';


export class UpdateAppointment {


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

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @IsString()
  @IsOptional()
  date?: string;

  @IsBoolean()
  @IsOptional()
  softdelete?: boolean;
}
