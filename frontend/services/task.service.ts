
import { api } from '@/lib/axios';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectId: string;
  dueDate?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
} // classe responsável por pegar todos os endpoints do backend relacionado as tasks 

export async function getTasks(projectId: string): Promise<Task[]> {
  const response = await api.get(`/projects/${projectId}/tasks`);
  return response.data.data;
}

export async function createTask(
  projectId: string,
  data: {
    title: string;
    description?: string;
    priority: string;
    assignedToId?: string;
    dueDate?: string;
  },
): Promise<Task> {
  const response = await api.post(`/projects/${projectId}/tasks`, data);
  return response.data.data;
}

export async function updateTask(
  projectId: string,
  taskId: string,
  data: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    assignedToId?: string;
    dueDate?: string;
  },
): Promise<Task> {
  const response = await api.patch(`/projects/${projectId}/tasks/${taskId}`, data);
  return response.data.data;
}

export async function updateTaskStatus(
  projectId: string,
  taskId: string,
  status: string,
): Promise<Task> {
  const response = await api.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status });
  return response.data.data;
}

export async function deleteTask(projectId: string, taskId: string): Promise<void> {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`);
}