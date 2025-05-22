"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Tipos
export type TaskType = "todo" | "consult" | "review"

export interface Task {
  id: string
  title: string
  type: TaskType
  date?: string
  dueDate?: string
  facility?: string
  assignee?: string
  patient?: string
}

type ScheduledTasksMap = Record<string, Task[]>

interface TaskContextType {
  unscheduledTasks: Task[]
  scheduledTasks: ScheduledTasksMap
  scheduleTask: (taskId: string, date: string) => void
  unscheduleTask: (taskId: string) => void
  filterTasks?: (type?: TaskType, assignee?: string, facility?: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}

interface TaskProviderProps {
  children: ReactNode
}

export function TaskProvider({ children }: TaskProviderProps) {
  // Tareas no programadas
  const [unscheduledTasks, setUnscheduledTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Med Review",
      type: "review",
      dueDate: "04/30/2025",
      facility: "Watersprings Senior Living",
      assignee: "Practitioner",
      patient: "Daniel Cook",
    },
  ])

  // Tareas programadas por fecha
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTasksMap>({
    "2025-04-01": [
      { id: "scheduled-1", title: "To Do example", type: "todo", date: "2025-04-01" },
      { id: "scheduled-2", title: "To Do example", type: "todo", date: "2025-04-01" },
      { id: "scheduled-3", title: "To Do example", type: "todo", date: "2025-04-01" },
      { id: "scheduled-4", title: "To Do example", type: "todo", date: "2025-04-01" },
    ],
    "2025-04-02": [{ id: "scheduled-5", title: "To Do example", type: "todo", date: "2025-04-02" }],
    "2025-04-03": [{ id: "scheduled-6", title: "PHQ2-9 Consult", type: "consult", date: "2025-04-03" }],
  })

  // Usar un Set para rastrear las operaciones en progreso
  const [operationsInProgress, setOperationsInProgress] = useState<Set<string>>(new Set())

  // Programar una tarea con protección contra duplicación
  const scheduleTask = useCallback(
    (taskId: string, date: string) => {
      const operationKey = `${taskId}-${date}`

      console.log(`Attempting to schedule task ${taskId} for date ${date}`)

      // Verificar si esta operación ya está en progreso
      if (operationsInProgress.has(operationKey)) {
        console.log(`Operation ${operationKey} already in progress, skipping`)
        return
      }

      // Marcar la operación como en progreso
      setOperationsInProgress((prev) => new Set(prev).add(operationKey))

      // Usar setTimeout para asegurar que la operación se ejecute de forma asíncrona
      setTimeout(() => {
        setUnscheduledTasks((currentUnscheduled) => {
          const task = currentUnscheduled.find((t) => t.id === taskId)
          if (!task) {
            console.log(`Task ${taskId} not found in unscheduled tasks`)
            // Limpiar la operación
            setOperationsInProgress((prev) => {
              const newSet = new Set(prev)
              newSet.delete(operationKey)
              return newSet
            })
            return currentUnscheduled
          }

          // Verificar si la tarea ya está programada para esta fecha
          setScheduledTasks((currentScheduled) => {
            const isAlreadyScheduled = currentScheduled[date]?.some((t) => t.id === taskId)
            if (isAlreadyScheduled) {
              console.log(`Task ${taskId} is already scheduled for ${date}`)
              // Limpiar la operación
              setOperationsInProgress((prev) => {
                const newSet = new Set(prev)
                newSet.delete(operationKey)
                return newSet
              })
              return currentScheduled
            }

            // Añadir la tarea a las tareas programadas
            const newScheduledTasks = { ...currentScheduled }
            if (!newScheduledTasks[date]) {
              newScheduledTasks[date] = []
            }
            newScheduledTasks[date] = [...newScheduledTasks[date], { ...task, date }]

            console.log(`Task ${taskId} successfully scheduled for ${date}`)

            // Limpiar la operación
            setOperationsInProgress((prev) => {
              const newSet = new Set(prev)
              newSet.delete(operationKey)
              return newSet
            })

            return newScheduledTasks
          })

          // Eliminar la tarea de las tareas no programadas
          return currentUnscheduled.filter((t) => t.id !== taskId)
        })
      }, 0)
    },
    [operationsInProgress],
  )

  // Desprogramar una tarea
  const unscheduleTask = useCallback(
    (taskId: string) => {
      // Buscar la tarea en las tareas programadas
      let taskToUnschedule: Task | undefined
      let dateToRemoveFrom: string | undefined

      Object.entries(scheduledTasks).forEach(([date, tasks]) => {
        const task = tasks.find((t) => t.id === taskId)
        if (task) {
          taskToUnschedule = task
          dateToRemoveFrom = date
        }
      })

      if (!taskToUnschedule || !dateToRemoveFrom) return

      // Eliminar la tarea de las tareas programadas
      setScheduledTasks((prev) => {
        const newScheduledTasks = { ...prev }
        newScheduledTasks[dateToRemoveFrom!] = newScheduledTasks[dateToRemoveFrom!].filter((t) => t.id !== taskId)
        return newScheduledTasks
      })

      // Añadir la tarea a las tareas no programadas
      setUnscheduledTasks((prev) => [...prev, { ...taskToUnschedule!, date: undefined }])
    },
    [scheduledTasks],
  )

  // Implementación de filterTasks
  const filterTasks = useCallback((type?: TaskType, assignee?: string, facility?: string) => {
    console.log(`Filtering tasks by type: ${type}, assignee: ${assignee}, facility: ${facility}`)
    // Aquí implementarías la lógica de filtrado real
  }, [])

  return (
    <TaskContext.Provider value={{ unscheduledTasks, scheduledTasks, scheduleTask, unscheduleTask, filterTasks }}>
      {children}
    </TaskContext.Provider>
  )
}
