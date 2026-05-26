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
  constructor(
    private projectsService: ProjectsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN) // apenas owner e admins podem criar projetos 
  @Post()
  async create( // endpoint responsável pela criação de um novo projeto
    @Param('organizationId')
    organizationId: string,

    @Req() req: any,

    @Body() body: CreateProjectDto,
  ) {
    return this.projectsService.create( 
      organizationId,

      req.user.id,

      body.name,

      body.description,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll( // endpoint responsável por listar os projetos de uma organização
    @Param('organizationId')
    organizationId: string,
) {
    return this.projectsService.findAllByOrganization(
    organizationId,
  );
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.ADMIN) // apenas owner e admins podem atualizar projetos 
@Patch(':projectId')
async update( // endpoint para atualização do projeto
  @Param('organizationId')
  organizationId: string,

  @Param('projectId')
  projectId: string,

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
@Roles(Role.OWNER, Role.ADMIN) // apenas admins e owners podem deletar um projeto 
@Delete(':projectId')
async remove( // endpoint responsável por deletar um projeto
  @Param('organizationId')
  organizationId: string,

  @Param('projectId')
  projectId: string,

  @Req() req: any,
) {
  return this.projectsService.remove(
    organizationId,

    projectId,

    req.user.id,
  );
}

}