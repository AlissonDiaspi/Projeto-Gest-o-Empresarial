// components/kanban/kanban-column.tsx
import { Task } from '@/services/task.service';
import { TaskCard } from './task-card';

interface Props {
  title: string;
  tasks: Task[];
  projectId: string;  // Adicionar
  onTaskUpdated: () => void;  // Adicionar
}

export function KanbanColumn({
  title,
  tasks,
  projectId,  // Adicionar
  onTaskUpdated,  // Adicionar
}: Props) {
  return (
    <div className="flex-1 rounded-xl border bg-card p-4">
      <h2 className="mb-4 font-bold">
        {title}
      </h2>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            projectId={projectId}  // Passar para o TaskCard
            onTaskUpdated={onTaskUpdated}  // Passar para o TaskCard
          />
        ))}
      </div>
    </div>
  );
}