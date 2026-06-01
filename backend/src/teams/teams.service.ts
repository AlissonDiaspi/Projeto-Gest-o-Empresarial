
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto) { // função para criar um time 
    return this.prisma.team.create({
      data: createTeamDto,
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll(organizationId: string) { // método para mostrar todos os times de uma organização
    return this.prisma.team.findMany({
      where: { organizationId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        projectTeams: {
          include: {
            project: true,
          },
        },
      },
    });
  }

  async findOne(teamId: string) { // método para achar apenas um time 
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        projectTeams: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    return {
      ...team,
      projects: team.projectTeams.map(pt => pt.project),
    };
  }

  async update(teamId: string, updateTeamDto: UpdateTeamDto) { // método para atualizar um time 
    await this.findOne(teamId);

    return this.prisma.team.update({
      where: { id: teamId },
      data: updateTeamDto,
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async remove(teamId: string) { // método para remover um time 
    
    const projectTeams = await this.prisma.projectTeam.findMany({
      where: { teamId },
      select: { projectId: true },
    });

    if (projectTeams.length > 0) {
      throw new BadRequestException(
        `Cannot delete team with ${projectTeams.length} project(s). Remove or reassign projects first.`,
      );
    }

    const memberCount = await this.prisma.teamMember.count({
      where: { teamId },
    });

    if (memberCount > 0) {
      await this.prisma.teamMember.deleteMany({
        where: { teamId },
      });
    }

    return this.prisma.team.delete({
      where: { id: teamId },
    });
  }

  async findByOrganization(organizationId: string) {
    return this.findAll(organizationId);
  }

  async addMember(teamId: string, userId: string) { // método para adicionar um membro da organização ao time
    try {
      console.log(`[TeamsService] addMember chamado: teamId=${teamId}, userId=${userId}`);
      
      const team = await this.prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team) { // procura se o time existe 
        console.log(`[TeamsService] Time não encontrado: ${teamId}`);
        throw new NotFoundException(`Team with ID ${teamId} not found`);
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) { // procura o usuário 
        console.log(`[TeamsService] Usuário não encontrado: ${userId}`);
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const alreadyMember = await this.prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
      });

      if (alreadyMember) { // procura se ele ja pertence ao time 
        console.log(`[TeamsService] Usuário já é membro do time: ${userId}`);
        throw new ConflictException('User already in team');
      }

      const teamMember = await this.prisma.teamMember.create({
        data: {
          teamId,
          userId,
        },
        include: {
          user: true,
        },
      });

      console.log(`[TeamsService] Membro adicionado com sucesso: ${teamMember.id}`);
      
      return {
        teamId: teamMember.teamId,
        userId: teamMember.userId,
        user: {
          id: teamMember.user.id,
          name: teamMember.user.name,
          email: teamMember.user.email,
        },
      };
    } catch (error) {
      console.error('[TeamsService] Erro em addMember:', error);
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao adicionar membro ao time');
    }
  }

  async removeMember(teamId: string, userId: string) { // método para remover um usuário de um time 
    try {
      console.log(`[TeamsService] removeMember chamado: teamId=${teamId}, userId=${userId}`);
      
      await this.findOne(teamId);

      const member = await this.prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
      });

      if (!member) { // procura se o usuário pertence ao time 
        throw new NotFoundException('Member not found in this team');
      }

      const result = await this.prisma.teamMember.delete({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
      });

      console.log(`[TeamsService] Membro removido com sucesso`);
      return result;
    } catch (error) {
      console.error('[TeamsService] Erro em removeMember:', error);
      throw error;
    }
  }

  async getMembers(teamId: string) { // método para encontrar os membros de um time 
    await this.findOne(teamId);

    const members = await this.prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: true,
      },
    });

    return members.map(member => ({
      teamId: member.teamId,
      userId: member.userId,
      user: {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
      },
    }));
  }
}