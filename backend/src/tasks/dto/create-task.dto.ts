import{
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    IsDateString,

} from 'class-validator'

import {
  TaskPriority,
} from '@prisma/client';


export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority; // vai validar apenas o tipo de prioridade, exemplo: low,medium e high

  @IsUUID()
  @IsOptional()
  assignedToId?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}