import { IsString, IsOptional, IsEmail} from 'class-validator';
import { StudentStatus } from '../schema/students.schema';

export class UpdateStudent {

    @IsString()
    @IsOptional()
    number?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    lastname?: string;Q

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
   gender?: string;

    @IsString()
    @IsOptional()
    age?: string;

    @IsString()
    @IsOptional()
    curp?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    drug?: string;

    @IsString()
    @IsOptional()
    tutor?: string;

    @IsString()
    @IsOptional()
    stay?: string;
    
    @IsString()
    @IsOptional()
    file?: string;

    @IsOptional()
    files?: string[];

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    startdate?: string;

    @IsString()
    @IsOptional()
    enddate?: string;

    @IsOptional()
    status?: StudentStatus;
}
