// projects/projects.service.ts
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
    teamId?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const project = await this.prisma.project.create({
      data: {
        name,
        description,
        organizationId,
        createdById,
        teamId,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    await this.auditService.log({
      action: 'CREATE_PROJECT',
      description: `Projeto ${name} criado`,
      actorId: createdById,
      organizationId,
    });

    return project;
  }

  async findAllByOrganization(organizationId: string) {
    return this.prisma.project.findMany({
      where: { organizationId },
      include: {
        team: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    organizationId: string,
    projectId: string,
    actorId: string,
    data: {
      name?: string;
      description?: string;
      teamId?: string;
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

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description,
        teamId: data.teamId,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });

    await this.auditService.log({
      action: 'UPDATE_PROJECT',
      description: `Projeto ${updatedProject.name} atualizado`,
      actorId,
      organizationId,
    });

    return updatedProject;
  }

  async remove(organizationId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Usar transação para garantir consistência
    return this.prisma.$transaction(async (prisma) => {
      // 1. Deletar comentários das tasks
      await prisma.taskComment.deleteMany({
        where: { task: { projectId } }
      });

      // 2. Deletar tasks
      await prisma.task.deleteMany({
        where: { projectId },
      });

      // 3. Deletar mensagens do chat
      await prisma.chatMessage.deleteMany({
        where: { projectId },
      });

      // 4. Deletar arquivos
      await prisma.file.deleteMany({
        where: { projectId },
      });

      // 5. Deletar o projeto
      return prisma.project.delete({
        where: { id: projectId },
      });
    });
  }

  async findById(organizationId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId,
      },
      include: {
        team: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }
}