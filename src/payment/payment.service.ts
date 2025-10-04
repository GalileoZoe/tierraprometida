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

  // Crear un pago
  async create(paymentData: CreatePayment): Promise<Payment> {
    const payment = new this.paymentModel(paymentData);
    const savedPayment = await payment.save();

    // Si se pasa un student, agregar el pago al arreglo payments
    if (paymentData.student) {
      const student = await this.studentModel.findById(paymentData.student).exec();
      if (!student) throw new NotFoundException('Student no encontrado');
      student.payments.push(savedPayment._id);
      await student.save();
    }

    return savedPayment;
  }

  // Obtener todos los pagos activos
  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find({ deletedAt: null }).exec();
  }

  // Obtener un pago por ID
  async findOne(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');
    const payment = await this.paymentModel.findOne({ _id: id, deletedAt: null }).exec();
    if (!payment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    return payment;
  }

  // Actualizar un pago
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

  // Soft delete
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

  // Restaurar pago eliminado
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

  // Marcar pago como completado usando studentId
  async markStudentPaymentAsCompleted(studentId: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(studentId)) throw new BadRequestException('Student ID no válido');

    const student = await this.studentModel.findById(studentId).exec();
    if (!student) throw new NotFoundException('Student no encontrado');

    // Obtener último pago activo
    const paymentId = student.payments.reverse().find(pid => Types.ObjectId.isValid(pid));
    if (!paymentId) throw new NotFoundException('No se encontró pago activo para este student');

    const payment = await this.paymentModel.findOne({ _id: paymentId, deletedAt: null }).exec();
    if (!payment) throw new NotFoundException('Pago activo no encontrado');

    payment.status = PaymentStatus.Completed;
    return payment.save();
  }
}
