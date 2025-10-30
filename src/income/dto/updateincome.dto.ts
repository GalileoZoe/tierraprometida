import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  IsDateString, 
  IsBoolean 
} from 'class-validator';

export class UpdateIncome {
  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  concept: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  notes?: string;

 
  @IsOptional()
  deletedAt?: Date;

  @IsNumber()
  @IsOptional()
  profits?: number;

}
