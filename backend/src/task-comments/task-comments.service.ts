import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { AuditService } from '../audit/audit.service';

@Injectable()
export class TaskCommentsService {
  constructor(
    private prisma: PrismaService,

    private auditService: AuditService,
  ) {}

  async create( // criar um comentário em uma task
    taskId: string,

    content: string,

    authorId: string,
  ) {
    const task =
      await this.prisma.task.findUnique({ // procura se a task existe 
        where: {
          id: taskId,
        },

        include: {
          project: true,
        },
      });

    if (!task) {
      throw new NotFoundException( // se não existir, lança esse erro 
        'Task not found',
      );
    }

    const comment =
      await this.prisma.taskComment.create({ // cria o comentário passando esse conteudo
        data: {
          content,

          taskId,

          authorId,
        },

        include: {
          author: {
            select: {
              id: true,

              name: true,

              email: true,
            },
          },
        },
      });

    await this.auditService.log({ // coloca nos logs que um comentário em uma task foi criado 
      action: 'CREATE_TASK_COMMENT',

      description:
        `Comentário criado na task ${task.title}`,

      actorId: authorId,

      organizationId:
        task.project.organizationId,
    });

    return comment;
  }

  async findByTask(taskId: string) {
    return this.prisma.taskComment.findMany({ // método para listar comentários de uma task 
      where: {
        taskId,
      },

      orderBy: {
        createdAt: 'asc',
      },

      include: {
        author: {
          select: {
            id: true,

            name: true,

            email: true,
          },
        },
      },
    });
  }
}