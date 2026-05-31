// backend/src/analytics/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskPriority, TaskStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getProjectAnalytics(projectId: string) {
    const totalTasks = await this.prisma.task.count({
      where: { projectId },
    });

    const todoTasks = await this.prisma.task.count({
      where: { projectId, status: TaskStatus.TODO },
    });

    const inProgressTasks = await this.prisma.task.count({
      where: { projectId, status: TaskStatus.IN_PROGRESS },
    });

    const doneTasks = await this.prisma.task.count({
      where: { projectId, status: TaskStatus.DONE },
    });

    const overdueTasks = await this.prisma.task.count({
      where: {
        projectId,
        dueDate: { lt: new Date() },
        status: { not: TaskStatus.DONE },
      },
    });

    const lowPriority = await this.prisma.task.count({
      where: { projectId, priority: TaskPriority.LOW },
    });

    const mediumPriority = await this.prisma.task.count({
      where: { projectId, priority: TaskPriority.MEDIUM },
    });

    const highPriority = await this.prisma.task.count({
      where: { projectId, priority: TaskPriority.HIGH },
    });

    return {
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