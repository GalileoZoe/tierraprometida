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

  @Patch('complete/student/:studentId')
  async completePayment(@Param('studentId') studentId: string): Promise<Payment> {
    return this.paymentService.markStudentPaymentAsCompleted(studentId);
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
}
