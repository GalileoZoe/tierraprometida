import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { Expense, ExpenseSchema } from './schema/expenses.schema';
import { IncomeModule } from 'src/income/income.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    forwardRef(() => IncomeModule), 
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService, MongooseModule],
})
export class ExpenseModule {}
