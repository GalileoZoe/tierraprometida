import { 
    IsString,  
    IsDateString,
    IsOptional
} from "class-validator";

export class UpdateLogin {

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
    image?: string;

    @IsOptional()
    @IsDateString()
    update?: Date;

}
