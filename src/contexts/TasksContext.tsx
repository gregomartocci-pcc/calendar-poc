"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export type TaskType = "todo" | "consult" | "review"

export interface Task {
  id: string
  title: string
  type: TaskType
  patient?: string
  facility?: string
  assignee?: string
  dueDate?: string
  scheduledDate?: string
}

interface TaskContextType {
  unscheduledTasks: Task[]
  scheduledTasks: Task[]
  removeTaskFromUnscheduled: (taskId: string) => void
  addTaskToUnscheduled: (task: Task) => void
  addTaskToScheduled: (task: Task) => void
  filterTasks: (type?: TaskType, assignee?: string, facility?: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [unscheduledTasks, setUnscheduledTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Med Review",
      type: "review",
      patient: "John Doe",
      facility: "Hospital Central",
      assignee: "Dr. Smith",
      dueDate: "2025-05-20",
    },
    {
      id: "task-2",
      title: "Consultation",
      type: "consult",
      patient: "Jane Smith",
      facility: "Clinic North",
      assignee: "Dr. Johnson",
      dueDate: "2025-05-22",
    },
  ])

  const [scheduledTasks, setScheduledTasks] = useState<Task[]>([])

  const removeTaskFromUnscheduled = (taskId: string) => {
    console.log(`🗑️ Context: Removing task with ID: ${taskId}`)
    console.log(
      `🗑️ Current unscheduled tasks:`,
      unscheduledTasks.map((t) => ({ id: t.id, title: t.title })),
    )

    setUnscheduledTasks((prev) => {
      const filtered = prev.filter((task) => task.id !== taskId)
      console.log(
        `🗑️ Tasks after filtering:`,
        filtered.map((t) => ({ id: t.id, title: t.title })),
      )
      return filtered
    })
  }

  const addTaskToUnscheduled = (task: Task) => {
    setUnscheduledTasks((prev) => [...prev, task])
  }

  const addTaskToScheduled = (task: Task) => {
    setScheduledTasks((prev) => [...prev, task])
  }

  const filterTasks = (type?: TaskType, assignee?: string, facility?: string) => {
    console.log(`Filtering tasks by type: ${type}, assignee: ${assignee}, facility: ${facility}`)
    // Aquí implementarías la lógica de filtrado real
  }

  return (
    <TaskContext.Provider
      value={{
        unscheduledTasks,
        scheduledTasks,
        removeTaskFromUnscheduled,
        addTaskToUnscheduled,
        addTaskToScheduled,
        filterTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}
