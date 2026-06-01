
'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash, GripVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
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
import { EditTaskDialog } from '@/components/tasks/edit-task-dialog';
import { deleteTask, Task } from '@/services/task.service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  projectId: string;
  onTaskUpdated: () => void;
}

export function TaskCard({ task, projectId, onTaskUpdated }: TaskCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteTask(projectId, task.id);
      toast.success('Task excluída com sucesso!');
      onTaskUpdated();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Erro ao excluir task:', error);
      toast.error('Erro ao excluir task');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      <div className={cn(
        "bg-white rounded-lg shadow-sm border p-3 group hover:shadow-md transition-shadow",
        task.status === 'DONE' && "opacity-75"
      )}>
        <div className="flex items-start gap-2">
          {/* Grip icon for drag */}
          <div className="cursor-grab active:cursor-grabbing mt-0.5" {...(document.querySelector('.task-drag-handle') as any)}>
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>

          {/* Task content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <p className={cn(
                "font-medium text-sm break-words",
                task.status === 'DONE' && "line-through text-gray-500"
              )}>
                {task.title}
              </p>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Pencil className="mr-2 h-3 w-3" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                    <Trash className="mr-2 h-3 w-3" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {task.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex justify-between items-center mt-2">
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded border font-medium",
                getPriorityColor(task.priority)
              )}>
                {task.priority}
              </span>
              
              {task.assignedTo && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                    {task.assignedTo.name.charAt(0)}
                  </span>
                  {task.assignedTo.name.split(' ')[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditTaskDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        projectId={projectId}
        taskId={task.id}
        task={task}
        onSuccess={onTaskUpdated}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A task será permanentemente excluída.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              {loading ? 'Excluindo...' : 'Sim, excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}