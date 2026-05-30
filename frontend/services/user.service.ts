import { api } from '@/lib/axios';

export async function getProfile() {
  const response = await api.get('/auth/me');

  return response.data.data;
}