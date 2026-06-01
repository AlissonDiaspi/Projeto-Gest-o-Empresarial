
'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import MainLayout from '@/app/main-layout';
import { getOrganizations, createOrganization, updateOrganization, deleteOrganization, Organization } from '@/services/organization.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Plus, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export default function OrganizationsPage() { // pagina da organização com informações e opções de edição/exclusão 
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [orgName, setOrgName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<Organization | null>(null);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const data = await getOrganizations();
      setOrganizations(data);
      const savedId = localStorage.getItem('active_organization_id'); // pega as organizações ativas daquele usuário 
      if (savedId) setActiveOrgId(savedId);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar organizações');
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = (orgId: string, orgName: string) => {
    localStorage.setItem('active_organization_id', orgId);
    setActiveOrgId(orgId);
    toast.success(`Organização ativa: ${orgName}`);
    setTimeout(() => window.location.reload(), 500);
  };

  const handleSave = async () => { // caso vá atualizar um nome de uma organização 
    if (!orgName.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    try {
      setSubmitting(true);
      if (editingOrg) {
        await updateOrganization(editingOrg.id, { name: orgName });
        toast.success('Organização atualizada!');
      } else {
        const newOrg = await createOrganization({ name: orgName });
        toast.success('Organização criada!');
        if (organizations.length === 0) {
          localStorage.setItem('active_organization_id', newOrg.id);
        }
      }
      setDialogOpen(false);
      setEditingOrg(null);
      setOrgName('');
      loadOrganizations();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar organização');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => { // retorna o endpoint para deletar uma organização ativa
    if (!orgToDelete) return;
    try {
      await deleteOrganization(orgToDelete.id);
      toast.success('Organização excluída!');
      if (activeOrgId === orgToDelete.id) {
        localStorage.removeItem('active_organization_id');
      }
      setOrgToDelete(null);
      loadOrganizations();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir organização');
    }
  };

  useEffect(() => {
    loadOrganizations();
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
              <h1 className="text-3xl font-bold">Organizações</h1>
              <p className="text-muted-foreground mt-1">Gerencie suas organizações</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingOrg(null); setOrgName(''); }}>
                  <Plus className="mr-2 h-4 w-4" /> Nova Organização
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingOrg ? 'Editar' : 'Nova'} Organização</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Nome da organização" />
                  </div>
                  <Button onClick={handleSave} disabled={submitting} className="w-full">
                    {submitting ? 'Salvando...' : editingOrg ? 'Salvar' : 'Criar'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {organizations.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Nenhuma organização</h3>
              <p className="text-muted-foreground mt-1">Crie sua primeira organização</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {organizations.map((org) => (
                <Card key={org.id} className="relative group">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{org.name}</span>
                      {activeOrgId === org.id && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </CardTitle>
                    <CardDescription>ID: {org.id.slice(0, 8)}...</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Criada em: {new Date(org.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetActive(org.id, org.name)}
                          title="Usar esta organização"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingOrg(org);
                            setOrgName(org.name);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setOrgToDelete(org)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <AlertDialog open={!!orgToDelete} onOpenChange={() => setOrgToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Organização</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir "{orgToDelete?.name}"?
                <br />
                Todos os projetos, times e dados serão perdidos.
                <br />
                <span className="text-red-600 font-medium">Esta ação não pode ser desfeita!</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </MainLayout>
    </ProtectedRoute>
  );
}