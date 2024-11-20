import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reports } from './schema/reports.schema';
import { CreateReport } from './dto/createreport.dto';
import { UpdateReport } from './dto/updatereport.dto';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Reports.name) private readonly reportsModel: Model<Reports>,
    private readonly studentsService: StudentsService,
  ) {}

  /**
   * Crear un nuevo reporte para un estudiante
   */
  async create(createReport: CreateReport, studentId: string): Promise<Reports> {
    // Validar que el estudiante exista
    const student = await this.studentsService.findOne(studentId);
    if (!student) {
      throw new NotFoundException(`Estudiante con ID ${studentId} no encontrado`);
    }

    // Crear el reporte y asociarlo al estudiante
    const newReport = new this.reportsModel({
      ...createReport,
      idstudent: studentId,
    });

    return newReport.save();
  }

  /**
   * Obtener todos los reportes
   */
  async findAll(): Promise<Reports[]> {
    return this.reportsModel.find().populate('idstudent').exec();
  }

  /**
   * Obtener un reporte por ID
   */
  async findOne(reportId: string): Promise<Reports> {
    const report = await this.reportsModel
      .findById(reportId)
      .populate('idstudent')
      .exec();

    if (!report) {
      throw new NotFoundException(`Reporte con ID ${reportId} no encontrado`);
    }
    return report;
  }

  /**
   * Obtener todos los reportes de un estudiante específico
   */
  async findByStudent(studentId: string): Promise<Reports[]> {
    // Verificar que el estudiante exista
    const student = await this.studentsService.findOne(studentId);
    if (!student) {
      throw new NotFoundException(`Estudiante con ID ${studentId} no encontrado`);
    }

    // Obtener reportes asociados al estudiante
    const reports = await this.reportsModel
      .find({ idstudent: studentId })
      .populate('idstudent')
      .exec();

    if (!reports.length) {
      throw new NotFoundException(
        `No se encontraron reportes para el estudiante con ID ${studentId}`,
      );
    }

    return reports;
  }

  /**
   * Actualizar un reporte por ID
   */
  async update(reportId: string, updateReport: UpdateReport): Promise<Reports> {
    const updatedReport = await this.reportsModel
      .findByIdAndUpdate(reportId, updateReport, { new: true })
      .exec();

    if (!updatedReport) {
      throw new NotFoundException(`Reporte con ID ${reportId} no encontrado`);
    }

    return updatedReport;
  }

  /**
   * Eliminar un reporte por ID
   */
  async delete(reportId: string): Promise<void> {
    const deletedReport = await this.reportsModel.findByIdAndDelete(reportId).exec();
    if (!deletedReport) {
      throw new NotFoundException(`Reporte con ID ${reportId} no encontrado`);
    }
  }
}
