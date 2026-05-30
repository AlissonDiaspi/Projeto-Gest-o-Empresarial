import { api } from '@/lib/axios';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status:
    | 'TODO'
    | 'IN_PROGRESS'
    | 'DONE';

  projectId: string;

  createdAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  projectId: string;
}

export async function getTasks(): Promise<Task[]> {
  const response = await api.get(
    '/tasks',
  );

  return response.data.data ?? [];
}

export async function getTaskById(
  id: string,
): Promise<Task> {
  const response = await api.get(
    `/tasks/${id}`,
  );

  return response.data.data;
}

export async function createTask(
  data: CreateTaskDTO,
): Promise<Task> {
  const response = await api.post(
    '/tasks',
    data,
  );

  return response.data.data;
}

export async function updateTask(
  id: string,
  data: Partial<CreateTaskDTO>,
): Promise<Task> {
  const response = await api.patch(
    `/tasks/${id}`,
    data,
  );

  return response.data.data;
}

export async function deleteTask(
  id: string,
): Promise<void> {
  await api.delete(
    `/tasks/${id}`,
  );
}