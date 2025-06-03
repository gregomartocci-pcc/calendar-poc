"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Box, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Dialog, DialogContentText, Button } from "@evergreen/core"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useTaskContext, type Task } from "../../contexts/TasksContext"

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
    const { removeTaskFromUnscheduled, calendarEvents, addEventToCalendar } = useTaskContext()

    // Estados para el modal
    const [openModal, setOpenModal] = useState(false)
    const [selectedDateEvents, setSelectedDateEvents] = useState<Task[]>([])
    const [selectedDate, setSelectedDate] = useState<string>("")

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

    // 🎯 USAR EVENTOS DEL CONTEXTO
    const getEvents = () => {
        console.log("🔍 Getting events from context:", calendarEvents)
        return Object.entries(calendarEvents).flatMap(([date, tasks]) =>
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
                    startTime: task.startTime,
                    endTime: task.endTime,
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
        const events = calendarEvents[info.dateStr] || []
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
            console.log("🔍 Task data received:", task)

            // Obtener la fecha del día donde se soltó
            const element = document.elementFromPoint(e.clientX, e.clientY)
            if (!element) return

            const dateCell = element.closest(".fc-daygrid-day")
            if (!dateCell) return

            const date = dateCell.getAttribute("data-date")
            if (!date) return

            console.log(`📦 Dropping task "${task.title}" on ${date}`)

            // Verificar que no existe ya este evento en esta fecha
            const existingEvents = calendarEvents[date] || []
            const isDuplicate = existingEvents.some((event) => event.id === task.id)

            if (!isDuplicate) {
                // 🎯 USAR FUNCIÓN DEL CONTEXTO
                addEventToCalendar(task, date)

                // 🎯 REMOVER LA TAREA DEL SIDEBAR
                if (removeTaskFromUnscheduled && task.id) {
                    console.log(`🗑️ Attempting to remove task with ID: ${task.id}`)
                    removeTaskFromUnscheduled(task.id)
                    console.log(`🗑️ Remove function called for task ${task.id}`)
                }
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
        const events = calendarEvents[dateStr] || []
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
                        {event.startTime && event.endTime && (
                            <Typography variant="caption" style={{ fontSize: "11px", display: "block" }}>
                                🕐 Horario: {event.startTime} - {event.endTime}
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
                {/* 🎯 COMPONENTE REACT DE FULLCALENDAR */}
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
