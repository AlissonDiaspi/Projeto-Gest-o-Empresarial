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

const data = [
  {
    name: 'TODO',

    value: 14,
  },

  {
    name: 'IN_PROGRESS',

    value: 8,
  },

  {
    name: 'DONE',

    value: 22,
  },
];

const COLORS = [
  '#3b82f6',

  '#f59e0b',

  '#22c55e',
];

export function TasksPieChart() {
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
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {data.map(
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