// components/members/members-dialog.tsx
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, Plus, Trash2, Crown, User, UserCog, Mail, RefreshCw } from 'lucide-react';
import { getMembers, inviteMember, removeMember, updateMemberRole, Member } from '@/services/member.service';
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

interface MembersDialogProps {
  organizationId: string;
  children?: React.ReactNode;
}

export function MembersDialog({ organizationId, children }: MembersDialogProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  const [inviting, setInviting] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [editingRole, setEditingRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');

  const loadMembers = async () => {
    if (!organizationId) {
      console.error('Organization ID não disponível');
      toast.error('Erro: Organização não identificada');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Carregando membros para organização:', organizationId);
      const data = await getMembers(organizationId);
      console.log('Membros carregados:', data);
      
      const validMembers = (data || []).map(member => ({
        ...member,
        name: member.name || member.email?.split('@')[0] || 'Usuário',
        email: member.email || 'sem-email@exemplo.com',
        role: member.role || 'MEMBER',
      }));
      
      setMembers(validMembers);
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
      toast.error('Erro ao carregar membros');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!organizationId) {
      toast.error('Erro: Organização não identificada');
      return;
    }

    if (!inviteEmail.trim()) {
      toast.error('Digite um email');
      return;
    }

    try {
      setInviting(true);
      
      console.log('Enviando convite para organização:', organizationId);
      console.log('Email:', inviteEmail);
      
      await inviteMember(organizationId, {
        email: inviteEmail,
      });
      
      toast.success('Membro adicionado com sucesso!');
      setInviteEmail('');
      setInviteName('');
      await loadMembers();
    } catch (error: any) {
      console.error('Erro ao adicionar membro:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao adicionar membro. Verifique se o usuário existe.';
      toast.error(errorMessage);
    } finally {
      setInviting(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!memberToEdit || !editingRole) return;

    try {
      await updateMemberRole(organizationId, memberToEdit.id, { role: editingRole });
      toast.success('Papel do membro atualizado com sucesso');
      await loadMembers();
      setMemberToEdit(null);
      setEditingRole('MEMBER');
    } catch (error) {
      console.error('Erro ao atualizar papel:', error);
      toast.error('Erro ao atualizar papel do membro');
    }
  };

  const handleRemove = async () => {
    if (!memberToRemove) return;

    try {
      await removeMember(organizationId, memberToRemove.id);
      toast.success('Membro removido com sucesso');
      await loadMembers();
      setMemberToRemove(null);
    } catch (error) {
      console.error('Erro ao remover:', error);
      toast.error('Erro ao remover membro');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'ADMIN':
        return <Crown className="h-4 w-4 text-blue-600" />;
      case 'MEMBER':
        return <UserCog className="h-4 w-4 text-green-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'Proprietário';
      case 'ADMIN':
        return 'Administrador';
      case 'MEMBER':
        return 'Membro';
      default:
        return role || 'Membro';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    if (open && organizationId) {
      loadMembers();
    }
  }, [open, organizationId]);

  // Separar owner dos outros membros
  const owner = members.find(m => m.role === 'OWNER');
  const otherMembers = members.filter(m => m.role !== 'OWNER');

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Membros
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Gerenciar Membros</DialogTitle>
            <p className="text-sm text-gray-500">
              Organização ID: {organizationId}
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Adicionar novo membro */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Adicionar novo membro</h3>
              <div className="space-y-3">
                <div>
                  <Label>Email do usuário *</Label>
                  <Input
                    placeholder="email@exemplo.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    type="email"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    O usuário já deve ter uma conta no sistema
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label>Papel (opcional)</Label>
                    <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as 'ADMIN' | 'MEMBER')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                        <SelectItem value="MEMBER">Membro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleInvite} disabled={inviting || !inviteEmail} className="w-32">
                      {inviting ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      {inviting ? 'Adicionando...' : 'Adicionar'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de membros */}
            <div className="space-y-3">
              <h3 className="font-semibold">Membros ({members.length})</h3>
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2">Carregando membros...</p>
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum membro encontrado</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {/* Proprietário primeiro */}
                  {owner && (
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white font-medium">
                          {getInitials(owner.name)}
                        </div>
                        <div>
                          <p className="font-medium">{owner.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {owner.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm">
                          {getRoleIcon(owner.role)}
                          <span className="font-medium text-yellow-700">{getRoleName(owner.role)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Outros membros */}
                  {otherMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {getInitials(member.name)}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          {getRoleIcon(member.role)}
                          <span>{getRoleName(member.role)}</span>
                        </div>
                        
                        {/* Botão para editar papel */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setMemberToEdit(member);
                            setEditingRole(member.role as 'ADMIN' | 'MEMBER');
                          }}
                        >
                          <UserCog className="h-4 w-4" />
                        </Button>
                        
                        {/* Botão para remover */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMemberToRemove(member)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar papel */}
      <AlertDialog open={!!memberToEdit} onOpenChange={() => setMemberToEdit(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterar papel do membro</AlertDialogTitle>
            <AlertDialogDescription>
              Selecione o novo papel para {memberToEdit?.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={editingRole} onValueChange={(value) => setEditingRole(value as 'ADMIN' | 'MEMBER')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="MEMBER">Membro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateRole}>
              Salvar alteração
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmação para remover */}
      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover membro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover {memberToRemove?.name} da organização?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-red-600">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}