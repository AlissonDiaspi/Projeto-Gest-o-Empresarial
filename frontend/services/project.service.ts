// services/project.service.ts
import { api } from '@/lib/axios';

export interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  teamId?: string;
  startDate?: string;
  endDate?: string;
  team?: {
    id: string;
    name: string;
  };
  createdById: string;
  createdAt: string;
  updatedAt?: string;
}

export async function getProjects(organizationId: string): Promise<Project[]> {
  const response = await api.get(`/organizations/${organizationId}/projects`);
  return response.data.data;
}

export async function getProjectById(organizationId: string, projectId: string): Promise<Project> {
  const response = await api.get(`/organizations/${organizationId}/projects/${projectId}`);
  return response.data.data;
}

export async function createProject(
  organizationId: string,
  data: {
    name: string;
    description?: string;
    teamId?: string;
    startDate?: string;
    endDate?: string;
  },
): Promise<Project> {
  const response = await api.post(`/organizations/${organizationId}/projects`, data);
  return response.data.data;
}

export async function updateProject(
  organizationId: string,
  projectId: string,
  data: {
    name?: string;
    description?: string;
    teamId?: string;
    startDate?: string;
    endDate?: string;
  },
): Promise<Project> {
  const response = await api.patch(`/organizations/${organizationId}/projects/${projectId}`, data);
  return response.data.data;
}

export async function deleteProject(organizationId: string, projectId: string): Promise<void> {
  await api.delete(`/organizations/${organizationId}/projects/${projectId}`);
}