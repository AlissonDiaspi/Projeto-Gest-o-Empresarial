'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/use-auth';

import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { TasksPieChart } from '@/components/dashboard/tasks-pie-chart';
import { TasksChart } from '@/components/dashboard/tasks-chart';

import {
  DashboardStats,
  getDashboardStats,
} from '@/services/dashboard.service';

import { ProtectedRoute } from '@/components/auth/protected-route';

export default function Home() {
  const { user, isLoading: isAuthLoading } =
    useAuth();

  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [isStatsLoading, setIsStatsLoading] =
    useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsStatsLoading(true);

        const data =
          await getDashboardStats();

        setStats(data);
      } catch (error) {
        console.error(
          'Erro ao carregar dashboard:',
          error,
        );
      } finally {
        setIsStatsLoading(false);
      }
    }

    if (!isAuthLoading && user) {
      loadDashboard();
    }
  }, [isAuthLoading, user]);

  return (
    <ProtectedRoute>
      {isAuthLoading || isStatsLoading ? (
        <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
          <p className="text-sm font-medium animate-pulse text-muted-foreground">
            Carregando dashboard...
          </p>
        </div>
      ) : (
        <main className="flex min-h-screen bg-background text-foreground">
          <Sidebar />

          <section className="flex flex-1 flex-col">
            <Navbar />

            <div className="space-y-8 p-8">
              <div>
                <h1 className="text-5xl font-bold tracking-tight">
                  Enterprise Dashboard 🚀
                </h1>

                <p className="mt-2 text-muted-foreground">
                  Bem-vindo de volta,
                  {' '}
                  {user?.name}
                </p>
              </div>

              {stats && (
                <>
                  <StatsCards
                    data={stats}
                  />

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <TasksPieChart
                      data={
                        stats.taskStatusDistribution
                      }
                    />

                    <TasksChart
                      data={
                        stats.weeklyProductivity
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      )}
    </ProtectedRoute>
  );
}