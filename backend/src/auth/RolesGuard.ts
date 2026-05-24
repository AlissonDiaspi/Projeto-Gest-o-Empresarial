import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { PrismaService } from '../prisma/prisma.service';

import { ROLES_KEYS } from './decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredRoles =
      this.reflector.getAllAndOverride(
        ROLES_KEYS,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!requiredRoles) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const user = request.user;

    const organizationId =
      request.params.organizationId;

    const membership =
      await this.prisma.membership.findFirst({ // procura o membro na organização
        where: {
          userId: user.id,
          organizationId,
        },
      });

    if (!membership) { // lança a exception caso o membro não pertença a aquela organização
      throw new ForbiddenException(
        'Not member of this organization',
      );
    }

    const hasRole = requiredRoles.includes(
      membership.role,
    );

    if (!hasRole) { // verifica se aquela role possui as permissões necessárias para tal ação
      throw new ForbiddenException(
        'Insufficient permissions',
      );
    }

    return true;
  }
}