
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { createTask } from '@/services/task.service';
import { getMembers, Member } from '@/services/member.service';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSuccess: () => void;
}

export function CreateTaskDialog({ open, onOpenChange, projectId, onSuccess }: Props) { // função para criar uma task no frontend
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [assignedTo, setAssignedTo] = useState('none');
  const [dueDate, setDueDate] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      const organizationId = localStorage.getItem('active_organization_id');
      if (!organizationId) return;
      
      try {
        setLoadingMembers(true);
        const data = await getMembers(organizationId);
        setMembers(data);
      } catch (error) {
        console.error('Erro ao carregar membros:', error);
      } finally {
        setLoadingMembers(false);
      }
    };
    
    if (open) {
      loadMembers();
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setAssignedTo('none');
      setDueDate('');
    }
  }, [open]);

  async function handleCreate() {
    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    try {
      setLoading(true);
      const taskData: any = {
        title: title.trim(),
        priority,
      };
      if (description.trim()) taskData.description = description.trim();
      if (assignedTo && assignedTo !== 'none') taskData.assignedToId = assignedTo;
      if (dueDate) taskData.dueDate = dueDate;

      await createTask(projectId, taskData);
      toast.success('Task criada com sucesso!');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao criar task:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar task');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input placeholder="Digite o título" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
          </div>
          
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea placeholder="Digite a descrição" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} disabled={loading} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={setPriority} disabled={loading}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Prazo</Label>
              <div className="relative">
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={loading} />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Responsável</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo} disabled={loading || loadingMembers}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Não atribuído</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>{member.name} ({member.email})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleCreate} disabled={loading || !title.trim()} className="w-full">
            {loading ? 'Criando...' : 'Criar tarefa'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}