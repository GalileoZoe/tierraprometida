import { 
    IsString, 
    IsDateString,
    IsOptional
} from "class-validator";

export class CreateLogin {

    
    @IsString()
    @IsOptional()
    photo?: string;

    @IsString()
    @IsOptional()
    username?: string;
    
    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    rol?: string;

    @IsOptional()
    @IsDateString()
    update?: Date;

}
