import { Injectable } from '@nestjs/common';
import { Students } from './schema/students.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStudent } from './dto/createstudent.dto';
import { UpdateStudent } from './dto/updatestudent.dto';

@Injectable()
export class StudentsService {

    constructor(
        @InjectModel( Students.name ) private StudentsModel : Model<Students>
    ){}

    async create( student: CreateStudent ){
        const createdStudent = new this.StudentsModel( student );
        return createdStudent.save();
    }

    async update( id: string, student: UpdateStudent ){
        return this.StudentsModel.findByIdAndUpdate( id, student, {
            new: true,
        })
        .exec();
    }

    async findOne( id: string ){
        return this.StudentsModel.findById( id ).exec();
    }
    
    async findAll(){
        return this.StudentsModel.find().exec();
    }

    async delete( id: string ){
        return this.StudentsModel.findByIdAndDelete( id ).exec();
    }
}