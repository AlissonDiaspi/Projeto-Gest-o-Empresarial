import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { AnalyticsService } from './analytics.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/RolesGuard';

import { Roles } from '../auth/decorators/roles.decorator';

import { Role } from '@prisma/client';

@Controller('projects/:projectId/analytics')
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.OWNER,
    Role.ADMIN,
    Role.MEMBER,
  )
  @Get()
  async getProjectAnalytics( // endpoint para pegar dados de um projeto 
    @Param('projectId')
    projectId: string,
  ) {
    return this.analyticsService.getProjectAnalytics(
      projectId,
    );
  }
}