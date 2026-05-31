// components/projects/create-project-dialog.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { createProject } from '@/services/project.service';
import { getTeams, Team } from '@/services/team.service';
import { toast } from 'sonner';

interface Props {
  onCreated: () => void;
}

export function CreateProjectDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('none'); // Mudado para 'none'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);

  useEffect(() => {
    const loadTeams = async () => {
      const organizationId = localStorage.getItem('active_organization_id');
      if (!organizationId) return;
      try {
        setLoadingTeams(true);
        const data = await getTeams(organizationId);
        setTeams(data);
      } catch (error) { console.error(error); }
      finally { setLoadingTeams(false); }
    };
    if (open) {
      loadTeams();
      setName('');
      setDescription('');
      setSelectedTeamId('none');
      setStartDate('');
      setEndDate('');
    }
  }, [open]);

  async function handleCreate() {
    const organizationId = localStorage.getItem('active_organization_id');
    if (!organizationId) { toast.error('Nenhuma organização ativa'); return; }
    if (!name.trim()) { toast.error('Nome é obrigatório'); return; }
    try {
      setLoading(true);
      await createProject(organizationId, {
        name,
        description: description || undefined,
        teamId: selectedTeamId !== 'none' ? selectedTeamId : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      toast.success('Projeto criado!');
      onCreated();
      setOpen(false);
    } catch (error) { console.error(error); toast.error('Erro ao criar projeto'); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>+ Novo Projeto</Button></DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>Criar Projeto</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input placeholder="Nome do projeto" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
          </div>
          
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
          </div>
          
          <div className="space-y-2">
            <Label>Time</Label>
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId} disabled={loading || loadingTeams}>
              <SelectTrigger><SelectValue placeholder="Selecione um time" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem time</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Início</Label>
              <div className="relative">
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={loading} />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data Fim</Label>
              <div className="relative">
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={loading} />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <Button onClick={handleCreate} disabled={loading || !name.trim()} className="w-full">
            {loading ? 'Criando...' : 'Criar Projeto'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}