// app/teams/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamDialog } from '@/components/teams/team-dialog';
import { TeamMembersDialog } from '@/components/teams/team-members-dialog';
import { getTeams, deleteTeam, Team } from '@/services/team.service';
import { Users, Trash2, Pencil, UsersIcon, AlertCircle } from 'lucide-react';
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

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTeams = async () => {
    const orgId = localStorage.getItem('active_organization_id');
    if (!orgId) {
      console.error('Nenhuma organização ativa');
      setLoading(false);
      return;
    }
    
    setOrganizationId(orgId);
    
    try {
      const data = await getTeams(orgId);
      setTeams(data);
    } catch (error) {
      console.error('Erro ao carregar times:', error);
      toast.error('Erro ao carregar times');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!teamToDelete) return;
    
    try {
      setDeleting(true);
      await deleteTeam(teamToDelete.id);
      toast.success('Time deletado com sucesso');
      await loadTeams();
      setTeamToDelete(null);
    } catch (error: any) {
      console.error('Erro ao deletar time:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao deletar time';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  return (
    <ProtectedRoute>
      <main className="flex min-h-screen">
        <Sidebar />
        <section className="flex flex-1 flex-col">
          <Navbar />
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Times</h1>
                <p className="text-muted-foreground mt-1">
                  Organize seus projetos por times e equipes
                </p>
              </div>
              {organizationId && (
                <TeamDialog organizationId={organizationId} onSuccess={loadTeams}>
                  <Button>
                    <Users className="mr-2 h-4 w-4" />
                    Novo Time
                  </Button>
                </TeamDialog>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : teams.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Nenhum time criado</h3>
                <p className="text-muted-foreground mt-1">
                  Crie seu primeiro time para organizar seus projetos
                </p>
                {organizationId && (
                  <TeamDialog organizationId={organizationId} onSuccess={loadTeams}>
                    <Button className="mt-4">
                      <Users className="mr-2 h-4 w-4" />
                      Criar primeiro time
                    </Button>
                  </TeamDialog>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <Card key={team.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{team.name}</CardTitle>
                          {team.description && (
                            <CardDescription className="mt-2">
                              {team.description}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {/* Botão de Editar */}
                          <TeamDialog
                            organizationId={organizationId!}
                            team={team}
                            onSuccess={loadTeams}
                          >
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TeamDialog>
                          
                          {/* Botão de Deletar */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTeamToDelete(team)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <UsersIcon className="h-4 w-4" />
                          <span>{team.memberCount || 0} membro(s)</span>
                          <span className="mx-1">•</span>
                          <span>{team.projectCount || 0} projeto(s)</span>
                        </div>
                        {organizationId && (
                          <TeamMembersDialog team={team} organizationId={organizationId}>
                            <Button variant="outline" size="sm">
                              <UsersIcon className="mr-2 h-4 w-4" />
                              Gerenciar
                            </Button>
                          </TeamMembersDialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Dialog de confirmação para deletar */}
      <AlertDialog open={!!teamToDelete} onOpenChange={() => setTeamToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Time</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o time "{teamToDelete?.name}"?
              Esta ação não pode ser desfeita.
              {teamToDelete?.memberCount && teamToDelete.memberCount > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 rounded-md flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    Este time tem {teamToDelete.memberCount} membro(s). 
                    Eles serão removidos do time.
                  </span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600" disabled={deleting}>
              {deleting ? 'Deletando...' : 'Sim, deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  );
}