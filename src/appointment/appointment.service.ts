import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentStatus } from './schema/appointment.schema';
import { Students } from 'src/students/schema/students.schema';
import { CreateAppointment } from './dto/createappointment.dto';
import { UpdateAppointment } from './dto/updateappointment.dto';
import axios from 'axios';

@Injectable()
export class AppointmentService {

  private readonly logger = new Logger(AppointmentService.name);


  constructor(
    @InjectModel(Appointment.name) private readonly appointmentModel: Model<Appointment>,
    @InjectModel(Students.name) private readonly studentModel: Model<Students>,
  ) {}

  // ================================================
// 🔥 CREAR PAGO NORMAL Y COMPLETAR PROGRAMADO
// ================================================
async create(appointmentData: CreateAppointment): Promise<Appointment> {
  this.logger.log('🟦 Creando pago nuevo...');
  this.logger.debug(`📥 Datos recibidos:\n${JSON.stringify(appointmentData, null, 2)}`);

  const appointment = new this.appointmentModel({
    ...appointmentData,
    isScheduled: false,
  });

  const savedAppointment = await appointment.save();

  // Log para verificar si se guardó correctamente
  this.logger.log(`🟢 Pago guardado con ID: ${savedAppointment?._id}`);

  // Asociar pago a estudiante
  if (appointmentData.student) {
    this.logger.log(`🟦 Buscando estudiante ${appointmentData.student}...`);

    const student = await this.studentModel.findById(appointmentData.student).exec();
    if (!student) {
      this.logger.error(`❌ Student con ID ${appointmentData.student} no encontrado`);
      throw new NotFoundException('Student no encontrado');
    }

    // Validación crítica
    if (!savedAppointment?._id) {
      this.logger.error(
        `❌ savedAppointment._id llegó undefined. DTO recibido:\n${JSON.stringify(appointmentData, null, 2)}`
      );
    } else {
      this.logger.log(
        `🟢 Asociando pago ${savedAppointment._id} al estudiante ${student._id}`
      );
      student.appointments.push(savedAppointment._id);
      await student.save();
      this.logger.log(`🟢 Se guardó correctamente la referencia en el estudiante.`);
    }
  }

  // AUTO COMPLETAR SI HAY PAGO PROGRAMADO RELACIONADO
  await this.autoCompleteScheduledAppointment(savedAppointment);
  this.logger.log('🟢 Revisión de pago programado completada.');

  return savedAppointment;
}


  // ========================================================
  // 🔥 MÉTODO PRIVADO: COMPLETAR AUTOMÁTICAMENTE PROGRAMADO
  // ========================================================
  private async autoCompleteScheduledAppointment(appointment: Appointment): Promise<void> {
    if (!appointment.student || !appointment.concept) return;

    const scheduled = await this.appointmentModel.findOne({
      student: appointment.student,
      concept: appointment.concept,
      isScheduled: true,
      status: AppointmentStatus.Pending,
      deletedAt: null,
    });

    if (scheduled) {
      scheduled.status = AppointmentStatus.Completed;
      await scheduled.save();
    }
  }

  // ================================================
  // 🔥 CREAR PAGO PROGRAMADO
  // ================================================
  async createScheduled(appointmentData: CreateAppointment): Promise<Appointment> {
    const scheduled = new this.appointmentModel({
      ...appointmentData,
      isScheduled: true,
      status: AppointmentStatus.Pending,
    });

    return scheduled.save();
  }

  // ================================================
  // 🔥 LISTAR PROGRAMADOS
  // ================================================
  async findScheduled(): Promise<Appointment[]> {
    return this.appointmentModel.find({ isScheduled: true, deletedAt: null }).exec();
  }

  // ================================================
  // 🔥 ELIMINAR PROGRAMADO
  // ================================================
  async deleteScheduled(id: string): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');

    const appointment = await this.appointmentModel.findOneAndUpdate(
      { _id: id, isScheduled: true, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!appointment)
      throw new NotFoundException(`Pago programado con ID ${id} no encontrado`);

    return appointment;
  }

  // ================================================
  // 🔥 COMPLETAR PROGRAMADO MANUALMENTE
  // ================================================
  async completeScheduled(id: string): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');

    const appointment = await this.appointmentModel.findOne({
      _id: id,
      isScheduled: true,
      deletedAt: null,
    });

    if (!appointment) throw new NotFoundException(`Pago programado con ID ${id} no encontrado`);

    appointment.status = AppointmentStatus.Completed;

    return appointment.save();
  }

  // ================================================
  // 🔥 CRUD ORIGINAL (NO PROGRAMADOS)
  // ================================================
  async findAll(): Promise<Appointment[]> {
    return this.appointmentModel.find({ deletedAt: null, isScheduled: false }).exec();
  }

  async findOne(id: string): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');

    const appointment = await this.appointmentModel.findOne({ _id: id });

    if (!appointment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);

    return appointment;
  }

  async update(id: string, updateData: UpdateAppointment): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');

    const appointment = await this.appointmentModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      updateData,
      { new: true, runValidators: true }
    );

    if (!appointment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);

    return appointment;
  }

  async delete(id: string): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');

    const appointment = await this.appointmentModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!appointment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);

    return appointment;
  }

  async restore(id: string): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('ID no válido');

    const appointment = await this.appointmentModel.findOneAndUpdate(
      { _id: id, deletedAt: { $ne: null } },
      { deletedAt: null },
      { new: true }
    );

    if (!appointment)
      throw new NotFoundException(`Pago con ID ${id} no encontrado o no eliminado`);

    return appointment;
  }

async markAppointmentAsCompleted(appointmentId: string): Promise<Appointment> {
  if (!Types.ObjectId.isValid(appointmentId)) {
    throw new BadRequestException('ID de pago inválido');
  }

  const appointment = await this.appointmentModel.findById(appointmentId);

  if (!appointment) {
    throw new NotFoundException('Pago no encontrado');
  }

  appointment.status = AppointmentStatus.Completed;
  appointment.datePaid = new Date();

  return appointment.save();
}


async generateMercadoPagoCheckout(appointmentId: string) {
    const appointment = await this.appointmentModel.findById(appointmentId);

    if (!appointment) {
      throw new Error(`No se encontró el pago con id ${appointmentId}`);
    }

    // Crear preferencia de pago en MercadoPago
    const pref = {
      items: [
        {
          title: appointment.concept,
          quantity: 1,
          currency_id: "MXN",
          unit_price: appointment.amount,
        },
      ],
      external_reference: appointmentId, // 🔥 IMPORTANTE
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
