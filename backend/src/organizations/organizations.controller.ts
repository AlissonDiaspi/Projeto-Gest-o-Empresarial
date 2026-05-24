import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Patch,
  UseGuards,
  Delete,
  Query,
  Param
} from '@nestjs/common';

import { OrganizationsService } from './organizations.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { RolesGuard } from 'src/auth/RolesGuard';

import { Roles } from '../auth/decorators/roles.decorator';

import { Role } from '@prisma/client';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

import { AuditService } from 'src/audit/audit.service';

@Controller('organizations')
export class OrganizationsController { 
  constructor(
    private organizationsService: OrganizationsService,
     private auditService: AuditService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create( // endpoint para criação de uma empresa por um usuário 
    @Body() body: CreateOrganizationDto,
    @Req() req: any,
  ) {
    return this.organizationsService.create(
      body.name,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req:any){ // endpoint para listar as empresas do usuário
    return this.organizationsService.findAllByUser(req.user.id,);

  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Get(':organizationId/admin')
  adminRoute(@Param('organizationId')
    organizationId: string,
) {
      return {
               message:
              'Você é OWNER dessa organização',
        };  
    }

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.ADMIN)
@Post(':organizationId/members')
async addMember( // endpoint para adicionar membros
  @Param('organizationId')
  organizationId: string,

  @Body() body: AddMemberDto,
) {
  return this.organizationsService.addMember(
    organizationId,
    body.email,
  );
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.ADMIN, Role.MEMBER)
@Get(':organizationId/members')
async getMembers( // endpoint para listar membros de uma organização 
  @Param('organizationId')
  organizationId: string,
) {
  return this.organizationsService.getMembers(
    organizationId,
  );
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER) // apenas owner pode mudar a role de um usuário 
@Patch(
  ':organizationId/members/:memberId',
)
async updateMemberRole( // endpoint para mudar a role de um usuário 
  @Param('organizationId')
  organizationId: string,

  @Param('memberId')
  memberId: string,

  @Body() body: UpdateMemberRoleDto,
) {
  return this.organizationsService.updateMemberRole( // atualiza com a nova role
    organizationId,
    memberId,
    body.role,
  );
}
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER) // apenas donos podem remover
@Delete(
  ':organizationId/members/:memberId',
)
async removeMember( // endpoint utilizado para remover membros 
  @Param('organizationId')
  organizationId: string,

  @Param('memberId')
  memberId: string,
) {
  return this.organizationsService.removeMember(
    organizationId,
    memberId,
  );
}
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.ADMIN) // apenas admins e donos podem ver os logs da empresa
@Get(':organizationId/audit-logs')
async getAuditLogs( // endpoint para ver os logs da organização, com paginação e filtros
  @Param('organizationId') 
  organizationId: string,

  @Query('page')
  page?: string,

  @Query('limit')
  limit?: string,

  @Query('action')
  action?: string,

  @Query('actorId')
  actorId?: string,
) {
  return this.auditService.findByOrganization(
    organizationId,

    Number(page) || 1,

    Number(limit) || 10,

    action,

    actorId,
  );
}

}

