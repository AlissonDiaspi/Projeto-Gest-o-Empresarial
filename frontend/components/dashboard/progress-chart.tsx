// components/dashboard/progress-chart.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle, CheckCircle, Clock } from 'lucide-react';

interface ProgressChartProps {
  total: number;
  done: number;
  inProgress: number;
  todo: number;
}

export function ProgressChart({ total = 0, done = 0, inProgress = 0, todo = 0 }: ProgressChartProps) {
  console.log('ProgressChart recebendo:', { total, done, inProgress, todo });
  
  const completionRate = total > 0 ? (done / total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso do Projeto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray={`${completionRate * 2.83} 283`} strokeDashoffset="0" transform="rotate(-90 50 50)" className="transition-all duration-500" />
              <text x="50" y="50" textAnchor="middle" dy="7" className="text-2xl font-bold fill-current">{Math.round(completionRate)}%</text>
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 w-full">
            <div className="text-center"><div className="flex items-center justify-center gap-1 text-red-500"><Circle className="h-3 w-3 fill-red-500" /><span className="text-xs">A Fazer</span></div><p className="text-lg font-bold">{todo || 0}</p></div>
            <div className="text-center"><div className="flex items-center justify-center gap-1 text-yellow-500"><Clock className="h-3 w-3" /><span className="text-xs">Progresso</span></div><p className="text-lg font-bold">{inProgress || 0}</p></div>
            <div className="text-center"><div className="flex items-center justify-center gap-1 text-green-500"><CheckCircle className="h-3 w-3" /><span className="text-xs">Concluído</span></div><p className="text-lg font-bold">{done || 0}</p></div>
          </div>
          <div className="w-full mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Progresso</span><span>{Math.round(completionRate)}%</span></div>
            <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }} /></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}