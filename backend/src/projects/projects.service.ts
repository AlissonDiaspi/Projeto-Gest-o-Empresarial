
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async create(
    organizationId: string,
    createdById: string,
    name: string,
    description?: string,
    teamIds?: string[],
    startDate?: string,
    endDate?: string,
  ) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

   
    const project = await this.prisma.project.create({ // método para criar um projeto
      data: {
        name,
        description,
        organizationId,
        createdById,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    
    if (teamIds && teamIds.length > 0) { // adicionar times a um projeto 
      await this.prisma.projectTeam.createMany({
        data: teamIds.map(teamId => ({
          projectId: project.id,
          teamId,
        })),
      });
    }

    await this.auditService.log({ // retorna o log de que um projeto foi criado 
      action: 'CREATE_PROJECT',
      description: `Projeto ${name} criado`,
      actorId: createdById,
      organizationId,
    });

    // Retornar o projeto com os times
    return this.findById(organizationId, project.id);
  }

  async findAllByOrganization(organizationId: string) { // método para achar os projetos de uma empresa
    const projects = await this.prisma.project.findMany({
      where: { organizationId },
      include: {
        projectTeams: {
          include: {
            team: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map(project => ({
      ...project,
      teams: project.projectTeams.map(pt => pt.team),
    }));
  }

  async update( // método para atualizar um projeto de uma empresa
    organizationId: string,
    projectId: string,
    actorId: string,
    data: {
      name?: string;
      description?: string;
      teamIds?: string[];
      startDate?: string;
      endDate?: string;
    },
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId,
      },
    });

    if (!project) { // se não achar o projeto, lança esse erro
      throw new NotFoundException('Project not found');
    }

    // atualizar dados básicos
    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });

    // atualizar times(é opcional)
    if (data.teamIds !== undefined) {
      // Remover times existentes
      await this.prisma.projectTeam.deleteMany({
        where: { projectId },
      });
      
      // adicionar novos times
      if (data.teamIds.length > 0) {
        await this.prisma.projectTeam.createMany({
          data: data.teamIds.map(teamId => ({
            projectId,
            teamId,
          })),
        });
      }
    }

    await this.auditService.log({ // retorna para os logs as atualizações 
      action: 'UPDATE_PROJECT',
      description: `Projeto ${updatedProject.name} atualizado`,
      actorId,
      organizationId,
    });

    return this.findById(organizationId, projectId);
  }

  async remove(organizationId: string, projectId: string) { // método para remover um projeto
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId,
      },
    });

    if (!project) { // se não encontrar, lança esse erro
      throw new NotFoundException('Project not found');
    }

    // usar transação para garantir consistência
    return this.prisma.$transaction(async (prisma) => {
      // 1. deletar relações project_teams
      await prisma.projectTeam.deleteMany({
        where: { projectId },
      });

      // 2. deletar comentários das tasks
      await prisma.taskComment.deleteMany({
        where: { task: { projectId } }
      });

      // 3. deletar tasks
      await prisma.task.deleteMany({
        where: { projectId },
      });

      // 4. deletar mensagens do chat
      await prisma.chatMessage.deleteMany({
        where: { projectId },
      });

      // 5. deletar arquivos
      await prisma.file.deleteMany({
        where: { projectId },
      });

      // 6. deletar o projeto
      return prisma.project.delete({
        where: { id: projectId },
      });
    });
  }

  async findById(organizationId: string, projectId: string) { // método para procurar um projeto pelo ID
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId,
      },
      include: {
        projectTeams: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!project) { // se não achar, lança o erro 
      throw new NotFoundException('Project not found');
    }

    return {
      ...project,
      teams: project.projectTeams.map(pt => pt.team),
    };
  }
}