"use client"

import { useState, useCallback } from "react"
import { useTaskContext, type Task } from "../contexts/TasksContext"

interface CalendarEvent {
  [date: string]: Task[]
}

export function useCalendarEvents() {
  const { scheduledTasks, addNewEvent } = useTaskContext()

  // 🎯 EVENTOS DE MOCKUP - Fechas de MAYO 2025 para que los veas
  const [mockEvents, setMockEvents] = useState<CalendarEvent>({
    "2025-05-01": [
      {
        id: "mock-1",
        title: "Reunión de Equipo",
        type: "todo",
        patient: "Juan Pérez",
        facility: "Hospital Central",
        assignee: "Dr. García",
      },
      {
        id: "mock-2",
        title: "Consulta Médica",
        type: "consult",
        patient: "María López",
        facility: "Clínica Norte",
        assignee: "Dr. Martínez",
      },
    ],
    "2025-05-05": [
      {
        id: "mock-3",
        title: "Revisión de Expediente",
        type: "review",
        patient: "Carlos Ruiz",
        facility: "Hospital Central",
        assignee: "Enfermera Ana",
      },
    ],
  })

  // 🎯 FUNCIÓN PARA AGREGAR EVENTO AL CALENDARIO
  const addEventToCalendar = useCallback((task: Task, date: string) => {
    console.log(`📅 Adding event to calendar on ${date}:`, task)

    setMockEvents((prev) => {
      const updated = {
        ...prev,
        [date]: [...(prev[date] || []), task],
      }
      console.log(`✅ Updated calendar events for ${date}:`, updated[date])
      return updated
    })
  }, [])

  // 🎯 FUNCIÓN PARA CREAR NUEVO EVENTO
  const createNewEvent = useCallback(
    (eventData: any) => {
      const newTask: Task = {
        id: `event-${Date.now()}-${Math.random()}`,
        title: eventData.title,
        type: eventData.type,
        patient: eventData.patient,
        facility: eventData.facility,
        assignee: eventData.assignee,
        scheduledDate: eventData.date,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        timezone: eventData.timezone,
        description: eventData.description,
      }

      console.log(`🎯 Creating new event:`, newTask)

      // Agregar al contexto
      addNewEvent(newTask)

      // Si tiene fecha, agregarlo al calendario
      if (eventData.date) {
        addEventToCalendar(newTask, eventData.date)
      }

      return newTask
    },
    [addNewEvent, addEventToCalendar],
  )

  // 🎯 FUNCIÓN PARA MOVER EVENTO DESDE SIDEBAR
  const moveEventToCalendar = useCallback(
    (task: Task, date: string) => {
      // Verificar que no existe ya este evento en esta fecha
      const existingEvents = mockEvents[date] || []
      const isDuplicate = existingEvents.some((event) => event.id === task.id)

      if (!isDuplicate) {
        addEventToCalendar(task, date)
        return true
      } else {
        console.log(`⚠️ Evento ya existe, no se duplicará`)
        return false
      }
    },
    [mockEvents, addEventToCalendar],
  )

  return {
    mockEvents,
    setMockEvents,
    createNewEvent,
    moveEventToCalendar,
    addEventToCalendar,
  }
}
