import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpense } from './dto/createexpenses.dto';
import { UpdateExpense } from './dto/updateexpenses.dto';
import { Expense } from './schema/expenses.schema';


@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Body() expenseData: CreateExpense): Promise<Expense> {
    return this.expenseService.create(expenseData);
  }

  @Get()
  findAll(): Promise<Expense[]> {
    return this.expenseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Expense> {
    return this.expenseService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: UpdateExpense): Promise<Expense> {
    return this.expenseService.update(id, updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Expense> {
    return this.expenseService.delete(id);
  }
}
