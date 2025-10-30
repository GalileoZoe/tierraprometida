import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { Income, IncomeSchema } from './schema/income.schema';
import { ExpenseModule } from 'src/expense/expense.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Income.name, schema: IncomeSchema }]),
    forwardRef(() => ExpenseModule),
  ],
  controllers: [IncomeController],
  providers: [IncomeService],
  exports: [IncomeService, MongooseModule],
})
export class IncomeModule {}
