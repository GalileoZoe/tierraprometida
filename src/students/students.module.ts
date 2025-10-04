import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Students, StudentsSchema } from './schema/students.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Students.name, schema: StudentsSchema }]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService], // solo el service
})
export class StudentsModule {}
