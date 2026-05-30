import { getProjects } from './project.service';
import { getTasks } from './task.service';
import { getTeams } from './team.service';

export interface DashboardStats {
  projectsCount: number;
  tasksCount: number;
  completedTasksCount: number;
  teamsCount: number;

  taskStatusDistribution: {
    pending: number;
    inProgress: number;
    completed: number;
  };

  weeklyProductivity: number[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [projects, tasks, teams] =
    await Promise.all([
      getProjects(),
      getTasks(),
      getTeams(),
    ]);

  const projectsCount =
    projects.length;

  const tasksCount =
    tasks.length;

  const teamsCount =
    teams.length;

  const completedTasksCount =
    tasks.filter(
      (task) =>
        task.status === 'DONE',
    ).length;

  const taskStatusDistribution = {
    pending: tasks.filter(
      (task) =>
        task.status === 'TODO',
    ).length,

    inProgress: tasks.filter(
      (task) =>
        task.status ===
        'IN_PROGRESS',
    ).length,

    completed:
      completedTasksCount,
  };

  /*
    Dashboard visual temporário.

    Quando você adicionar:
    - createdAt
    - completedAt

    nas Tasks, podemos trocar
    por métricas reais.
  */

  const baseValue =
    tasksCount > 0
      ? Math.ceil(
          tasksCount / 7,
        )
      : 0;

  const weeklyProductivity = [
    Math.max(
      0,
      baseValue - 1,
    ),

    Math.max(
      0,
      baseValue + 2,
    ),

    baseValue,

    Math.max(
      0,
      baseValue + 4,
    ),

    Math.max(
      0,
      baseValue + 1,
    ),

    Math.max(
      0,
      baseValue - 2,
    ),

    Math.min(
      completedTasksCount,
      5,
    ),
  ];

  return {
    projectsCount,
    tasksCount,
    completedTasksCount,
    teamsCount,

    taskStatusDistribution,

    weeklyProductivity,
  };
}