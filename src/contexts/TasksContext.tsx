import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos
export type TaskType = 'todo' | 'consult' | 'review';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  date?: string;
  dueDate?: string;
  facility?: string;
  assignee?: string;
  patient?: string;
}

type ScheduledTasksMap = Record<string, Task[]>;

interface TaskContextType {
  unscheduledTasks: Task[];
  scheduledTasks: ScheduledTasksMap;
  scheduleTask: (taskId: string, date: string) => void;
  unscheduleTask: (taskId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  // Tareas no programadas
  const [unscheduledTasks, setUnscheduledTasks] = useState<Task[]>([
    {
      id: 'task-1',
      title: 'Med Review',
      type: 'review',
      dueDate: '04/30/2025',
      facility: 'Watersprings Senior Living',
      assignee: 'Practitioner',
      patient: 'Daniel Cook',
    },
  ]);

  // Tareas programadas por fecha
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTasksMap>({
    '2025-04-01': [
      { id: 'scheduled-1', title: 'To Do example', type: 'todo', date: '2025-04-01' },
      { id: 'scheduled-2', title: 'To Do example', type: 'todo', date: '2025-04-01' },
    ],
    '2025-04-03': [
      { id: 'scheduled-6', title: 'PHQ2-9 Consult', type: 'consult', date: '2025-04-03' },
    ],
  });

  // Programar una tarea
  const scheduleTask = (taskId: string, date: string) => {
    const task = unscheduledTasks.find((t) => t.id === taskId);
    if (!task) return;

    // Añadir la tarea a las tareas programadas
    setScheduledTasks((prev) => {
      const newScheduledTasks = { ...prev };
      if (!newScheduledTasks[date]) {
        newScheduledTasks[date] = [];
      }
      newScheduledTasks[date] = [...newScheduledTasks[date], { ...task, date }];
      return newScheduledTasks;
    });

    // Eliminar la tarea de las tareas no programadas
    setUnscheduledTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Desprogramar una tarea
  const unscheduleTask = (taskId: string) => {
    // Buscar la tarea en las tareas programadas
    let taskToUnschedule: Task | undefined;
    let dateToRemoveFrom: string | undefined;

    Object.entries(scheduledTasks).forEach(([date, tasks]) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        taskToUnschedule = task;
        dateToRemoveFrom = date;
      }
    });

    if (!taskToUnschedule || !dateToRemoveFrom) return;

    // Eliminar la tarea de las tareas programadas
    setScheduledTasks((prev) => {
      const newScheduledTasks = { ...prev };
      newScheduledTasks[dateToRemoveFrom!] = newScheduledTasks[dateToRemoveFrom!].filter((t) => t.id !== taskId);
      return newScheduledTasks;
    });

    // Añadir la tarea a las tareas no programadas
    setUnscheduledTasks((prev) => [...prev, { ...taskToUnschedule!, date: undefined }]);
  };

  return (
    <TaskContext.Provider value={{ unscheduledTasks, scheduledTasks, scheduleTask, unscheduleTask }}>
      {children}
    </TaskContext.Provider>
  );
}