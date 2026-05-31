// services/analytics.service.ts
import { api } from '@/lib/axios';

export interface ProjectAnalytics {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  overdueTasks: number;
  priorityStats: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  };
}

export async function getProjectAnalytics(projectId: string): Promise<ProjectAnalytics> {
  const response = await api.get(`/projects/${projectId}/analytics`);
  
  // Tenta extrair os dados de onde estiverem
  let result = response.data;
  
  // Se tiver outra camada de data
  if (result && result.data && result.data.totalTasks !== undefined) {
    result = result.data;
  }
  
  // Se tiver success e data
  if (result && result.success && result.data) {
    result = result.data;
  }
  
  console.log('Dados extraídos do analytics:', result);
  return result;
}