import { Module } from '@nestjs/common';

import { TaskCommentsController } from './task-comments.controller';

import { TaskCommentsService } from './task-comments.service';

import { PrismaModule } from '../prisma/prisma.module';

import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
  ],

  controllers: [
    TaskCommentsController,
  ],

  providers: [
    TaskCommentsService,
  ],
})
export class TaskCommentsModule {}