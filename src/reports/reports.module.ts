import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Reports, ReportsSchema } from './schema/reports.schema';
import { StudentsModule } from 'src/students/students.module';

@Module({
  imports: [
    forwardRef(() => StudentsModule), // forwardRef es suficiente para manejar la dependencia
    MongooseModule.forFeature([
      { name: Reports.name, schema: ReportsSchema },
    ]),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [
    ReportsService,
    MongooseModule.forFeature([{ name: Reports.name, schema: ReportsSchema }]),
  ],
})
export class ReportsModule {}
