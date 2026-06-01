
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
import { updateTaskStatus } from '@/services/task.service';
import { getMembers, Member } from '@/services/member.service';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

export function EditTaskDialog({ open, onOpenChange, projectId, taskId, task, onSuccess }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
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
      } catch (error) { console.error(error); }
      finally { setLoadingMembers(false); }
    };
    if (open) loadMembers();
  }, [open]);

  useEffect(() => {
    if (task && open) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'MEDIUM');
      setStatus(task.status || 'TODO');
      setAssignedTo(task.assignedTo?.id || 'none');
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    }
  }, [task, open]);

  async function handleUpdate() {
    if (!title.trim()) { toast.error('Título é obrigatório'); return; }
    try {
      setLoading(true);
      
      // 1. Atualizar status se mudou
      if (status !== task.status) {
        await updateTaskStatus(projectId, taskId, status);
        toast.success('Status atualizado!');
      }
      
      // 2. Atualizar data de vencimento se mudou
      const newDueDate = dueDate || null;
      const oldDueDate = task.dueDate ? task.dueDate.split('T')[0] : null;
      if (newDueDate !== oldDueDate) {
        if (newDueDate) {
          await api.patch(`/projects/${projectId}/tasks/${taskId}/due-date`, {
            dueDate: newDueDate
          });
          toast.success('Prazo atualizado!');
        }
      }
      
      // 3. Atualizar responsável se mudou
      const newAssignee = assignedTo !== 'none' ? assignedTo : null;
      const oldAssignee = task.assignedTo?.id || null;
      if (newAssignee !== oldAssignee) {
        await api.patch(`/projects/${projectId}/tasks/${taskId}/assign`, {
          assignedToId: newAssignee || ''
        });
        toast.success('Responsável atualizado!');
      }
      
      // Nota: Título, descrição e prioridade não têm endpoints específicos
      // Se precisar atualizá-los, será necessário criar endpoints no backend
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao atualizar task:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar task');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>Editar Task</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
            <p className="text-xs text-muted-foreground">* Título não pode ser alterado (endpoint não disponível)</p>
          </div>
          
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} disabled={loading} />
            <p className="text-xs text-muted-foreground">* Descrição não pode ser alterada (endpoint não disponível)</p>
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
              <p className="text-xs text-muted-foreground">* Prioridade não pode ser alterada</p>
            </div>
            
            <div className="space-y-2">
              <Label>Prazo</Label>
              <div className="relative">
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={loading} />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus} disabled={loading}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">A Fazer</SelectItem>
                <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                <SelectItem value="DONE">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Responsável</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo} disabled={loading || loadingMembers}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Não atribuído</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}