import { Injectable, NotFoundException } from '@nestjs/common';
import { Students } from './schema/students.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStudent } from './dto/createstudent.dto';
import { UpdateStudent } from './dto/updatestudent.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Students.name) private readonly studentsModel: Model<Students>,
  ) {}

  async create(student: CreateStudent) {
    const createdStudent = new this.studentsModel(student);
    return createdStudent.save();
  }

  async update(id: string, student: UpdateStudent) {
    return this.studentsModel.findByIdAndUpdate(id, student, {
      new: true,
    }).exec();
  }

  async findOne(id: string): Promise<Students> {
    const student = await this.studentsModel.findById(id).exec();
    if (!student) throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    return student;
  }
  
  async findAll() {
    return this.studentsModel.find().exec();
  }

  async delete(id: string) {
    return this.studentsModel.findByIdAndDelete(id).exec();
  }
}
