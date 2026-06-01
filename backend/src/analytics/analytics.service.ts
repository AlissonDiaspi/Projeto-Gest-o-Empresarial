
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskPriority, TaskStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getProjectAnalytics(projectId: string) { // método para pegar os dados de um projeto 
    const totalTasks = await this.prisma.task.count({
      where: { projectId }, // procura o projeto
    });

    const todoTasks = await this.prisma.task.count({
      where: { projectId, status: TaskStatus.TODO }, // procura as tasks do projeto com o status TODO
    });

    const inProgressTasks = await this.prisma.task.count({
      where: { projectId, status: TaskStatus.IN_PROGRESS }, // procura as tasks com o status in_progress
    });

    const doneTasks = await this.prisma.task.count({
      where: { projectId, status: TaskStatus.DONE }, // procura as tasks com o status done
    });

    const overdueTasks = await this.prisma.task.count({
      where: {
        projectId,
        dueDate: { lt: new Date() }, // procura as possíveis tasks atrasadas
        status: { not: TaskStatus.DONE },
      },
    });

    const lowPriority = await this.prisma.task.count({ // procura as tasks com prioridade low
      where: { projectId, priority: TaskPriority.LOW }, 
    });

    const mediumPriority = await this.prisma.task.count({ // procura as tasks com a prioridade média
      where: { projectId, priority: TaskPriority.MEDIUM },
    });

    const highPriority = await this.prisma.task.count({ // procura as tasks com a prioridade alta
      where: { projectId, priority: TaskPriority.HIGH },
    });

    return { // retorna tudo que achou
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