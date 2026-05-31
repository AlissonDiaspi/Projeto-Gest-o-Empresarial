// components/dashboard/stats-cards.tsx
'use client';

import {
  CheckSquare,
  ClipboardCheck,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface StatsCardsProps {
  data?: {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    doneTasks: number;
    overdueTasks: number;
  } | null;
}

export function StatsCards({ data }: StatsCardsProps) {
  console.log('StatsCards recebendo data:', data);
  
  if (!data) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader><CardTitle className="text-sm">Carregando...</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">-</p></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    { title: 'Total de Tasks', value: data.totalTasks ?? 0, icon: CheckSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'A Fazer', value: data.todoTasks ?? 0, icon: Clock, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'Em Progresso', value: data.inProgressTasks ?? 0, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { title: 'Concluídas', value: data.doneTasks ?? 0, icon: ClipboardCheck, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bg}`}><Icon className={`h-4 w-4 ${stat.color}`} /></div>
              </CardHeader>
              <CardContent><p className="text-3xl font-bold">{stat.value}</p></CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Card de Tasks Atrasadas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tasks Atrasadas</CardTitle>
          <div className="p-2 rounded-full bg-red-50"><AlertTriangle className="h-4 w-4 text-red-500" /></div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-600">{data.overdueTasks ?? 0}</p>
          {data.overdueTasks && data.overdueTasks > 0 && <p className="text-xs text-red-500 mt-1">Atenção! Tasks com prazo vencido</p>}
        </CardContent>
      </Card>
    </>
  );
}