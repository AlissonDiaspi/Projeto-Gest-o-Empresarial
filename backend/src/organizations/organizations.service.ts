import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { Role } from '@prisma/client';

import { AuditService } from '../audit/audit.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async create(name: string, userId: string) {
    return this.prisma.organization.create({ // cria uma nova organização passando nome, o membro que criar a organização é tido como owner automaticamente
      data: {
        name,

        memberships: {
          create: {
            userId,
            role: Role.OWNER,
          },
        },
      },

      include: {
        memberships: true,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.organization.findMany({ // busca varias organizações
      where: {
        memberships: {
          some: { // retorna apenas organizações onde existe uma membership com esse UserId
            userId,
          },
        },
      },

      include: {
        memberships: true, // retorna os memberships juntos
      },
    });
  }

  async addMember( // função para adicionar membros a organização
    organizationId: string,
    email: string,
  ) {
    const user =
      await this.prisma.user.findUnique({ // procura o email do usuário
        where: {
          email,
        },
      });

    if (!user) { // se não encontrar, lança exceção 404
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }

    const membershipExists =
      await this.prisma.membership.findFirst({ // procura se o usuário pertence a organização
        where: {
          organizationId,
          userId: user.id,
        },
      });

    if (membershipExists) { // se o usuário já estiver na organização, lança exceção 400
      throw new BadRequestException(
        'Usuário já pertence à organização',
      );
    }

    const membership =
      await this.prisma.membership.create({ // se encontrar e o usuário não pertencer, adiciona ele
        data: {
          organizationId,
          userId: user.id,
        },
      });

    await this.auditService.log({ // cria um log de auditoria registrando a ação
      action: 'ADD_MEMBER',

      description: `Usuário ${user.email} adicionado na organização`,

      actorId: user.id,

      organizationId,
    });

    return membership;
  }

  async getMembers(organizationId: string) { // método para listar os membros de uma organização
    return this.prisma.membership.findMany({
      where: {
        organizationId,
      },

      include: {
        user: {
          select: { // procura os ids, nomes e emails do usuários para listar
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateMemberRole( // método para atualizar role de usuário
    organizationId: string,
    memberId: string,
    role: Role,
  ) {
    const membership =
      await this.prisma.membership.findFirst({ // procura o usuário
        where: {
          id: memberId,
          organizationId,
        },
      });

    if (!membership) { // se não achar, lança exceção 404
      throw new NotFoundException(
        'Membro não encontrado',
      );
    }

    return this.prisma.membership.update({ // atualiza o usuário com a role
      where: {
        id: memberId,
      },

      data: {
        role,
      },
    });
  }

  async removeMember( // método para remover membro
    organizationId: string,
    memberId: string,
  ) {
    const membership =
      await this.prisma.membership.findFirst({ // procura o membro
        where: {
          id: memberId,
          organizationId,
        },
      });

    if (!membership) { // se o membro não for encontrado, lança exceção 404
      throw new NotFoundException(
        'Membro não encontrado',
      );
    }

    return this.prisma.membership.delete({ // deleta o membro
      where: {
        id: memberId,
      },
    });
  }

  async update(id: string, name: string, actorId: string) { // método para mudar o nome de uma organização 
  const organization = await this.prisma.organization.findUnique({
    where: { id },
  });

  if (!organization) {
    throw new NotFoundException('Organization not found');
  }

  const updated = await this.prisma.organization.update({
    where: { id },
    data: { name },
  });

  await this.auditService.log({
    action: 'UPDATE_ORGANIZATION',
    description: `Organização ${name} atualizada`,
    actorId,
    organizationId: id,
  });

  return updated;
}

async remove(id: string, actorId: string) { // método para deletar uma organização 
  const organization = await this.prisma.organization.findUnique({ 
    where: { id },
  });

  if (!organization) {
    throw new NotFoundException('Organization not found');
  }

  // Verificar se o usuário é o owner
  const membership = await this.prisma.membership.findFirst({
    where: {
      userId: actorId,
      organizationId: id,
      role: 'OWNER',
    },
  });

  if (!membership) {
    throw new ForbiddenException('Only owner can delete organization');
  }

  // Deletar todos os dados relacionados
  await this.prisma.$transaction(async (prisma) => {
    // Deletar membros
    await prisma.membership.deleteMany({ where: { organizationId: id } });
    // Deletar audit logs
    await prisma.auditLog.deleteMany({ where: { organizationId: id } });
    // Deletar projetos (e suas dependências)
    const projects = await prisma.project.findMany({ where: { organizationId: id } });
    for (const project of projects) {
      await prisma.taskComment.deleteMany({ where: { task: { projectId: project.id } } });
      await prisma.task.deleteMany({ where: { projectId: project.id } });
      await prisma.chatMessage.deleteMany({ where: { projectId: project.id } });
      await prisma.file.deleteMany({ where: { projectId: project.id } });
      await prisma.project.delete({ where: { id: project.id } });
    }
    // Deletar times
    await prisma.team.deleteMany({ where: { organizationId: id } });
    // Deletar organização
    await prisma.organization.delete({ where: { id } });
  });

  return { message: 'Organization deleted successfully' };
}
}