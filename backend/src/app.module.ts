import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { AuditModule } from './audit/audit.module';
 
import { PrismaService } from './prisma/prisma.service';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskCommentsModule } from './task-comments/task-comments.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';
import { FilesModule } from './files/files.module';
import { TeamsModule } from './teams/teams.module';



@Module({
  imports: [AuthModule, UsersModule, PrismaModule, OrganizationsModule, OrganizationsModule, AuditModule, ProjectsModule, TasksModule, TaskCommentsModule, AnalyticsModule, NotificationsModule, ChatModule,FilesModule,TeamsModule],
  controllers: [AppController],
  providers: [AppService,
    PrismaService,
    ],
})
export class AppModule {}
