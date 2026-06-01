
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/components/auth/protected-route';
import MainLayout from '@/app/main-layout';
import { useOrganization } from '@/hooks/use-organization';
import { getProjects } from '@/services/project.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonStats } from '@/components/ui/skeleton-stats';
import { Building2, FolderKanban, CheckCircle, Bell } from 'lucide-react';

export default function Home() { // pagina principal do projeto com as principais funcionalidades 
  const { user, isLoading: isAuthLoading } = useAuth();
  const { activeOrganization, organizations, loading: orgLoading } = useOrganization();
  const [projectsCount, setProjectsCount] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(true);

  const isLoading = isAuthLoading || orgLoading || loadingStats;

  useEffect(() => {
    const loadProjectsCount = async () => {
      const orgId = localStorage.getItem('active_organization_id');
      if (!orgId) {
        setLoadingStats(false);
        return;
      }
      try {
        const projects = await getProjects(orgId);
        setProjectsCount(projects.length);
      } catch (error) {
        console.error('Erro ao carregar projetos:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    
    loadProjectsCount();
  }, [activeOrganization?.id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <SkeletonStats />
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo de volta, {user?.name}! 👋
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Organização Ativa</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{activeOrganization?.name || 'Nenhuma'}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Organizações</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{organizations.length}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Projetos</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{projectsCount}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">✓ Online</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Sistema Enterprise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                    <Bell className="h-4 w-4 text-green-500" />
                    <span>Notificações</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span>Organizações</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span>Projetos e Tasks</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span>Chat Realtime</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </MainLayout>
    </ProtectedRoute>
  );
}