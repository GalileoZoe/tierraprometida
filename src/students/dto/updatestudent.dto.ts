import { IsString, IsOptional, IsEmail} from 'class-validator';
import { StudentStatus } from '../schema/students.schema';

export class UpdateStudent {

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    lastname: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    age: string;

    @IsString()
    @IsOptional()
    curp: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    drug: string;

    @IsString()
    @IsOptional()
    tutor: string;

    @IsString()
    @IsOptional()
    file: string;

    @IsOptional()
    files?: string[];

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    startdate: string;

    @IsString()
    @IsOptional()
    enddate: string;

    @IsOptional()
    status?: StudentStatus;
}
