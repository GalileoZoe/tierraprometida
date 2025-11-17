import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentStatus } from './schema/payment.schema';
import { Students } from 'src/students/schema/students.schema';
import { CreatePayment } from './dto/createpayment.dto';
import { UpdatePayment } from './dto/updatepayment.dto';
import axios from 'axios';

@Injectable()
export class PaymentService {

  private readonly logger = new Logger(PaymentService.name);


  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Students.name) private readonly studentModel: Model<Students>,
  ) {}

  // ================================================
// 🔥 CREAR PAGO NORMAL Y COMPLETAR PROGRAMADO
// ================================================
async create(paymentData: CreatePayment): Promise<Payment> {
  this.logger.log('🟦 Creando pago nuevo...');
  this.logger.debug(`📥 Datos recibidos:\n${JSON.stringify(paymentData, null, 2)}`);

  const payment = new this.paymentModel({
    ...paymentData,
    isScheduled: false,
  });

  const savedPayment = await payment.save();

  // Log para verificar si se guardó correctamente
  this.logger.log(`🟢 Pago guardado con ID: ${savedPayment?._id}`);

  // Asociar pago a estudiante
  if (paymentData.student) {
    this.logger.log(`🟦 Buscando estudiante ${paymentData.student}...`);

    const student = await this.studentModel.findById(paymentData.student).exec();
    if (!student) {
      this.logger.error(`❌ Student con ID ${paymentData.student} no encontrado`);
      throw new NotFoundException('Student no encontrado');
    }

    // Validación crítica
    if (!savedPayment?._id) {
      this.logger.error(
        `❌ savedPayment._id llegó undefined. DTO recibido:\n${JSON.stringify(paymentData, null, 2)}`
      );
    } else {
      this.logger.log(
        `🟢 Asociando pago ${savedPayment._id} al estudiante ${student._id}`
      );
      student.payments.push(savedPayment._id);
      await student.save();
      this.logger.log(`🟢 Se guardó correctamente la referencia en el estudiante.`);
    }
  }

  // AUTO COMPLETAR SI HAY PAGO PROGRAMADO RELACIONADO
  await this.autoCompleteScheduledPayment(savedPayment);
  this.logger.log('🟢 Revisión de pago programado completada.');

  return savedPayment;
}


  // ========================================================
  // 🔥 MÉTODO PRIVADO: COMPLETAR AUTOMÁTICAMENTE PROGRAMADO
  // ========================================================
  private async autoCompleteScheduledPayment(payment: Payment): Promise<void> {
    if (!payment.student || !payment.concept) return;

    const scheduled = await this.paymentModel.findOne({
      student: payment.student,
      concept: payment.concept,
      isScheduled: true,
      status: PaymentStatus.Pending,
      deletedAt: null,
    });

    if (scheduled) {
      scheduled.status = PaymentStatus.Completed;
      await scheduled.save();
    }
  }

  // ================================================
  // 🔥 CREAR PAGO PROGRAMADO
  // ================================================
  async createScheduled(paymentData: CreatePayment): Promise<Payment> {
    const scheduled = new this.paymentModel({
      ...paymentData,
      isScheduled: true,
      status: PaymentStatus.Pending,
    });

    return scheduled.save();
  }

  // ================================================
  // 🔥 LISTAR PROGRAMADOS
  // ================================================
  async findScheduled(): Promise<Payment[]> {
    return this.paymentModel.find({ isScheduled: true, deletedAt: null }).exec();
  }

  // ================================================
  // 🔥 ELIMINAR PROGRAMADO
  // ================================================
  async deleteScheduled(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');

    const payment = await this.paymentModel.findOneAndUpdate(
      { _id: id, isScheduled: true, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!payment)
      throw new NotFoundException(`Pago programado con ID ${id} no encontrado`);

    return payment;
  }

  // ================================================
  // 🔥 COMPLETAR PROGRAMADO MANUALMENTE
  // ================================================
  async completeScheduled(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');

    const payment = await this.paymentModel.findOne({
      _id: id,
      isScheduled: true,
      deletedAt: null,
    });

    if (!payment) throw new NotFoundException(`Pago programado con ID ${id} no encontrado`);

    payment.status = PaymentStatus.Completed;

    return payment.save();
  }

  // ================================================
  // 🔥 CRUD ORIGINAL (NO PROGRAMADOS)
  // ================================================
  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find({ deletedAt: null, isScheduled: false }).exec();
  }

  async findOne(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');

    const payment = await this.paymentModel.findOne({ _id: id });

    if (!payment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);

    return payment;
  }

  async update(id: string, updateData: UpdatePayment): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');

    const payment = await this.paymentModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      updateData,
      { new: true, runValidators: true }
    );

    if (!payment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);

    return payment;
  }

  async delete(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');

    const payment = await this.paymentModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!payment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);

    return payment;
  }

  async restore(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');

    const payment = await this.paymentModel.findOneAndUpdate(
      { _id: id, deletedAt: { $ne: null } },
      { deletedAt: null },
      { new: true }
    );

    if (!payment)
      throw new NotFoundException(`Pago con ID ${id} no encontrado o no eliminado`);

    return payment;
  }

async markPaymentAsCompleted(paymentId: string): Promise<Payment> {
  if (!Types.ObjectId.isValid(paymentId)) {
    throw new BadRequestException('ID de pago inválido');
  }

  const payment = await this.paymentModel.findById(paymentId);

  if (!payment) {
    throw new NotFoundException('Pago no encontrado');
  }

  payment.status = PaymentStatus.Completed;
  payment.datePaid = new Date();

  return payment.save();
}


async generateMercadoPagoCheckout(paymentId: string) {
    const payment = await this.paymentModel.findById(paymentId);

    if (!payment) {
      throw new Error(`No se encontró el pago con id ${paymentId}`);
    }

    // Crear preferencia de pago en MercadoPago
    const pref = {
      items: [
        {
          title: payment.concept,
          quantity: 1,
          currency_id: "MXN",
          unit_price: payment.amount,
        },
      ],
      external_reference: paymentId, // 🔥 IMPORTANTE
      back_urls: {
        success: "http://localhost:3001",
        failure: "http://localhost:3001",
        pending: "http://localhost:3001",
      },
      auto_return: "approved",
    };

    try {
      const response = await axios.post(
        "https://api.mercadopago.com/checkout/preferences",
        pref,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      return {
        init_point: response.data.init_point,
        sandbox_init_point: response.data.sandbox_init_point,
      };

    } catch (error) {
      this.logger.error("Error creando preferencia:", error.response?.data);
      throw new Error("Error generando checkout de MercadoPago");
    }
  }


}
