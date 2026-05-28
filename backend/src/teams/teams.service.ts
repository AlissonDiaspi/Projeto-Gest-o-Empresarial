import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(
    dto: CreateTeamDto,
  ) {
    return this.prisma.team.create({
      data: dto,
    });
  }

  async findByOrganization(
    organizationId: string,
  ) {
    return this.prisma.team.findMany({
      where: {
        organizationId,
      },

      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async addMember(
    teamId: string,

    userId: string,
  ) {
    const team =
      await this.prisma.team.findUnique({
        where: {
          id: teamId,
        },
      });

    if (!team) {
      throw new NotFoundException(
        'Team not found',
      );
    }

    const alreadyMember =
      await this.prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
      });

    if (alreadyMember) {
      throw new ConflictException(
        'User already in team',
      );
    }

    return this.prisma.teamMember.create({
      data: {
        teamId,
        userId,
      },

      include: {
        user: true,
      },
    });
  }

  async removeMember(
    teamId: string,

    userId: string,
  ) {
    return this.prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });
  }

  async getMembers(
    teamId: string,
  ) {
    return this.prisma.teamMember.findMany({
      where: {
        teamId,
      },

      include: {
        user: true,
      },
    });
  }
}