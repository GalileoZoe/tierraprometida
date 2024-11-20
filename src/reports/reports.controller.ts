import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReport } from './dto/createreport.dto';
import { UpdateReport } from './dto/updatereport.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post(':studentId')
  async create(
    @Param('studentId') studentId: string,
    @Body(new ValidationPipe()) createReport: CreateReport,
  ) {
    return this.reportsService.create(createReport, studentId);
  }

  @Get()
  async findAll() {
    return this.reportsService.findAll();
  }

  @Get(':reportId')
  async findOne(@Param('reportId') reportId: string) {
    return this.reportsService.findOne(reportId);
  }

  /**
   * Obtener todos los reportes de un estudiante específico
   */
  @Get('students/:studentId')
  async findByStudent(@Param('studentId') studentId: string) {
    return this.reportsService.findByStudent(studentId);
  }

  @Put(':reportId')
  async update(
    @Param('reportId') reportId: string,
    @Body(new ValidationPipe()) updateReport: UpdateReport,
  ) {
    return this.reportsService.update(reportId, updateReport);
  }

  @Delete(':reportId')
  async delete(@Param('reportId') reportId: string) {
    return this.reportsService.delete(reportId);
  }
}
