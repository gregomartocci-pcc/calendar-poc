"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type TaskType = "todo" | "consult" | "review"

export interface Task {
  id: string
  title: string
  type: TaskType
  patient?: string
  facility?: string
  assignee?: string
  dueDate?: string
  scheduledDate?: Date
  startTime?: string
  endTime?: string
  timezone?: string
  description?: string
}

interface TaskContextType {
  unscheduledTasks: Task[]
  scheduledTasks: Task[]
  filterTasks: (type?: TaskType, assignee?: string, facility?: string) => void
  addNewEvent: (task: Task) => void
  moveTaskToCalendar: (taskId: string, newDate: Date) => void
  moveEventToSidebar: (eventId: string) => void // Nueva función
  deleteEvent: (eventId: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

// Sample data
const sampleUnscheduledTasks: Task[] = [
  {
    id: "1",
    title: "Review Patient Chart",
    type: "review",
    patient: "John Doe",
    facility: "Watersprings Senior Living",
    assignee: "Dr. Smith",
    dueDate: "2024-06-15",
  },
  {
    id: "2",
    title: "Medication Consultation",
    type: "consult",
    patient: "Jane Smith",
    facility: "Oakview Care Center",
    assignee: "Nurse Johnson",
    dueDate: "2024-06-16",
  },
  {
    id: "3",
    title: "Follow-up Call",
    type: "todo",
    patient: "Bob Wilson",
    facility: "Pine Grove Assisted Living",
    assignee: "Me",
    dueDate: "2024-06-17",
  },
]

const sampleScheduledTasks: Task[] = [
  {
    id: "scheduled-1",
    title: "Morning Rounds",
    type: "todo",
    patient: "Multiple Patients",
    facility: "Watersprings Senior Living",
    assignee: "Dr. Smith",
    scheduledDate: new Date(2024, 5, 15), // June 15, 2024
    startTime: "09:00",
    endTime: "11:00",
  },
]

export function TaskProvider({ children }: { children: ReactNode }) {
  const [unscheduledTasks, setUnscheduledTasks] = useState<Task[]>(sampleUnscheduledTasks)
  const [scheduledTasks, setScheduledTasks] = useState<Task[]>(sampleScheduledTasks)

  const filterTasks = (type?: TaskType, assignee?: string, facility?: string) => {
    console.log("Filtering tasks:", { type, assignee, facility })
    // Implement filtering logic here
  }

  const addNewEvent = (task: Task) => {
    console.log("🎯 Context: Adding new event:", task)

    if (task.scheduledDate) {
      // Si tiene fecha programada, va a scheduledTasks
      setScheduledTasks((prev) => [...prev, task])
    } else {
      // Si no tiene fecha, va a unscheduledTasks
      setUnscheduledTasks((prev) => [...prev, task])
    }
  }

  // 🎯 NUEVA FUNCIÓN: Mover tarea al calendario
  const moveTaskToCalendar = (taskId: string, newDate: Date) => {
    console.log("🎯 Context: Moving task to calendar:", taskId, newDate)

    // Buscar la tarea en unscheduledTasks
    const unscheduledTask = unscheduledTasks.find((task) => task.id === taskId)

    if (unscheduledTask) {
      // Mover de unscheduled a scheduled
      const updatedTask = { ...unscheduledTask, scheduledDate: newDate }

      setUnscheduledTasks((prev) => prev.filter((task) => task.id !== taskId))
      setScheduledTasks((prev) => [...prev, updatedTask])

      console.log("✅ Context: Task moved from unscheduled to scheduled")
      return
    }

    // Buscar la tarea en scheduledTasks (para mover dentro del calendario)
    const scheduledTask = scheduledTasks.find((task) => task.id === taskId)

    if (scheduledTask) {
      // Actualizar la fecha en scheduledTasks
      setScheduledTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, scheduledDate: newDate } : task)))

      console.log("✅ Context: Task date updated in scheduled tasks")
    }
  }

  // 🎯 NUEVA FUNCIÓN: Mover evento del calendario al sidebar
  const moveEventToSidebar = (eventId: string) => {
    console.log("🎯 Context: Moving event back to sidebar:", eventId)

    // Buscar el evento en las tareas programadas
    const eventToMove = scheduledTasks.find((task) => task.id === eventId)

    if (eventToMove) {
      // Crear una copia sin la fecha programada
      const unscheduledTask = {
        ...eventToMove,
        scheduledDate: undefined,
        startTime: undefined,
        endTime: undefined,
        timezone: undefined,
      }

      // Remover de tareas programadas y agregar a no programadas
      setScheduledTasks((prev) => prev.filter((task) => task.id !== eventId))
      setUnscheduledTasks((prev) => [...prev, unscheduledTask])

      console.log("✅ Context: Event moved back to sidebar (unscheduled)")
    }
  }

  // 🎯 NUEVA FUNCIÓN: Eliminar un evento
  const deleteEvent = (eventId: string) => {
    console.log("🎯 Context: Deleting event:", eventId)

    // Eliminar de scheduledTasks
    setScheduledTasks((prev) => prev.filter((task) => task.id !== eventId))

    // También verificar en unscheduledTasks por si acaso
    setUnscheduledTasks((prev) => prev.filter((task) => task.id !== eventId))

    console.log("✅ Context: Event deleted")
  }

  const value: TaskContextType = {
    unscheduledTasks,
    scheduledTasks,
    filterTasks,
    addNewEvent,
    moveTaskToCalendar,
    moveEventToSidebar, // 🎯 NUEVA FUNCIÓN EXPORTADA
    deleteEvent,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}
