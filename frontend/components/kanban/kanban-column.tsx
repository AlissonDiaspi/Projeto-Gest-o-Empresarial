
import { Task } from '@/services/task.service';
import { TaskCard } from './task-card';

interface Props {
  title: string;
  tasks: Task[];
  projectId: string;  
  onTaskUpdated: () => void;  
}

export function KanbanColumn({
  title,
  tasks,
  projectId,  
  onTaskUpdated, 
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
            projectId={projectId}  
            onTaskUpdated={onTaskUpdated}  
          />
        ))}
      </div>
    </div>
  );
}