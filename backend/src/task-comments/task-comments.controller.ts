import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { TaskCommentsService } from './task-comments.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/RolesGuard';

import { Roles } from '../auth/decorators/roles.decorator';

import { Role } from '@prisma/client';

import { CreateTaskCommentDto } from './dto/create-task-comment.dto';

@Controller('tasks/:taskId/comments')
export class TaskCommentsController {
  constructor(
    private taskCommentsService: TaskCommentsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.OWNER,
    Role.ADMIN,
    Role.MEMBER,
  )
  @Post()
  async create( // endpoint para criar comentários em uma task 
    @Param('taskId')
    taskId: string,

    @Body()
    body: CreateTaskCommentDto,

    @Req() req: any,
  ) {
    return this.taskCommentsService.create(
      taskId,

      body.content,

      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.OWNER,
    Role.ADMIN,
    Role.MEMBER,
  )
  @Get()
  async findByTask( // endpoint para listar comentários de uma task 
    @Param('taskId')
    taskId: string,
  ) {
    return this.taskCommentsService.findByTask(
      taskId,
    );
  }
}