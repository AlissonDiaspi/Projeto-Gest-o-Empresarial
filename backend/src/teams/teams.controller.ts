import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';

@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get('organization/:organizationId')
  findByOrganization(@Param('organizationId', ParseUUIDPipe) organizationId: string) {
    return this.teamsService.findByOrganization(organizationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.teamsService.remove(id);
  }

  @Post(':teamId/members')
  addMember(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Body() addTeamMemberDto: AddTeamMemberDto,
  ) {
    return this.teamsService.addMember(teamId, addTeamMemberDto.userId);
  }

  @Delete(':teamId/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    await this.teamsService.removeMember(teamId, userId);
  }

  @Get(':teamId/members')
  getMembers(@Param('teamId', ParseUUIDPipe) teamId: string) {
    return this.teamsService.getMembers(teamId);
  }
}