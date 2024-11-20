import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { ReportsService } from './reports.service';
  import { CreateReport } from './dto/createreport.dto';
  import { UpdateReport } from './dto/updatereport.dto';
  import { Reports } from './schema/reports.schema';
  
  @Controller('reports')
  export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}
  
    /**
     * Crear un nuevo reporte asociado a un estudiante
     * @param studentId ID del estudiante
     * @param createReport Datos del reporte a crear
     */
    @Post(':studentId')
    async createReport(
      @Param('studentId') studentId: string,
      @Body() createReport: CreateReport,
    ): Promise<Reports> {
      try {
        return await this.reportsService.create(createReport, studentId);
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        throw new BadRequestException('Error al crear el reporte.');
      }
    }
  
    /**
     * Obtener todos los reportes
     */
    @Get()
    async findAll(): Promise<Reports[]> {
      return this.reportsService.findAll();
    }
  
    /**
     * Obtener un reporte por su ID
     * @param id ID del reporte
     */
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Reports> {
      try {
        return await this.reportsService.findOne(id);
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        throw new BadRequestException('Error al buscar el reporte.');
      }
    }
  
    /**
     * Obtener todos los reportes asociados a un estudiante
     * @param studentId ID del estudiante
     */
    @Get('student/:studentId')
    async findReportsByStudentId(
      @Param('studentId') studentId: string,
    ): Promise<Reports[]> {
      try {
        return await this.reportsService.findByStudent(studentId);
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        throw new BadRequestException(
          'Error al buscar reportes del estudiante.',
        );
      }
    }
  
    /**
     * Actualizar un reporte
     * @param id ID del reporte
     * @param updateReport Datos a actualizar
     */
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateReport: UpdateReport,
    ): Promise<Reports> {
      try {
        return await this.reportsService.update(id, updateReport);
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        throw new BadRequestException('Error al actualizar el reporte.');
      }
    }
  
    /**
     * Eliminar un reporte
     * @param id ID del reporte
     */
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ message: string }> {
      try {
        await this.reportsService.delete(id);
        return { message: 'Reporte eliminado correctamente.' };
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        throw new BadRequestException('Error al eliminar el reporte.');
      }
    }
  }
  