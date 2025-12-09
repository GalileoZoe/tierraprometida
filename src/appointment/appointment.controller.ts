import { 
  Controller, Post, Body, ValidationPipe, Put, Delete, Get, Param, Patch 
} from '@nestjs/common';
import { Appointment } from './schema/appointment.schema';
import { UpdateAppointment } from './dto/updateappointment.dto';
import { CreateAppointment } from './dto/createappointment.dto';
import { AppointmentService } from './appointment.service';


@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}


  @Post('mp/checkout/:appointmentId')
async createMercadoPagoCheckout(@Param('appointmentId') appointmentId: string) {
  return this.appointmentService.generateMercadoPagoCheckout(appointmentId);
}

  // =============================================
  //               CRUD NORMAL
  // =============================================
  @Post()
  async create(@Body(new ValidationPipe()) createAppointment: CreateAppointment): Promise<Appointment> {
    return this.appointmentService.create(createAppointment);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateAppointment: UpdateAppointment
  ): Promise<Appointment> {
    return this.appointmentService.update(id, updateAppointment);
  }

  @Patch('complete/:id')
  async completePayment(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.markAppointmentAsCompleted(id);
  }

  @Get()
  async findAll(): Promise<Appointment[]> {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.delete(id);
  }

  @Patch('restore/:id')
  async restore(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.restore(id);
  }

  // =============================================
  //           PROGRAMADOS
  // =============================================
  @Post('scheduled')
  async createScheduled(@Body(new ValidationPipe()) createAppointment: CreateAppointment): Promise<Appointment> {
    return this.appointmentService.createScheduled(createAppointment);
  }

  @Get('scheduled')
  async findScheduled(): Promise<Appointment[]> {
    return this.appointmentService.findScheduled();
  }

  @Delete('scheduled/:id')
  async deleteScheduled(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.deleteScheduled(id);
  }

  @Patch('scheduled/complete/:id')
  async completeScheduled(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.completeScheduled(id);
  }
}
