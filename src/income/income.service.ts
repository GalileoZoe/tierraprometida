import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense } from 'src/expense/schema/expenses.schema';
import { Income } from './schema/income.schema';
import { CreateIncome } from './dto/createincome.dto';
import { UpdateIncome } from './dto/updateincome.dto';

@Injectable()
export class IncomeService {
  constructor(
    @InjectModel(Income.name) private readonly incomeModel: Model<Income>,
    @InjectModel(Expense.name) private readonly expenseModel: Model<Expense>,
  ) {}

  /** ✅ Crea un nuevo ingreso y actualiza las ganancias */
  async create(dto: CreateIncome): Promise<Income> {
    const income = new this.incomeModel(dto);
    await income.save();
    await this.recalculateProfits();
    return income;
  }

  /** ✅ Obtiene todos los ingresos activos */
  async findAll(): Promise<Income[]> {
    return this.incomeModel.find({ deletedAt: null }).sort({ createdAt: -1 }).exec();
  }

  /** ✅ Obtiene un ingreso por ID */
  async findOne(id: string): Promise<Income> {
    this.validateObjectId(id);
    const income = await this.incomeModel.findOne({ _id: id, deletedAt: null }).exec();
    if (!income) throw new NotFoundException(`Ingreso con ID ${id} no encontrado`);
    return income;
  }

  /** ✅ Actualiza un ingreso y recalcula las ganancias */
  async update(id: string, dto: UpdateIncome): Promise<Income> {
    this.validateObjectId(id);
    const income = await this.incomeModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      dto,
      { new: true, runValidators: true },
    ).exec();

    if (!income) throw new NotFoundException(`Ingreso con ID ${id} no encontrado`);
    await this.recalculateProfits();
    return income;
  }

  /** ✅ "Elimina" un ingreso (soft delete) */
  async delete(id: string): Promise<Income> {
    this.validateObjectId(id);
    const income = await this.incomeModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true },
    ).exec();

    if (!income) throw new NotFoundException(`Ingreso con ID ${id} no encontrado`);
    await this.recalculateProfits();
    return income;
  }

  /** 🧮 Recalcula las ganancias totales y actualiza el campo profits en todos los ingresos */
  private async recalculateProfits(): Promise<void> {
    const [expenseAgg, incomeAgg] = await Promise.all([
      this.expenseModel.aggregate([
        { $match: { deletedAt: null } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.incomeModel.aggregate([
        { $match: { deletedAt: null } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalExpenses = expenseAgg[0]?.total || 0;
    const totalIncomes = incomeAgg[0]?.total || 0;
    const profits = totalIncomes - totalExpenses;

    await this.incomeModel.updateMany(
      { deletedAt: null },
      { $set: { profits } },
    );
  }

  /** 🧩 Valida IDs de MongoDB */
  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID no válido');
    }
  }
}
