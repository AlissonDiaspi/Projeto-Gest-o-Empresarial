'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TasksChartProps {
  data?: number[]; // Recebe o array de produtividade (ex: [4, 7, 5, 9, 6, 3, 8])
}

export function TasksChart({ data }: TasksChartProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Monta o formato de array de objetos que o Recharts precisa dinamicamente
  const chartData = days.map((day, index) => ({
    name: day,
    tasks: data?.[index] ?? 0, // Pega o valor do índice correspondente ou 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Weekly Productivity
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="tasks"
                fill="currentColor"
                className="fill-primary"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}