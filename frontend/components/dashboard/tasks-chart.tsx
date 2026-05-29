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

const data = [
  {
    name: 'Mon',

    tasks: 4,
  },

  {
    name: 'Tue',

    tasks: 7,
  },

  {
    name: 'Wed',

    tasks: 5,
  },

  {
    name: 'Thu',

    tasks: 9,
  },

  {
    name: 'Fri',

    tasks: 6,
  },

  {
    name: 'Sat',

    tasks: 3,
  },

  {
    name: 'Sun',

    tasks: 8,
  },
];

export function TasksChart() {
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
            <BarChart data={data}>
              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="tasks"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}