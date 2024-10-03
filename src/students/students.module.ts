import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Students, StudentsSchema } from './schema/students.schema';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';


@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Students.name,
                schema: StudentsSchema,
            }
        ]),    
    ],
    providers: [StudentsService],
    controllers: [StudentsController]
})
export class StudentsModule {}