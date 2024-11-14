// reports.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reports } from './schema/reports.schema';
import { CreateReport } from './dto/createreport.dto';
import { UpdateReport } from './dto/updatereport.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectModel(Reports.name) private reportsModel: Model<Reports>,
    ) {}

    // Método para registrar un nuevo reporte con un argumento adicional opcional
    async registerReport(createReport: CreateReport, additionalArg?: string): Promise<Reports> {
        const newReport = new this.reportsModel({
            ...createReport,
            additionalField: additionalArg, // Agregar algún campo adicional si es necesario
        });
        return newReport.save();
    }

    // Actualizar un reporte existente por ID
    async update(id: string, updateReport: UpdateReport): Promise<Reports> {
        const updatedReport = await this.reportsModel.findByIdAndUpdate(id, updateReport, { new: true });
        if (!updatedReport) {
            throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
        }
        return updatedReport;
    }

    // Obtener todos los reportes con la información del estudiante
    async findAll(): Promise<Reports[]> {
        return this.reportsModel.find().populate('idstudent').exec();
    }

    // Obtener un reporte específico por ID con la información del estudiante
    async findOne(id: string): Promise<Reports> {
        const report = await this.reportsModel.findById(id).populate('idstudent').exec();
        if (!report) {
            throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
        }
        return report;
    }

    // Eliminar un reporte por ID
    async delete(id: string): Promise<void> {
        const result = await this.reportsModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
        }
    }
}
