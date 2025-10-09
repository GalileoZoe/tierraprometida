import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentStatus } from './schema/payment.schema';
import { Students } from 'src/students/schema/students.schema';
import { CreatePayment } from './dto/createpayment.dto';
import { UpdatePayment } from './dto/updatepayment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Students.name) private readonly studentModel: Model<Students>,
  ) {}

  // Crear un pago normal o programado
  async create(paymentData: CreatePayment): Promise<Payment> {
    const payment = new this.paymentModel(paymentData);
    const savedPayment = await payment.save();

    if (paymentData.student) {
      const student = await this.studentModel.findById(paymentData.student).exec();
      if (!student) throw new NotFoundException('Student no encontrado');
      student.payments.push(savedPayment._id);
      await student.save();
    }

    return savedPayment;
  }

  // Crear pago programado
  async createScheduled(paymentData: CreatePayment): Promise<Payment> {
    const scheduled = new this.paymentModel({
      ...paymentData,
      isScheduled: true,
    });
    return scheduled.save();
  }

  // Obtener pagos programados
  async findScheduled(): Promise<Payment[]> {
    return this.paymentModel.find({ isScheduled: true, deletedAt: null }).exec();
  }

  // Eliminar pago programado
  async deleteScheduled(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');
    const payment = await this.paymentModel.findOneAndUpdate(
      { _id: id, isScheduled: true, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    ).exec();
    if (!payment) throw new NotFoundException(`Pago programado con ID ${id} no encontrado`);
    return payment;
  }

  // Completar pago programado
  async completeScheduled(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');
    const payment = await this.paymentModel.findOne({ _id: id, isScheduled: true, deletedAt: null }).exec();
    if (!payment) throw new NotFoundException(`Pago programado con ID ${id} no encontrado`);
    payment.status = PaymentStatus.Completed;
    return payment.save();
  }

  // Métodos existentes...
  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find({ deletedAt: null, isScheduled: false }).exec();
  }

  async findOne(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');
    const payment = await this.paymentModel.findOne({ _id: id, deletedAt: null }).exec();
    if (!payment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    return payment;
  }

  async update(id: string, updateData: UpdatePayment): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');
    const payment = await this.paymentModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      updateData,
      { new: true, runValidators: true }
    ).exec();
    if (!payment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    return payment;
  }

  async delete(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');
    const payment = await this.paymentModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    ).exec();
    if (!payment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    return payment;
  }

  async restore(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');
    const payment = await this.paymentModel.findOneAndUpdate(
      { _id: id, deletedAt: { $ne: null } },
      { deletedAt: null },
      { new: true }
    ).exec();
    if (!payment) throw new NotFoundException(`Pago con ID ${id} no encontrado o no eliminado`);
    return payment;
  }

  async markPaymentAsCompleted(paymentId: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(paymentId)) throw new BadRequestException('Payment ID no válido');
    const payment = await this.paymentModel.findOne({ _id: paymentId, deletedAt: null }).exec();
    if (!payment) throw new NotFoundException('Pago no encontrado');
    payment.status = PaymentStatus.Completed;
    return payment.save();
  }
}
