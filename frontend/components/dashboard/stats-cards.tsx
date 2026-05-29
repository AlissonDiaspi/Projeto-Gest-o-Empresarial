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

const stats = [
  {
    title: 'Projects',

    value: '12',

    icon: FolderKanban,
  },

  {
    title: 'Tasks',

    value: '84',

    icon: CheckSquare,
  },

  {
    title: 'Completed',

    value: '56',

    icon: ClipboardCheck,
  },

  {
    title: 'Teams',

    value: '6',

    icon: Users,
  },
];

export function StatsCards() {
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