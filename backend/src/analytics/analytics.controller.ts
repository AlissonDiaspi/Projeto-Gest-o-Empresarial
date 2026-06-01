
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/RolesGuard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('projects/:projectId/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController { 
  constructor(private analyticsService: AnalyticsService) {}

  @Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @Get()
  async getProjectAnalytics(@Param('projectId') projectId: string) { // endpoint para extrair os dados de um projeto
    return this.analyticsService.getProjectAnalytics(projectId);
  }
}