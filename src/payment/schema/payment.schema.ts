import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

export enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

@Schema({ timestamps: true })
export class Payment {
  
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  concept: string;

  @Prop()
  amount: number;

  @Prop()
  method: string;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.Pending })
  status: PaymentStatus;

  @Prop()
  date: string;

  @Prop({ type: String }) // id del estudiante
  student?: string;

  @Prop({ type: Date, default: null }) // <--- aquí está el soft delete
  deletedAt: Date | null;

  // --- NUEVO ---
  @Prop({ default: false })
  isScheduled: boolean;

  @Prop({ type: String, enum: ['daily', 'weekly', 'friday', 'saturday'], required: false })
  frequency?: string;

  @Prop({ type: Date, required: false })
  dueDate?: Date;

  @Prop({ type: Date, required: false })
  startDate?: Date;

  datePaid: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
