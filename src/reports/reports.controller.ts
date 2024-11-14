import { Controller, Post, Body, ValidationPipe, Put, Delete, Get, Param, NotFoundException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReport } from './dto/createreport.dto';
import { UpdateReport } from './dto/updatereport.dto';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    // Crear un nuevo reporte
    @Post()
    async create(@Body(new ValidationPipe()) createReport: CreateReport) {
        const additionalArg = 'someAdditionalValue';  // Define aquí el valor adicional que necesitas
        return this.reportsService.registerReport(createReport, additionalArg);
    }

    // Actualizar un reporte existente por ID
    @Put(':id')
    async update(@Param('id') id: string, @Body(new ValidationPipe()) updateReport: UpdateReport) {
        return this.reportsService.update(id, updateReport);
    }

    // Obtener todos los reportes
    @Get()
    async findAll() {
        return this.reportsService.findAll();
    }

    // Obtener un reporte específico por ID
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const report = await this.reportsService.findOne(id);
        if (!report) {
            throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
        }
        return report;
    }

    // Eliminar un reporte por ID
    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.reportsService.delete(id);
        return { message: `Reporte con ID ${id} eliminado correctamente` };
    }
}
