// services/team.service.ts - Corrigido
import { api } from '@/lib/axios';

export interface Team {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  members?: TeamMember[];
  memberCount?: number;
  projectCount?: number;
}

export interface TeamMember {
  teamId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateTeamData {
  name: string;
  description?: string;
  organizationId: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
}

export interface AddMemberData {
  userId: string;
}

// Criar um novo time
export async function createTeam(data: CreateTeamData): Promise<Team> {
  const response = await api.post('/teams', data);
  return response.data?.data || response.data;
}

// Listar todos os times da organização
export async function getTeams(organizationId: string): Promise<Team[]> {
  const response = await api.get(`/teams/organization/${organizationId}`);
  let teamsData = response.data?.data || response.data;
  
  if (!Array.isArray(teamsData)) {
    return [];
  }
  
  return teamsData.map((team: any) => ({
    ...team,
    memberCount: team.members?.length || 0,
    projectCount: 0,
  }));
}

// Buscar um time específico
export async function getTeamById(teamId: string): Promise<Team> {
  const response = await api.get(`/teams/${teamId}`);
  return response.data?.data || response.data;
}

// Atualizar time
export async function updateTeam(teamId: string, data: UpdateTeamData): Promise<Team> {
  const response = await api.patch(`/teams/${teamId}`, data);
  return response.data?.data || response.data;
}

// Deletar time
export async function deleteTeam(teamId: string): Promise<void> {
  await api.delete(`/teams/${teamId}`);
}

// Listar membros do time
export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  const response = await api.get(`/teams/${teamId}/members`);
  let membersData = response.data?.data || response.data;
  
  if (!Array.isArray(membersData)) {
    return [];
  }
  
  return membersData.map((member: any) => ({
    teamId: member.teamId,
    userId: member.userId,
    user: {
      id: member.user?.id || member.userId,
      name: member.user?.name || 'Usuário',
      email: member.user?.email || '',
    },
  }));
}

// Adicionar membro ao time - CORRIGIDO
export async function addTeamMember(teamId: string, data: AddMemberData): Promise<TeamMember> {
  console.log('📤 Adicionando membro ao time:', { teamId, userId: data.userId });
  
  try {
    const response = await api.post(`/teams/${teamId}/members`, {
      userId: data.userId,
    });
    
    console.log('📥 Resposta do servidor:', response.status, response.data);
    
    // Verificar se a resposta foi bem sucedida
    if (response.status === 200 || response.status === 201) {
      const member = response.data?.data || response.data;
      
      return {
        teamId: member.teamId || teamId,
        userId: member.userId || data.userId,
        user: {
          id: member.user?.id || member.userId || data.userId,
          name: member.user?.name || 'Membro adicionado',
          email: member.user?.email || '',
        },
      };
    }
    
    throw new Error(`Erro na requisição: ${response.status}`);
  } catch (error: any) {
    console.error('❌ Erro ao adicionar membro:', error.response?.status, error.response?.data);
    throw error;
  }
}

// Remover membro do time
export async function removeTeamMember(teamId: string, userId: string): Promise<void> {
  await api.delete(`/teams/${teamId}/members/${userId}`);
}