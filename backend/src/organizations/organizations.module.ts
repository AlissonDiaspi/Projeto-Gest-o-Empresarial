import { Module } from '@nestjs/common';

import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

import { PrismaService } from '../prisma/prisma.service';
import { RolesGuard } from 'src/auth/RolesGuard';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    PrismaService,
    RolesGuard,
  ],
})
export class OrganizationsModule {}