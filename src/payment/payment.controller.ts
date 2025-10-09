import { 
  Controller, Post, Body, ValidationPipe, Put, Delete, Get, Param, Patch 
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePayment } from './dto/createpayment.dto';
import { UpdatePayment } from './dto/updatepayment.dto';
import { Payment } from './schema/payment.schema';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createPayment: CreatePayment): Promise<Payment> {
    return this.paymentService.create(createPayment);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updatePayment: UpdatePayment
  ): Promise<Payment> {
    return this.paymentService.update(id, updatePayment);
  }

  @Patch('complete/:id')
  async completePayment(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.markPaymentAsCompleted(id);
  }

  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.delete(id);
  }

  @Patch('restore/:id')
  async restore(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.restore(id);
  }

  // --- NUEVOS ENDPOINTS PROGRAMADOS ---
  @Post('scheduled')
  async createScheduled(@Body(new ValidationPipe()) createPayment: CreatePayment): Promise<Payment> {
    return this.paymentService.createScheduled(createPayment);
  }

  @Get('scheduled')
  async findScheduled(): Promise<Payment[]> {
    return this.paymentService.findScheduled();
  }

  @Delete('scheduled/:id')
  async deleteScheduled(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.deleteScheduled(id);
  }

  @Patch('scheduled/complete/:id')
  async completeScheduled(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.completeScheduled(id);
  }
}
