
'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task } from '@/services/task.service';
import { updateTaskStatus } from '@/services/task.service';
import { TaskCard } from './task-card';
import { toast } from 'sonner';

interface KanbanBoardProps {
  tasks: Task[];
  projectId: string;
  onTaskUpdate: () => void;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

const columnsConfig = {
  TODO: { title: 'A Fazer', color: 'bg-gray-50' },
  IN_PROGRESS: { title: 'Em Progresso', color: 'bg-blue-50' },
  DONE: { title: 'Concluído', color: 'bg-green-50' },
};

export function KanbanBoard({ tasks, projectId, onTaskUpdate }: KanbanBoardProps) { // board do kanban para as tasks 
  const [columns, setColumns] = useState<Record<string, Column>>({
    TODO: {
      id: 'TODO',
      title: 'A Fazer',
      taskIds: [],
    },
    IN_PROGRESS: {
      id: 'IN_PROGRESS',
      title: 'Em Progresso',
      taskIds: [],
    },
    DONE: {
      id: 'DONE',
      title: 'Concluído',
      taskIds: [],
    },
  });

  const [orderedColumns, setOrderedColumns] = useState(['TODO', 'IN_PROGRESS', 'DONE']);

  // Atualizar as tasks quando elas mudarem
  useEffect(() => {
    const newColumns = { ...columns };
    
    // Limpar taskIds de todas as colunas
    Object.keys(newColumns).forEach(columnId => {
      newColumns[columnId].taskIds = [];
    });

    // Distribuir tasks nas colunas
    tasks.forEach(task => {
      const status = task.status as keyof typeof columnsConfig;
      if (newColumns[status]) {
        newColumns[status].taskIds.push(task.id);
      }
    });

    setColumns(newColumns);
  }, [tasks]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Se não tiver destino ou for o mesmo lugar
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const task = tasks.find(t => t.id === draggableId);

    if (!task) return;

    // Se moveu para coluna diferente
    if (source.droppableId !== destination.droppableId) {
      // Atualizar UI imediatamente (otimista)
      const newSourceTaskIds = Array.from(sourceColumn.taskIds);
      newSourceTaskIds.splice(source.index, 1);
      
      const newDestTaskIds = Array.from(destColumn.taskIds);
      newDestTaskIds.splice(destination.index, 0, draggableId);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, taskIds: newSourceTaskIds },
        [destination.droppableId]: { ...destColumn, taskIds: newDestTaskIds },
      });

      // Atualizar no backend usando o endpoint correto
      try {
        await updateTaskStatus(projectId, draggableId, destination.droppableId);
        toast.success('Task movida com sucesso!');
        onTaskUpdate();
      } catch (error) {
        console.error('Erro ao mover task:', error);
        toast.error('Erro ao mover task. Recarregando...');
        onTaskUpdate(); // Recarregar para voltar ao estado correto
      }
    } else {
      // Moveu dentro da mesma coluna (reordenar)
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, taskIds: newTaskIds },
      });

      // TODO: Implementar endpoint de reordenação no backend se necessário
      // Por enquanto, apenas recarrega para persistir a ordem se o backend suportar
      // onTaskUpdate();
    }
  };

  // Função para obter tasks de uma coluna
  const getTasksForColumn = (columnId: string) => {
    const taskIds = columns[columnId]?.taskIds || [];
    return taskIds.map(id => tasks.find(t => t.id === id)).filter(Boolean) as Task[];
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orderedColumns.map(columnId => {
          const column = columns[columnId];
          const columnTasks = getTasksForColumn(columnId);
          const config = columnsConfig[columnId as keyof typeof columnsConfig];

          return (
            <div key={columnId} className={`${config.color} rounded-lg p-4`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">{config.title}</h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-sm font-medium shadow-sm">
                  {columnTasks.length}
                </span>
              </div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[500px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-white/50 rounded-lg' : ''
                    }`}
                  >
                    <div className="space-y-3">
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition-transform ${
                                snapshot.isDragging ? 'rotate-1 scale-105' : ''
                              }`}
                            >
                              <TaskCard
                                task={task}
                                projectId={projectId}
                                onTaskUpdated={onTaskUpdate}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}