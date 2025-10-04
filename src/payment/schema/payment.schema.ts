import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

export enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  method: string;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.Pending })
  status: PaymentStatus;

  @Prop({ type: String }) // id del estudiante
  student?: string;

  @Prop({ type: Date, default: null }) // <--- aquí está el soft delete
  deletedAt: Date | null;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
