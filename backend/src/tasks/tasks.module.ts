import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuditService } from 'src/audit/audit.service';

@Module({
  providers: [TasksService,PrismaService,AuditService],
  controllers: [TasksController]
})
export class TasksModule {}
