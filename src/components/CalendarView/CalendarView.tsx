"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Box, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Dialog, DialogContentText, Button } from "@evergreen/core"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

// Tipos locales para los eventos de mockup
interface Task {
  id: string
  title: string
  type: "todo" | "consult" | "review"
  patient?: string
  facility?: string
  assignee?: string
}

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    minHeight: "600px",
    position: "relative",
  },
  calendarContainer: {
    width: "100%",
    height: "100%",
    "& .fc": {
      fontFamily: "inherit",
    },
    "& .fc-event": {
      cursor: "pointer",
    },
  },
  eventItem: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    marginBottom: "8px",
    transition: "all 0.2s ease",
  },
}))

export default function CalendarView() {
  const classes = useStyles()
  const calendarRef = useRef<FullCalendar>(null)

  // Estados para el modal
  const [openModal, setOpenModal] = useState(false)
  const [selectedDateEvents, setSelectedDateEvents] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")

  // 🎯 EVENTOS DE MOCKUP - Fechas de MAYO 2025 para que los veas
  const [mockEvents, setMockEvents] = useState<{ [date: string]: Task[] }>({
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

  // Funciones para obtener colores según el tipo de tarea
  const getTaskBackgroundColor = (type: string): string => {
    switch (type) {
      case "todo":
        return "#e6f7f5"
      case "consult":
        return "#e0f2fe"
      case "review":
        return "#fee6c9"
      default:
        return "#f3f4f6"
    }
  }

  const getTaskBorderColor = (type: string): string => {
    switch (type) {
      case "todo":
        return "#0e766e"
      case "consult":
        return "#075985"
      case "review":
        return "#9a3412"
      default:
        return "#6b7280"
    }
  }

  const getTaskTextColor = (type: string): string => {
    switch (type) {
      case "todo":
        return "#0e766e"
      case "consult":
        return "#075985"
      case "review":
        return "#9a3412"
      default:
        return "#374151"
    }
  }

  // Convertir los eventos de mockup al formato de FullCalendar
  const getEvents = () => {
    return Object.entries(mockEvents).flatMap(([date, tasks]) =>
      tasks.map((task) => ({
        id: task.id,
        title: task.title,
        start: date,
        backgroundColor: getTaskBackgroundColor(task.type),
        borderColor: getTaskBorderColor(task.type),
        textColor: getTaskTextColor(task.type),
        extendedProps: {
          type: task.type,
          patient: task.patient,
          facility: task.facility,
          assignee: task.assignee,
        },
      })),
    )
  }

  // Formatear fecha para mostrar en el modal
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // 🎯 CALLBACK PARA CUANDO SE HACE CLICK EN UNA FECHA
  const handleDateClick = (info: any) => {
    console.log(`🎯 Clicked on date: ${info.dateStr}`)
    const events = mockEvents[info.dateStr] || []
    console.log(`📅 Found ${events.length} events for ${info.dateStr}:`, events)

    setSelectedDateEvents(events)
    setSelectedDate(info.dateStr)
    setOpenModal(true)
  }

  // 🎯 MANEJAR DROP NATIVO
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    try {
      const taskData = e.dataTransfer.getData("application/json")
      if (!taskData) return

      const task = JSON.parse(taskData)

      // Obtener la fecha del día donde se soltó
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const element = document.elementFromPoint(e.clientX, e.clientY)
      if (!element) return

      const dateCell = element.closest(".fc-daygrid-day")
      if (!dateCell) return

      const date = dateCell.getAttribute("data-date")
      if (!date) return

      console.log(`📦 Dropping task "${task.title}" on ${date}`)

      // Crear el nuevo evento
      const newEvent: Task = {
        id: task.id || `dragged-${Date.now()}-${Math.random()}`,
        title: task.title,
        type: task.type || "todo",
        patient: task.patient || "Paciente Arrastrado",
        facility: task.facility || "Facility desde Drag",
        assignee: task.assignee || "Asignado por Drag",
      }

      // Verificar que no existe ya este evento en esta fecha
      const existingEvents = mockEvents[date] || []
      const isDuplicate = existingEvents.some((event) => event.id === newEvent.id)

      if (!isDuplicate) {
        // Agregar el evento al estado
        setMockEvents((prev) => {
          const updated = {
            ...prev,
            [date]: [...(prev[date] || []), newEvent],
          }
          console.log(`✅ Updated events for ${date}:`, updated[date])
          return updated
        })

        console.log(`✅ Evento agregado exitosamente`)
      } else {
        console.log(`⚠️ Evento ya existe, no se duplicará`)
      }
    } catch (error) {
      console.error("Error handling drop:", error)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleMoreLinkClick = (info: any) => {
    const dateStr = info.date.toISOString().split("T")[0]
    const events = mockEvents[dateStr] || []
    setSelectedDateEvents(events)
    setSelectedDate(dateStr)
    setOpenModal(true)
    return "popover"
  }

  // Contenido del modal
  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "400px", overflowY: "auto" }}>
      {selectedDateEvents.length > 0 ? (
        selectedDateEvents.map((event, index) => (
          <div
            key={`${event.id}-${index}`}
            className={classes.eventItem}
            style={{
              backgroundColor: getTaskBackgroundColor(event.type),
              borderColor: getTaskBorderColor(event.type),
              color: getTaskTextColor(event.type),
            }}
          >
            <Typography variant="body1" style={{ fontWeight: "bold", marginBottom: "4px" }}>
              {event.title}
            </Typography>
            <Typography variant="caption" style={{ fontSize: "12px", opacity: 0.8, textTransform: "uppercase" }}>
              Tipo: {event.type}
            </Typography>
            {event.patient && (
              <Typography variant="caption" style={{ fontSize: "11px", marginTop: "4px", display: "block" }}>
                👤 Paciente: {event.patient}
              </Typography>
            )}
            {event.facility && (
              <Typography variant="caption" style={{ fontSize: "11px", display: "block" }}>
                🏥 Facility: {event.facility}
              </Typography>
            )}
            {event.assignee && (
              <Typography variant="caption" style={{ fontSize: "11px", display: "block" }}>
                👨‍⚕️ Asignado: {event.assignee}
              </Typography>
            )}
          </div>
        ))
      ) : (
        <DialogContentText>No hay eventos programados para {formatDate(selectedDate)}</DialogContentText>
      )}
    </div>
  )

  // Acciones del modal
  const actions = (
    <Button color="primary" label="Cerrar" onClick={() => setOpenModal(false)} size="small" variant="contained" />
  )

  // Header del modal
  const title = (
    <Typography variant="h4" style={{ color: "#333", fontWeight: "bold" }}>
      Eventos para {formatDate(selectedDate)}
      {selectedDateEvents.length > 0 && (
        <span
          style={{
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            marginLeft: "8px",
          }}
        >
          {selectedDateEvents.length}
        </span>
      )}
    </Typography>
  )

  return (
    <Box className={classes.root}>
      <div className={classes.calendarContainer} onDrop={handleDrop} onDragOver={handleDragOver}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek",
          }}
          events={getEvents()}
          editable={true}
          height="auto"
          fixedWeekCount={false}
          dayMaxEvents={3}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          dateClick={handleDateClick}
          moreLinkClick={handleMoreLinkClick}
        />
      </div>

      <Dialog
        actions={actions}
        content={content}
        data-testid="events-dialog"
        open={openModal}
        title={title}
        contentPadding="16px"
        contentDividers
      />
    </Box>
  )
}
