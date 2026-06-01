
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import MainLayout from '@/app/main-layout';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { PriorityStats } from '@/components/dashboard/priority-stats';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { OverdueAlert } from '@/components/dashboard/overdue-alert';
import { getProjectAnalytics } from '@/services/analytics.service';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, RefreshCw, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProjectAnalyticsPage() { // pagina exclusiva para os dados de um projeto(dados das tasks)
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => { // carregar a parte de analytics dentro de uma pagina própria 
    if (!projectId) return;
    
    try {
      setLoading(true);
      const response = await getProjectAnalytics(projectId);
      console.log('Analytics detalhado carregado:', response);
      setAnalytics(response);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
      toast.error('Erro ao carregar análises');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [projectId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex justify-center h-96 items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" />
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href={`/projects/${projectId}`}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao projeto
              </Link>
            </div>
            <Button variant="outline" size="sm" onClick={loadAnalytics} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Recarregar
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold">Análises Detalhadas</h1>
            <p className="text-muted-foreground">Métricas e estatísticas completas do projeto</p>
          </div>

          {!analytics ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Nenhum dado disponível</h3>
              <p className="text-muted-foreground mt-1">
                Crie tasks para ver as estatísticas do projeto
              </p>
              <Link href={`/projects/${projectId}`}>
                <Button className="mt-4">Voltar ao projeto</Button>
              </Link>
            </div>
          ) : (
            <>
              <OverdueAlert count={analytics.overdueTasks || 0} />
              <StatsCards data={analytics} />
              <div className="grid gap-6 lg:grid-cols-2">
                <ProgressChart 
                  total={analytics.totalTasks || 0} 
                  done={analytics.doneTasks || 0} 
                  inProgress={analytics.inProgressTasks || 0} 
                  todo={analytics.todoTasks || 0} 
                />
                <PriorityStats stats={analytics.priorityStats} />
              </div>
            </>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}