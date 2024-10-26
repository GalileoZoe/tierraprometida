import { Injectable } from '@nestjs/common';
import { Users } from './schema/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUser } from './dto/createuser.dto';
import { UpdateUser } from './dto/updateuser.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel( Users.name ) private UsersModel : Model<Users>
    ){}

    async create( user: CreateUser ){
        const createdUser = new this.UsersModel( user );
        return createdUser.save();
    }

    async update( id: string, user: UpdateUser ){
        return this.UsersModel.findByIdAndUpdate( id, user, {
            new: true,
        })
        .exec();
    }

    async findOne( id: string ){
        return this.UsersModel.findById( id ).exec();
    }
    
    async findAll(){
        return this.UsersModel.find().exec();
    }

    async delete( id: string ){
        return this.UsersModel.findByIdAndDelete( id ).exec();
    }
}