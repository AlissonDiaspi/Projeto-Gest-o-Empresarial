import { api } from '@/lib/axios';

export interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdAt: string;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
  organizationId?: string;
}

export async function getProjects(): Promise<Project[]> {
  const response = await api.get('/projects');

  return response.data.data ?? [];
}

export async function getProjectById(
  id: string,
): Promise<Project> {
  const response = await api.get(
    `/projects/${id}`,
  );

  return response.data.data;
}

export async function createProject(
  data: CreateProjectDTO,
): Promise<Project> {
  const organizationId =
    localStorage.getItem(
      'active_organization_id',
    );

  const payload = {
    ...data,
    organizationId,
  };

  const response = await api.post(
    '/projects',
    payload,
  );

  return response.data.data;
}

export async function updateProject(
  id: string,
  data: Partial<CreateProjectDTO>,
): Promise<Project> {
  const response = await api.patch(
    `/projects/${id}`,
    data,
  );

  return response.data.data;
}

export async function deleteProject(
  id: string,
): Promise<void> {
  await api.delete(
    `/projects/${id}`,
  );
}