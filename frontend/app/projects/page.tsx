// app/projects/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { getProjects, deleteProject, Project } from '@/services/project.service';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { CreateProjectDialog } from '@/components/projects/create-project-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProjects = async () => {
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

  const handleDeleteProject = async () => {
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
        <main className="flex min-h-screen">
          <Sidebar />
          <section className="flex-1 flex-col">
            <Navbar />
            <div className="flex justify-center h-96 items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" />
            </div>
          </section>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="flex min-h-screen">
        <Sidebar />
        <section className="flex-1 flex-col">
          <Navbar />
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
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
                        <CardContent>
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
                            {project.team && (
                              <div className="flex items-center gap-1">
                                Time: {project.team.name}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

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
    </ProtectedRoute>
  );
}