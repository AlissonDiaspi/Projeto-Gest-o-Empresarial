
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import MainLayout from '@/app/main-layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, ArrowLeft, MessageSquare, FolderKanban, BarChart3, FileText, RefreshCw, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getProjectById, deleteProject } from '@/services/project.service';
import { getTasks } from '@/services/task.service';
import { getProjectAnalytics } from '@/services/analytics.service';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { ChatRoom } from '@/components/chat/chat-room';
import { FileUploader } from '@/components/files/file-uploader';
import { FilesList } from '@/components/files/files-list';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { PriorityStats } from '@/components/dashboard/priority-stats';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { OverdueAlert } from '@/components/dashboard/overdue-alert';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ProjectDetailPage() { // pagina de detalhes de um projeto de uma empresa
  const params = useParams(); // nessa pagina entra a parte do kanban, chat, analytics e files
  const router = useRouter();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('kanban');
  const [fileRefreshTrigger, setFileRefreshTrigger] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => { // carrega o projeto deuma organização
    const organizationId = localStorage.getItem('active_organization_id');
    if (!organizationId) { 
      setLoading(false); 
      return; 
    }
    try {
      const [projectData, tasksData] = await Promise.all([
        getProjectById(organizationId, projectId), 
        getTasks(projectId)
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (error: any) { 
      console.error(error); 
      toast.error('Erro ao carregar dados'); 
    } finally { 
      setLoading(false); 
    }
  };

  const loadAnalytics = useCallback(async () => { // carregar a parte de dados de um projeto 
    if (!projectId) return;
    try {
      setLoadingAnalytics(true);
      const response = await getProjectAnalytics(projectId);
      setAnalytics(response);
    } catch (error) { 
      console.error('Erro ao carregar analytics:', error); 
    } finally { 
      setLoadingAnalytics(false); 
    }
  }, [projectId]);

  const handleTaskUpdated = async () => {
    try {
      const tasksData = await getTasks(projectId);
      setTasks(tasksData);
      await loadAnalytics();
      toast.success('Dados atualizados!');
    } catch (error) { 
      console.error(error); 
      toast.error('Erro ao recarregar'); 
    }
  };

  const handleFileUploadComplete = () => {  // carregar a parte de arquivos 
    setFileRefreshTrigger(prev => prev + 1); 
    toast.success('Arquivo enviado!'); 
  };

  const handleRefreshAnalytics = () => {  // recarregar a parte de arquivos 
    loadAnalytics(); 
    toast.info('Recarregando...'); 
  };

  const handleDeleteProject = async () => { // deletar um projeto 
    const organizationId = localStorage.getItem('active_organization_id');
    if (!organizationId) return;
    
    try {
      setDeleting(true);
      await deleteProject(organizationId, projectId);
      toast.success('Projeto excluído com sucesso!');
      router.push('/projects');
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast.error('Erro ao excluir projeto');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  useEffect(() => { 
    loadData(); 
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

  if (!project) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Projeto não encontrado</h2>
            <Link href="/projects" className="text-blue-500 hover:underline mt-2 inline-block">Voltar</Link>
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
          <div className="flex justify-between items-start">
            <div>
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Link>
              <h1 className="text-3xl font-bold mt-2">{project.name}</h1>
              {project.description && <p className="text-muted-foreground mt-1">{project.description}</p>}
              
              {/* Exibir múltiplos times */}
              {project.teams && project.teams.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.teams.map((team: any) => (
                    <Badge key={team.id} variant="secondary">
                      {team.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {activeTab === 'kanban' && (
              <div className="flex gap-2">
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Nova Task
                </Button>
                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Excluir Projeto
                </Button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 max-w-md">
              <TabsTrigger value="kanban"><FolderKanban className="h-4 w-4 mr-2" />Kanban</TabsTrigger>
              <TabsTrigger value="chat"><MessageSquare className="h-4 w-4 mr-2" />Chat</TabsTrigger>
              <TabsTrigger value="files"><FileText className="h-4 w-4 mr-2" />Arquivos</TabsTrigger>
              <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-2" />Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="kanban" className="mt-6">
              <KanbanBoard tasks={tasks} projectId={projectId} onTaskUpdate={handleTaskUpdated} />
            </TabsContent>

            <TabsContent value="chat" className="mt-6">
              <ChatRoom projectId={projectId} projectName={project.name} />
            </TabsContent>

            <TabsContent value="files" className="mt-6 space-y-6">
              <FileUploader projectId={projectId} onUploadComplete={handleFileUploadComplete} />
              <FilesList projectId={projectId} refreshTrigger={fileRefreshTrigger} />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6 space-y-6">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleRefreshAnalytics} disabled={loadingAnalytics}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingAnalytics ? 'animate-spin' : ''}`} /> Recarregar
                </Button>
              </div>
              
              {loadingAnalytics ? (
                <div className="flex justify-center h-96 items-center">
                  <div className="animate-spin h-8 w-8 border-b-2 rounded-full" />
                </div>
              ) : !analytics ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Crie tasks para ver as estatísticas</p>
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
                  <div className="text-center">
                    <Link href={`/projects/${projectId}/analytics`}>
                      <Button variant="outline">Ver análises detalhadas</Button>
                    </Link>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <CreateTaskDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen} 
          projectId={projectId} 
          onSuccess={handleTaskUpdated} 
        />

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Projeto</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o projeto "{project?.name}"?
                <br />
                Todas as tasks, arquivos e chats serão permanentemente excluídos.
                <br />
                <span className="text-red-600 font-medium">Esta ação não pode ser desfeita!</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600" disabled={deleting}>
                {deleting ? 'Excluindo...' : 'Sim, excluir projeto'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </MainLayout>
    </ProtectedRoute>
  );
}