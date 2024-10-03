import { Post, Body, ValidationPipe, Put, Delete, Get, Param } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudent } from './dto/createstudent.dto';
import { UpdateStudent } from './dto/updatestudent.dto';

@Controller('students')
export class StudentsController {

    constructor( private studentsService: StudentsService ){}

    @Post()
    async create( @Body( new ValidationPipe() ) createdStudent: CreateStudent ){
        return this.studentsService.create( createdStudent );
    }

    @Put(':id')
    async update( @Param('id') id: string, @Body( new ValidationPipe() ) updateStudent: UpdateStudent ){
        return this.studentsService.update(id, updateStudent);
    }

    @Get()
    async findAll(){
        return this.studentsService.findAll();
    }

    @Get(':id')
    async findOne( @Param('id') id: string ){
        return this.studentsService.findOne( id );
    }

    @Delete(':id')
    async delete( @Param('id') id: string ){
        return this.studentsService.delete( id );
    }

}