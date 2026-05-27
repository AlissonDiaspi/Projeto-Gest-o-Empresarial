import { IsEnum } from 'class-validator';

import { TaskStatus } from '@prisma/client';

export class UpdateTaskStatusDto { // apenas tem como mudar o status da task
  @IsEnum(TaskStatus)
  status!: TaskStatus;
}