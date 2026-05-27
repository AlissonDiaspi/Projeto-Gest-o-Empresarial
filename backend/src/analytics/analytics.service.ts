import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import {
  TaskPriority,
  TaskStatus,
} from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getProjectAnalytics( // pegar os dados de um projeto 
    projectId: string,
  ) {
    const totalTasks =
      await this.prisma.task.count({ // conta a quantidade de projetos presentes na organização 
        where: {
          projectId,
        },
      });

    const todoTasks =
      await this.prisma.task.count({ // conta os projetos com status todo 
        where: {
          projectId,

          status: TaskStatus.TODO,
        },
      });

    const inProgressTasks =
      await this.prisma.task.count({ // conta os projetos em progresso
        where: {
          projectId,

          status:
            TaskStatus.IN_PROGRESS,
        },
      });

    const doneTasks =
      await this.prisma.task.count({ // conta os projetos finalizados 
        where: {
          projectId,

          status: TaskStatus.DONE,
        },
      });

    const overdueTasks =
      await this.prisma.task.count({ // conta os projetos atrasados 
        where: {
          projectId,

          dueDate: {
            lt: new Date(),
          },

          status: {
            not: TaskStatus.DONE,
          },
        },
      });

    const lowPriority =
      await this.prisma.task.count({ // conta os projetos com prioridade baixa
        where: {
          projectId,

          priority:
            TaskPriority.LOW,
        },
      });

    const mediumPriority =
      await this.prisma.task.count({ // conta os projetos com prioridade média 
        where: {
          projectId,

          priority:
            TaskPriority.MEDIUM,
        },
      });

    const highPriority =
      await this.prisma.task.count({ // conta os projetos com prioridade alta 
        where: {
          projectId,

          priority:
            TaskPriority.HIGH,
        },
      });

    return { // retorna todas as contagens 
      totalTasks,

      todoTasks,

      inProgressTasks,

      doneTasks,

      overdueTasks,

      priorityStats: {
        LOW: lowPriority,

        MEDIUM: mediumPriority,

        HIGH: highPriority,
      },
    };
  }
}