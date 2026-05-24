import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: { // método para o log do sistema
    action: string;
    description: string;
    actorId: string;
    organizationId: string;
  }) {
    return this.prisma.auditLog.create({
      data,
    });
  }

  async findByOrganization( // método para buscar os logs de uma organização, com paginação e filtros, é bom quando a empresa tem muitos logs
  organizationId: string,

  page = 1,
  limit = 10,

  action?: string,
  actorId?: string,
) {
  const skip = (page - 1) * limit; // paginação

  return this.prisma.auditLog.findMany({ // procura os logs
    where: {
      organizationId,

      ...(action && { action }), // filtro

      ...(actorId && { actorId }), // filtro
    },

    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },

    skip,
    take: limit,
  });
}
}