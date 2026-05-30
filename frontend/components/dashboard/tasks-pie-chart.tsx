'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TasksPieChartProps {
  data?: {
    pending: number;
    inProgress: number;
    completed: number;
  };
}

const COLORS = [
  '#3b82f6', // Azul para TODO / Pendente
  '#f59e0b', // Amarelo para IN_PROGRESS
  '#22c55e', // Verde para DONE / Concluído
];

export function TasksPieChart({ data }: TasksPieChartProps) {
  // Mapeia os dados dinâmicos do backend diretamente no formato do gráfico
  const chartData = [
    {
      name: 'TODO',
      value: data?.pending ?? 0,
    },
    {
      name: 'IN_PROGRESS',
      value: data?.inProgress ?? 0,
    },
    {
      name: 'DONE',
      value: data?.completed ?? 0,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Task Status
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {chartData.map(
                  (entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={
                        COLORS[index]
                      }
                    />
                  ),
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}