import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  Patch,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';

import { TasksService } from './tasks.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/RolesGuard';

import { Roles } from '../auth/decorators/roles.decorator';

import { Role,
    TaskStatus,
    TaskPriority
 } from '@prisma/client';

import { CreateTaskDto } from './dto/create-task.dto';

import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

import { AssignTaskDto } from './dto/assign-task.dto';

import { UpdateTaskDueDateDto } from './dto/update-task-due-date.dto';

@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(
    private tasksService: TasksService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.OWNER,
    Role.ADMIN,
    Role.MEMBER,
  )
  @Post()
  async create( // endpoint para criação de uma nova task, que qualquer um pode criar
    @Param('projectId')
    projectId: string,

    @Req() req: any,

    @Body() body: CreateTaskDto,
  ) {
    return this.tasksService.create(
      projectId,

      req.user.id,

      body,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  Role.OWNER,
  Role.ADMIN,
  Role.MEMBER, // qualquer um pode alterar o status
)
@Patch(':taskId/status')
async updateStatus( // endpoint para alterar o status de uma task
  @Param('projectId')
  projectId: string,

  @Param('taskId')
  taskId: string,

  @Req() req: any,

  @Body()
  body: UpdateTaskStatusDto,
) {
  return this.tasksService.updateStatus(
    projectId,

    taskId,

    body.status,

    req.user.id,
  );
}
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  Role.OWNER,
  Role.ADMIN,
)
@Patch(':taskId/assign')
async assignTask(
  @Param('projectId')
  projectId: string,

  @Param('taskId')
  taskId: string,

  @Req() req: any,

  @Body()
  body: AssignTaskDto,
) {
  return this.tasksService.assignTask(
    projectId,

    taskId,

    body.assignedToId,

    req.user.id,
  );
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  Role.OWNER,
  Role.ADMIN,
  Role.MEMBER, // todos podem procurar 
)
@Get()
async findAll( // endpoint para procurar tasks de um projeto 
  @Param('projectId')
  projectId: string,

  @Query('page')
  page?: string,

  @Query('limit')
  limit?: string,

  @Query('status')
  status?: TaskStatus,

  @Query('priority')
  priority?: TaskPriority,

  @Query('assignedToId')
  assignedToId?: string,
) {
  return this.tasksService.findAllByProject( 
    projectId,

    Number(page) || 1,

    Number(limit) || 10,

    status,

    priority,

    assignedToId,
  );
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  Role.OWNER,
  Role.ADMIN, // apenas admins e owners podem mudar as datas de uma task
)
@Patch(':taskId/due-date')
async updateDueDate( // endpoint para atualizar a data de uma task 
  @Param('projectId')
  projectId: string,

  @Param('taskId')
  taskId: string,

  @Req() req: any,

  @Body()
  body: UpdateTaskDueDateDto,
) {
  return this.tasksService.updateDueDate(
    projectId,

    taskId,

    body.dueDate,

    req.user.id,
  );
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  Role.OWNER,
  Role.ADMIN,
  Role.MEMBER,
)
@Get('overdue/list')
async findOverdue( // endpoint para listar as tasks atrasadas 
  @Param('projectId')
  projectId: string,
) {
  return this.tasksService.findOverdueTasks(
    projectId,
  );
}
  
}