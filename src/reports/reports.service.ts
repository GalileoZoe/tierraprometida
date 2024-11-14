import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reports } from './schema/reports.schema';
import { CreateReport } from './dto/createreport.dto';
import { UpdateReport } from './dto/updatereport.dto';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Reports.name) private readonly reportsModel: Model<Reports>,
    private readonly studentsService: StudentsService,  // Inyectamos el servicio de Students
  ) {}

  // Registrar un nuevo reporte para un estudiante específico
  async registerReport(createReport: CreateReport, studentId: string): Promise<Reports> {
    // Verificamos que el estudiante exista antes de crear el reporte
    const studentExists = await this.studentsService.findOne(studentId);
    if (!studentExists) {
      throw new NotFoundException(`Estudiante con ID ${studentId} no encontrado`);
    }

    const newReport = new this.reportsModel({
      ...createReport,
      idstudent: studentId, // Asociamos el reporte con el estudiante
    });

    // Guardamos y devolvemos el reporte
    return newReport.save();
  }

  // Obtener todos los reportes, incluyendo el ID del estudiante asociado
  async findAll(): Promise<Reports[]> {
    return this.reportsModel.find().populate('idstudent').exec();
  }

  // Obtener un reporte específico por ID, incluyendo los datos del estudiante
  async findOne(id: string): Promise<Reports> {
    const report = await this.reportsModel.findById(id).populate('idstudent').exec();
    if (!report) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }
    return report;
  }

  // Actualizar un reporte existente
  async update(id: string, updateReport: UpdateReport): Promise<Reports> {
    const updatedReport = await this.reportsModel.findByIdAndUpdate(id, updateReport, { new: true });
    if (!updatedReport) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }
    return updatedReport;
  }

  // Eliminar un reporte
  async delete(id: string): Promise<void> {
    const result = await this.reportsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }
  }

  // Obtener reportes por ID de estudiante
  async findReportsByStudentId(studentId: string): Promise<Reports[]> {
    const reports = await this.reportsModel.find({ idstudent: studentId }).exec();
    if (!reports || reports.length === 0) {
      throw new NotFoundException(`No se encontraron reportes para el estudiante con ID ${studentId}`);
    }
    return reports;
  }
}
