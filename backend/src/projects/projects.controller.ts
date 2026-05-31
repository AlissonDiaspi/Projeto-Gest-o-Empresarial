// projects/projects.controller.ts
import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/RolesGuard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('organizations/:organizationId/projects')
export class ProjectsController { 
  constructor(private projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Post()
  async create(
    @Param('organizationId') organizationId: string,
    @Req() req: any,
    @Body() body: CreateProjectDto,
  ) {
    return this.projectsService.create(
      organizationId,
      req.user.id,
      body.name,
      body.description,
      body.teamId,
      body.startDate,
      body.endDate,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Param('organizationId') organizationId: string) {
    return this.projectsService.findAllByOrganization(organizationId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Patch(':projectId')
  async update(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Req() req: any,
    @Body() body: UpdateProjectDto,
  ) {
    return this.projectsService.update(
      organizationId,
      projectId,
      req.user.id,
      body,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Delete(':projectId')
  async remove(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.remove(organizationId, projectId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @Get(':projectId')
  async findById(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.findById(organizationId, projectId);
  }
}