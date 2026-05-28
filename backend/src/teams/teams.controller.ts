import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { TeamsService } from './teams.service';

import { CreateTeamDto } from './dto/create-team.dto';

import { AddTeamMemberDto } from './dto/add-team-member.dto';

@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(
    private teamsService: TeamsService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateTeamDto,
  ) {
    return this.teamsService.create(dto);
  }

  @Get(
    'organization/:organizationId',
  )
  findByOrganization(
    @Param('organizationId')
    organizationId: string,
  ) {
    return this.teamsService.findByOrganization(
      organizationId,
    );
  }

  @Post(':teamId/members')
  addMember(
    @Param('teamId')
    teamId: string,

    @Body()
    dto: AddTeamMemberDto,
  ) {
    return this.teamsService.addMember(
      teamId,

      dto.userId,
    );
  }

  @Delete(
    ':teamId/members/:userId',
  )
  removeMember(
    @Param('teamId')
    teamId: string,

    @Param('userId')
    userId: string,
  ) {
    return this.teamsService.removeMember(
      teamId,

      userId,
    );
  }

  @Get(':teamId/members')
  getMembers(
    @Param('teamId')
    teamId: string,
  ) {
    return this.teamsService.getMembers(
      teamId,
    );
  }
}