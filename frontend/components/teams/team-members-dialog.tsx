// components/teams/team-members-dialog.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, Plus, Trash2, User, UserPlus, RefreshCw, CheckCircle } from 'lucide-react';
import {
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  TeamMember,
  Team,
} from '@/services/team.service';
import { getMembers, Member } from '@/services/member.service';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TeamMembersDialogProps {
  team: Team;
  organizationId: string;
  children?: React.ReactNode;
}

export function TeamMembersDialog({ team, organizationId, children }: TeamMembersDialogProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const teamMembers = await getTeamMembers(team.id);
      setMembers(teamMembers);
      
      const orgMembers = await getMembers(organizationId);
      const teamMemberIds = new Set(teamMembers.map(m => m.userId));
      const available = orgMembers.filter(m => !teamMemberIds.has(m.id));
      setAvailableMembers(available);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast.error('Selecione um membro');
      return;
    }

    const selectedMember = availableMembers.find(m => m.id === selectedUserId);
    if (!selectedMember) return;

    try {
      setAdding(true);
      await addTeamMember(team.id, { userId: selectedUserId });
      toast.success(`${selectedMember.name} adicionado ao time!`);
      setSelectedUserId(null);
      await loadData();
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.response?.data?.message || 'Erro ao adicionar membro');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      await removeTeamMember(team.id, memberToRemove.userId);
      toast.success(`${memberToRemove.user.name} removido do time`);
      await loadData();
      setMemberToRemove(null);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao remover membro');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Gerenciar
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-[450px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl">Gerenciar Time</DialogTitle>
            <p className="text-sm text-muted-foreground">{team.name}</p>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            <div className="p-6 pt-4 space-y-6">
              {/* Seção de adicionar membro */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground">
                  <UserPlus className="h-4 w-4" />
                  ADICIONAR MEMBRO
                </h3>
                
                {availableMembers.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <User className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Todos os membros já estão neste time
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableMembers.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => setSelectedUserId(member.id)}
                        className={`
                          flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                          ${selectedUserId === member.id 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        {selectedUserId === member.id && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    ))}
                    
                    <Button 
                      onClick={handleAddMember} 
                      disabled={adding || !selectedUserId}
                      className="w-full mt-4"
                      size="lg"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {adding ? 'Adicionando...' : 'Adicionar ao time'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Lista de membros atuais */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  MEMBROS DO TIME ({members.length})
                </h3>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <User className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Nenhum membro neste time
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {members.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white">
                              {getInitials(member.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.user.name}</p>
                            <p className="text-sm text-gray-500">{member.user.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMemberToRemove(member)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover membro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <span className="font-semibold">{memberToRemove?.user.name}</span> do time <span className="font-semibold">{team.name}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember} className="bg-red-600 hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}