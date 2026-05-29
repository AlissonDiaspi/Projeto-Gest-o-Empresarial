import { Sidebar } from '@/components/layout/sidebar';

import { Navbar } from '@/components/layout/navbar';

import { StatsCards } from '@/components/dashboard/stats-cards';

import { TasksChart } from '@/components/dashboard/tasks-chart';

import { TasksPieChart } from '@/components/dashboard/tasks-pie-chart';

export default function Home() {
  return (
    <main className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <section className="flex flex-1 flex-col">
        <Navbar />

        <div className="space-y-8 p-8">
          <h1 className="text-4xl font-bold">
            Enterprise Dashboard 🚀
          </h1>

          <StatsCards />
          <TasksChart />
          <div className="grid gap-6 xl:grid-cols-2">
  <TasksChart />

  <TasksPieChart />
</div>
        </div>
      </section>
    </main>
  );
}