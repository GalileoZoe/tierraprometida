import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateExpense } from './dto/createexpenses.dto';
import { UpdateExpense } from './dto/updateexpenses.dto';
import { Expense } from './schema/expenses.schema';
import { Income } from 'src/income/schema/income.schema';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name) private readonly expenseModel: Model<Expense>,
    @InjectModel(Income.name) private readonly incomeModel: Model<Income>,
  ) {}

  /** ✅ Crea un gasto y recalcula las ganancias globales */
  async create(dto: CreateExpense): Promise<Expense> {
    const expense = new this.expenseModel(dto);
    await expense.save();
    await this.recalculateProfits();
    return expense;
  }

  /** ✅ Obtiene todos los gastos activos */
  async findAll(): Promise<Expense[]> {
    return this.expenseModel.find({ deletedAt: null }).sort({ createdAt: -1 }).exec();
  }

  /** ✅ Obtiene un gasto por ID */
  async findOne(id: string): Promise<Expense> {
    this.validateObjectId(id);
    const expense = await this.expenseModel.findOne({ _id: id, deletedAt: null }).exec();
    if (!expense) throw new NotFoundException(`Gasto con ID ${id} no encontrado`);
    return expense;
  }

  /** ✅ Actualiza un gasto y recalcula ganancias */
  async update(id: string, dto: UpdateExpense): Promise<Expense> {
    this.validateObjectId(id);
    const expense = await this.expenseModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      dto,
      { new: true, runValidators: true },
    ).exec();

    if (!expense) throw new NotFoundException(`Gasto con ID ${id} no encontrado`);
    await this.recalculateProfits();
    return expense;
  }

  /** ✅ Elimina un gasto (soft delete) */
  async delete(id: string): Promise<Expense> {
    this.validateObjectId(id);
    const expense = await this.expenseModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true },
    ).exec();

    if (!expense) throw new NotFoundException(`Gasto con ID ${id} no encontrado`);
    await this.recalculateProfits();
    return expense;
  }

  /** 🧮 Recalcula las ganancias globales */
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

    // Sincroniza profits en ambas colecciones
    await Promise.all([
      this.incomeModel.updateMany({ deletedAt: null }, { $set: { profits } }),
      this.expenseModel.updateMany({ deletedAt: null }, { $set: { profits } }),
    ]);
  }

  /** 🧩 Valida IDs de MongoDB */
  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID no válido');
    }
  }
}
