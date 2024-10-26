import { Post, Body, ValidationPipe, Put, Delete, Get, Param } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUser } from './dto/createuser.dto';
import { UpdateUser } from './dto/updateuser.dto';

@Controller('users')
export class UsersController {

    constructor( private usersService: UsersService ){}

    @Post()
    async create( @Body( new ValidationPipe() ) createdStudent: CreateUser ){
        return this.usersService.create( createdStudent );
    }

    @Put(':id')
    async update( @Param('id') id: string, @Body( new ValidationPipe() )UpdateUser:UpdateUser ){
        return this.usersService.update(id,UpdateUser);
    }

    @Get()
    async findAll(){
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne( @Param('id') id: string ){
        return this.usersService.findOne( id );
    }

    @Delete(':id')
    async delete( @Param('id') id: string ){
        return this.usersService.delete( id );
    }

}