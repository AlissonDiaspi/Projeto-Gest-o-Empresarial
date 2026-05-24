import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { AuditModule } from './audit/audit.module';



@Module({
  imports: [AuthModule, UsersModule, PrismaModule, OrganizationsModule, OrganizationsModule, AuditModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
