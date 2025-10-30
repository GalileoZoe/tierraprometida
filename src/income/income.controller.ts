import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateIncome } from './dto/createincome.dto';
import { UpdateIncome } from './dto/updateincome.dto';
import { IncomeService } from './income.service';
import { Income } from './schema/income.schema';

@Controller('incomes')

export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  create(@Body() incomeData: CreateIncome): Promise<Income> {
    return this.incomeService.create(incomeData);
  }

  @Get()
  findAll(): Promise<Income[]> {
    return this.incomeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Income> {
    return this.incomeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: UpdateIncome): Promise<Income> {
    return this.incomeService.update(id, updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Income> {
    return this.incomeService.delete(id);
  }
}
