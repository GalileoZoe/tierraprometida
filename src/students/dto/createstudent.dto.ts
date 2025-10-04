import { 
  IsString, 
  IsOptional, 
  ValidateNested, 
  IsArray, 
  IsNumber, 
  IsBoolean 
} from 'class-validator';
import { Type } from 'class-transformer';
import { StudentStatus } from '../schema/students.schema';

class ReportDTO {
  @IsString()
  report: string;

  @IsString()
  autor: string;

  @IsString()
  date: string;
}

class FileDTO {
  @IsString()
  file: string;

  @IsString()
  title: string;

  @IsString()
  date: string;
}

export class CreateStudent {
  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  blood?: string;

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
  disease?: string;

  @IsString()
  @IsOptional()
  allergy?: string;

  @IsString()
  @IsOptional()
  drug?: string;

  @IsString()
  @IsOptional()
  stigma?: string;

  @IsString()
  @IsOptional()
  treatment?: string;

  @IsString()
  @IsOptional()
  tutor?: string;

  @IsString()
  @IsOptional()
  stay?: string;

  // Archivos
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDTO)
  @IsOptional()
  files?: FileDTO[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  startdate?: string;

  @IsString()
  @IsOptional()
  enddate?: string;

  @IsString()
  @IsOptional()
  service?: string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsString()
  @IsOptional()
  psychology?: string;

  @IsString()
  @IsOptional()
  sessions?: string;

  @IsNumber()
  @IsOptional()
  check?: number;

  @IsString()
  @IsOptional()
  medicine?: string;

  @IsOptional()
  status?: StudentStatus;

  // Reports
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportDTO)
  @IsOptional()
  reports?: ReportDTO[];

  // Soft delete
  @IsBoolean()
  @IsOptional()
  softdelete?: boolean;  // ✅ true = eliminado, false = activo
}
