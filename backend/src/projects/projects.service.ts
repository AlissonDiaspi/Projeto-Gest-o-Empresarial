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

  async create( // função para criar um novo projeto 
    organizationId: string,

    createdById: string,

    name: string,

    description?: string,
  ) {
    const organization =
      await this.prisma.organization.findUnique({ // procura a organização pelo id
        where: {
          id: organizationId,
        },
      });

    if (!organization) { // se não encontrar, lança esse erro
      throw new NotFoundException(
        'Organization not found',
      );
    }

    const project =
      await this.prisma.project.create({ // cria o projeto com esses campos
        data: {
          name,

          description,

          organizationId,

          createdById,
        },
      });

    await this.auditService.log({ // avisa a classe de log sobre a criação do projeto 
      action: 'CREATE_PROJECT',

      description: `Projeto ${name} criado`,

      actorId: createdById,

      organizationId,
    });

    return project;
  }

  async findAllByOrganization(
    organizationId: string,

  ){
    return this.prisma.project.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async update( // método para atualizar um projeto 
  organizationId: string,

  projectId: string,

  actorId: string,

  data: { // são opcionais por que é um update 
    name?: string;

    description?: string;
  },
) {
  const project =
    await this.prisma.project.findFirst({ // procura o projeto 
      where: {
        id: projectId,

        organizationId,
      },
    });

  if (!project) { // se não achar, lança esse erro 
    throw new NotFoundException(
      'Project not found',
    );
  }

  const updatedProject =
    await this.prisma.project.update({ // caso ache, ele vai passar o data com os novos dados sobre a atualização
      where: {
        id: projectId,
      },

      data,
    });

  await this.auditService.log({ // alerta as classes de logs que um projeto sofreu update 
    action: 'UPDATE_PROJECT',

    description: `Projeto ${updatedProject.name} atualizado`,

    actorId,

    organizationId,
  });

  return updatedProject;
}
async remove( // método para deletar um projeto 
  organizationId: string,

  projectId: string,

  actorId: string,
) {
  const project =
    await this.prisma.project.findFirst({ // procura o projeto na organização 
      where: {
        id: projectId,

        organizationId,
      },
    });

  if (!project) { // se não encontrar lança esse erro 
    throw new NotFoundException(
      'Project not found',
    );
  }

  await this.prisma.project.delete({ // deleta o projeto
    where: {
      id: projectId,
    },
  });

  await this.auditService.log({ // avisa a classe de logs sobre o projeto deletado 
    action: 'DELETE_PROJECT',

    description: `Projeto ${project.name} deletado`,

    actorId,

    organizationId,
  });

  return {
    message: 'Project deleted successfully', 
  };
}
async findById( // procura projetos pelo id
  organizationId: string,

  projectId: string,
) {
  const project =
    await this.prisma.project.findFirst({ // procura o projeto dentro da organização
      where: {
        id: projectId,

        organizationId,
      },
    });

  if (!project) {
    throw new NotFoundException( // se não achar lança esse erro
      'Project not found',
    );
  }

  return project;
}



}