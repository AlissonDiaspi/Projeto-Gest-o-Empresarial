
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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil } from 'lucide-react';
import { createTeam, updateTeam, Team } from '@/services/team.service';
import { toast } from 'sonner';

interface TeamDialogProps {
  organizationId: string;
  team?: Team;
  onSuccess: () => void;
  children?: React.ReactNode;
}

export function TeamDialog({ organizationId, team, onSuccess, children }: TeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (team && open) {
      setName(team.name);
      setDescription(team.description || '');
    } else if (!team && open) {
      setName('');
      setDescription('');
    }
  }, [team, open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Nome do time é obrigatório');
      return;
    }

    try {
      setLoading(true);
      
      if (team) {
        // Editar time existente
        await updateTeam(team.id, {
          name: name.trim(),
          description: description.trim() || undefined,
        });
        toast.success('Time atualizado com sucesso!');
      } else {
        // Criar novo time
        await createTeam({
          name: name.trim(),
          description: description.trim() || undefined,
          organizationId,
        });
        toast.success('Time criado com sucesso!');
      }
      
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar time:', error);
      toast.error(team ? 'Erro ao atualizar time' : 'Erro ao criar time');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
            {team ? (
              <Pencil className="mr-2 h-4 w-4" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {team ? 'Editar' : 'Novo Time'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{team ? 'Editar Time' : 'Criar Novo Time'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Time *</Label>
            <Input
              id="name"
              placeholder="Ex: Backend, Frontend, Design, QA..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva a função deste time..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
              {loading ? 'Salvando...' : team ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}