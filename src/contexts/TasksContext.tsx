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
  startTime?: string
  endTime?: string
  timezone?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

interface CalendarEvents {
  [date: string]: Task[]
}

interface TaskContextType {
  unscheduledTasks: Task[]
  scheduledTasks: Task[]
  calendarEvents: CalendarEvents
  removeTaskFromUnscheduled: (taskId: string) => void
  addTaskToUnscheduled: (task: Task) => void
  addTaskToScheduled: (task: Task) => void
  addNewEvent: (task: Task) => void
  addEventToCalendar: (task: Task, date: string) => void
  filterTasks: (type?: TaskType, assignee?: string, facility?: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [unscheduledTasks, setUnscheduledTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Medical Review",
      type: "review",
      patient: "John Doe",
      facility: "Watersprings Senior Living",
      assignee: "Dr. Smith",
      dueDate: "2025-05-20",
      startTime: "14:00",
      endTime: "15:00",
      timezone: "America/New_York",
      description: "Quarterly medical review for patient",
      createdAt: "2025-01-03T10:00:00Z",
    },
    {
      id: "task-2",
      title: "Patient Consultation",
      type: "consult",
      patient: "Jane Smith",
      facility: "Oakview Care Center",
      assignee: "Dr. Johnson",
      dueDate: "2025-05-22",
      startTime: "09:30",
      endTime: "10:30",
      timezone: "America/New_York",
      description: "Initial consultation for new patient",
      createdAt: "2025-01-03T11:00:00Z",
    },
  ])

  const [scheduledTasks, setScheduledTasks] = useState<Task[]>([])

  // 🎯 CALENDAR EVENTS WITH COMPLETE DATA IN ENGLISH
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvents>({
    "2025-05-01": [
      {
        id: "mock-1",
        title: "Team Meeting",
        type: "todo",
        patient: "Juan Pérez",
        facility: "Watersprings Senior Living",
        assignee: "Dr. García",
        startTime: "10:00",
        endTime: "11:00",
        timezone: "America/New_York",
        description: "Weekly team coordination meeting",
        createdAt: "2025-01-01T08:00:00Z",
      },
      {
        id: "mock-2",
        title: "Medical Consultation",
        type: "consult",
        patient: "María López",
        facility: "Oakview Care Center",
        assignee: "Dr. Martínez",
        startTime: "14:30",
        endTime: "15:30",
        timezone: "America/New_York",
        description: "Follow-up consultation for chronic condition",
        createdAt: "2025-01-01T09:00:00Z",
      },
    ],
    "2025-05-05": [
      {
        id: "mock-3",
        title: "File Review",
        type: "review",
        patient: "Carlos Ruiz",
        facility: "Pine Grove Assisted Living",
        assignee: "Nurse Ana",
        startTime: "16:00",
        endTime: "17:00",
        timezone: "America/New_York",
        description: "Review patient medical records and update care plan",
        createdAt: "2025-01-02T10:00:00Z",
      },
    ],
  })

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

  // 🎯 FUNCTION TO ADD EVENT TO CALENDAR
  const addEventToCalendar = (task: Task, date: string) => {
    console.log(`📅 Context: Adding event to calendar on ${date}:`, task)

    setCalendarEvents((prev) => {
      const updated = {
        ...prev,
        [date]: [...(prev[date] || []), task],
      }
      console.log(`✅ Context: Updated calendar events for ${date}:`, updated[date])
      return updated
    })
  }

  // 🎯 FUNCTION TO ADD NEW EVENTS
  const addNewEvent = (task: Task) => {
    console.log(`📅 Context: Adding new event:`, task)

    // If it has a scheduled date, add it to the calendar
    if (task.scheduledDate) {
      addEventToCalendar(task, task.scheduledDate)
      setScheduledTasks((prev) => [...prev, task])
      console.log(`✅ Context: Event added to scheduled tasks and calendar`)
    } else {
      // If no date, goes to unscheduled
      setUnscheduledTasks((prev) => [...prev, task])
      console.log(`✅ Context: Event added to unscheduled tasks`)
    }
  }

  const filterTasks = (type?: TaskType, assignee?: string, facility?: string) => {
    console.log(`Filtering tasks by type: ${type}, assignee: ${assignee}, facility: ${facility}`)
    // Here you would implement the actual filtering logic
  }

  return (
    <TaskContext.Provider
      value={{
        unscheduledTasks,
        scheduledTasks,
        calendarEvents,
        removeTaskFromUnscheduled,
        addTaskToUnscheduled,
        addTaskToScheduled,
        addNewEvent,
        addEventToCalendar,
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
