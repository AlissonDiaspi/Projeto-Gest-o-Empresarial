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
 // classe responsável por pegar todos os endpoints do backend relacionados aos times 
export async function createTeam(data: CreateTeamData): Promise<Team> {
  const response = await api.post('/teams', data);
  return response.data?.data || response.data;
}

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

export async function getTeamById(teamId: string): Promise<Team> {
  const response = await api.get(`/teams/${teamId}`);
  return response.data?.data || response.data;
}

export async function updateTeam(teamId: string, data: UpdateTeamData): Promise<Team> {
  const response = await api.patch(`/teams/${teamId}`, data);
  return response.data?.data || response.data;
}

export async function deleteTeam(teamId: string): Promise<void> {
  await api.delete(`/teams/${teamId}`);
}

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

export async function addTeamMember(teamId: string, data: AddMemberData): Promise<TeamMember> {
  const response = await api.post(`/teams/${teamId}/members`, {
    userId: data.userId,
  });
  
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

export async function removeTeamMember(teamId: string, userId: string): Promise<void> {
  await api.delete(`/teams/${teamId}/members/${userId}`);
}