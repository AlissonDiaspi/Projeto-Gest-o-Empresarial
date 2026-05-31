import { api } from '@/lib/axios';

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
}

export async function getOrganizations(): Promise<Organization[]> {
  const response =
    await api.get('/organizations');

  return response.data.data;
}

export async function getOrganizationById(
  id: string,
): Promise<Organization> {
  const response =
    await api.get(`/organizations/${id}`);

  return response.data.data;
}

export async function createOrganization(
  data: {
    name: string;
  },
): Promise<Organization> {
  const response =
    await api.post(
      '/organizations',
      data,
    );

  return response.data.data;
}

export async function updateOrganization(
  id: string,
  data: {
    name?: string;
  },
): Promise<Organization> {
  const response =
    await api.patch(
      `/organizations/${id}`,
      data,
    );

  return response.data.data;
}

export async function deleteOrganization(
  id: string,
): Promise<void> {
  await api.delete(
    `/organizations/${id}`,
  );

  
}

