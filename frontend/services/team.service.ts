import { api } from '@/lib/axios';

export interface Team {
  id: string;
  name: string;
  organizationId: string;
  createdAt: string;
}

export async function getTeams(): Promise<Team[]> {
  const response = await api.get('/teams');

  return response.data.data ?? response.data;
}

export async function getTeamById(
  id: string,
): Promise<Team> {
  const response = await api.get(
    `/teams/${id}`,
  );

  return response.data.data ?? response.data;
}

export async function createTeam(
  data: {
    name: string;
    organizationId: string;
  },
): Promise<Team> {
  const response = await api.post(
    '/teams',
    data,
  );

  return response.data.data ?? response.data;
}