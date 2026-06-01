
'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { getProjects, deleteProject, Project } from '@/services/project.service';
import MainLayout from '@/app/main-layout';
import { CreateProjectDialog } from '@/components/projects/create-project-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderKanban, Trash2, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
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

export default function ProjectsPage() { // pagina de projetos 
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProjects = async () => { // carregar os projetos ativos de uma organização
    const orgId = localStorage.getItem('active_organization_id');
    if (!orgId) {
      setLoading(false);
      return;
    }
    setOrganizationId(orgId);
    try {
      const data = await getProjects(orgId);
      setProjects(data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => { // para deletar um projeto de uma organização 
    if (!projectToDelete || !organizationId) return;
    
    try {
      setDeleting(true);
      await deleteProject(organizationId, projectToDelete.id);
      toast.success('Projeto excluído com sucesso!');
      loadProjects();
      setProjectToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir projeto');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Projetos</h1>
              <p className="text-muted-foreground mt-1">Gerencie seus projetos</p>
            </div>
            {organizationId && <CreateProjectDialog onCreated={loadProjects} />}
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Nenhum projeto</h3>
              <p className="text-muted-foreground mt-1">Crie seu primeiro projeto para começar</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div key={project.id} className="relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      setProjectToDelete(project);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <Link href={`/projects/${project.id}`}>
                    <Card className="hover:shadow-lg transition cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle className="text-xl">{project.name}</CardTitle>
                        {project.description && (
                          <CardDescription>{project.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {project.startDate && (
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                          {project.endDate && (
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              Fim: {new Date(project.endDate).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </div>
                        
                        {/* Exibir múltiplos times */}
                        {project.teams && project.teams.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {project.teams.map((team) => (
                              <Badge key={team.id} variant="secondary" className="text-xs">
                                {team.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Projeto</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir "{projectToDelete?.name}"?
                <br />
                Todas as tasks, arquivos e chats serão permanentemente excluídos.
                <br />
                <span className="text-red-600 font-medium">Esta ação não pode ser desfeita!</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600" disabled={deleting}>
                {deleting ? 'Excluindo...' : 'Sim, excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </MainLayout>
    </ProtectedRoute>
  );
}