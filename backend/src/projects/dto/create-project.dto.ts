// projects/dto/create-project.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}