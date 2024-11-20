import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Reports, ReportsSchema } from './schema/reports.schema';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [
    forwardRef(() => StudentsModule), // Usa forwardRef para evitar ciclos con StudentsModule
    MongooseModule.forFeature([
      { name: Reports.name, schema: ReportsSchema },
    ]),
    StudentsModule,
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [
    ReportsService,
    MongooseModule.forFeature([{ name: Reports.name, schema: ReportsSchema }]),
  ],
})
export class ReportsModule {}
