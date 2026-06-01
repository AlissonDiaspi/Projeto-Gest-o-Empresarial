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

export async function getProjectAnalytics(projectId: string): Promise<ProjectAnalytics> { // função que pega os endpoints das analytics no backend
  const response = await api.get(`/projects/${projectId}/analytics`);
  
  let result = response.data;
  
  if (result && result.data && result.data.totalTasks !== undefined) {
    result = result.data;
  }
  
  if (result && result.success && result.data) {
    result = result.data;
  }
  
  return result;
}