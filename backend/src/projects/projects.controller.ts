
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
  async create( // endpoint para criar um projeto dentro de uma organização 
    @Param('organizationId') organizationId: string,
    @Req() req: any,
    @Body() body: CreateProjectDto,
  ) {
    return this.projectsService.create(
      organizationId,
      req.user.id,
      body.name,
      body.description,
      body.teamIds,
      body.startDate,
      body.endDate,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Param('organizationId') organizationId: string) { // endpoint para mostrar os projetos de uma organização
    return this.projectsService.findAllByOrganization(organizationId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Patch(':projectId')
  async update( // endpoint para atualizar um projeto 
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Req() req: any,
    @Body() body: UpdateProjectDto,
  ) {
    return this.projectsService.update(
      organizationId,
      projectId,
      req.user.id,
      {
        name: body.name,
        description: body.description,
        teamIds: body.teamIds,
        startDate: body.startDate,
        endDate: body.endDate,
      },
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Delete(':projectId')
  async remove( // endpoint para deletar um projeto 
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.remove(organizationId, projectId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @Get(':projectId')
  async findById( // endpoint para procurar um projeto pelo id
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.findById(organizationId, projectId);
  }
}