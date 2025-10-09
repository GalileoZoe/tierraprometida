import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Students } from './schema/students.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStudent } from './dto/createstudent.dto';
import { UpdateStudent } from './dto/updatestudent.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Students.name) private readonly studentModel: Model<Students>,
  ) {}

  // Crear un nuevo estudiante
  async create(student: CreateStudent): Promise<Students> {
    try {
      const createdStudent = new this.studentModel(student);
      return await createdStudent.save();
    } catch (error) {
      console.error('Error al crear estudiante:', error.message);
      throw new BadRequestException('Error al crear el estudiante. Verifica los datos enviados.');
    }
  }

  // Actualizar un estudiante existente
  async update(id: string, student: UpdateStudent): Promise<Students> {
    try {
      const updatedStudent = await this.studentModel.findByIdAndUpdate(id, student, {
        new: true,
        runValidators: true,
      }).exec();

      if (!updatedStudent) {
        throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
      }
      return updatedStudent;
    } catch (error) {
      console.error('Error al actualizar estudiante:', error.message);
      throw new BadRequestException('Error al actualizar el estudiante. Verifica los datos enviados.');
    }
  }

  // Obtener un estudiante por ID
  async findOne(id: string): Promise<Students> {
    try {
      const student = await this.studentModel.findById(id).exec();
      if (!student || student.softdelete) {
        throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
      }
      return student;
    } catch (error) {
      console.error('Error al buscar estudiante:', error.message);
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
  }

  // Obtener todos los estudiantes activos
  async findAll(): Promise<Students[]> {
    try {
      return await this.studentModel.find({ softdelete: false }).exec();
    } catch (error) {
      console.error('Error al obtener estudiantes:', error.message);
      throw new BadRequestException('Error al obtener los estudiantes.');
    }
  }

  // Soft delete de un estudiante
  async softDelete(id: string): Promise<Students> {
    try {
      const student = await this.studentModel.findByIdAndUpdate(
        id,
        { softdelete: true },
        { new: true }
      ).exec();

      if (!student) {
        throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
      }
      return student;
    } catch (error) {
      console.error('Error al eliminar estudiante (soft):', error.message);
      throw new BadRequestException('Error al eliminar el estudiante.');
    }
  }

  // Restaurar estudiante eliminado
  async restore(id: string): Promise<Students> {
    try {
      const student = await this.studentModel.findByIdAndUpdate(
        id,
        { softdelete: false },
        { new: true }
      ).exec();

      if (!student) {
        throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
      }
      return student;
    } catch (error) {
      console.error('Error al restaurar estudiante:', error.message);
      throw new BadRequestException('Error al restaurar el estudiante.');
    }
  }

  // Eliminar permanentemente un estudiante
  async delete(id: string): Promise<void> {
    try {
      const deletedStudent = await this.studentModel.findByIdAndDelete(id).exec();
      if (!deletedStudent) {
        throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
      }
    } catch (error) {
      console.error('Error al eliminar estudiante:', error.message);
      throw new BadRequestException('Error al eliminar el estudiante.');
    }
  }

  // Buscar estudiantes por campos específicos (solo activos)
  async findByField(field: string, value: string): Promise<Students[]> {
    try {
      const query = { [field]: value, softdelete: false };
      return await this.studentModel.find(query).exec();
    } catch (error) {
      console.error('Error al buscar estudiantes:', error.message);
      throw new BadRequestException('Error al buscar estudiantes por campo.');
    }
  }

  async findByEmail(email: string) {
    return await this.studentModel.findOne({ email });
}

}
