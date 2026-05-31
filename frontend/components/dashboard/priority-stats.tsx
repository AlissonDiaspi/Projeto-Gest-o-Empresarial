// components/dashboard/priority-stats.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriorityStatsProps {
  stats?: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  } | null;
}

export function PriorityStats({ stats }: PriorityStatsProps) {
  console.log('PriorityStats recebendo:', stats);
  
  if (!stats || (stats.LOW === undefined && stats.MEDIUM === undefined && stats.HIGH === undefined)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prioridades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma task disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = (stats.LOW || 0) + (stats.MEDIUM || 0) + (stats.HIGH || 0);
  
  const priorities = [
    {
      name: 'Alta',
      value: stats.HIGH || 0,
      percentage: total > 0 ? ((stats.HIGH || 0) / total) * 100 : 0,
      icon: TrendingUp,
      color: 'text-red-500',
      bg: 'bg-red-100',
    },
    {
      name: 'Média',
      value: stats.MEDIUM || 0,
      percentage: total > 0 ? ((stats.MEDIUM || 0) / total) * 100 : 0,
      icon: Minus,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100',
    },
    {
      name: 'Baixa',
      value: stats.LOW || 0,
      percentage: total > 0 ? ((stats.LOW || 0) / total) * 100 : 0,
      icon: TrendingDown,
      color: 'text-green-500',
      bg: 'bg-green-100',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prioridades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priorities.map((priority) => (
            <div key={priority.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${priority.bg}`}>
                    <priority.icon className={`h-3 w-3 ${priority.color}`} />
                  </div>
                  <span className="text-sm font-medium">{priority.name}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-sm font-bold">{priority.value}</span>
                  <span className="text-xs text-muted-foreground">
                    {priority.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    priority.name === 'Alta' ? 'bg-red-500' :
                    priority.name === 'Média' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${priority.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}