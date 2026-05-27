import {
  IsDateString,
} from 'class-validator';

export class UpdateTaskDueDateDto {
  @IsDateString()
  dueDate!: string;
}