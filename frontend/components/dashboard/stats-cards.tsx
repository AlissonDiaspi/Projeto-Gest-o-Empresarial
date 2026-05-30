import {
  FolderKanban,
  CheckSquare,
  Users,
  ClipboardCheck,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Define o que o componente espera receber do app/page.tsx
interface StatsCardsProps {
  data: {
    projectsCount: number;
    tasksCount: number;
    completedTasksCount: number;
    teamsCount: number;
  } | null;
}

export function StatsCards({ data }: StatsCardsProps) {
  // Se houver dados reais do backend, usamos eles. Caso contrário, assume 0 temporariamente
  const stats = [
    {
      title: 'Projects',
      value: data?.projectsCount ?? 0,
      icon: FolderKanban,
    },
    {
      title: 'Tasks',
      value: data?.tasksCount ?? 0,
      icon: CheckSquare,
    },
    {
      title: 'Completed',
      value: data?.completedTasksCount ?? 0,
      icon: ClipboardCheck,
    },
    {
      title: 'Teams',
      value: data?.teamsCount ?? 0,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>

              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}