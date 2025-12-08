import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {User, UsersSchema } from './schema/users.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UsersSchema,
            }
        ]),    
    ],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {}