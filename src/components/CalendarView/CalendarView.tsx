"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Box } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

import "./calendar-styles.css"
import { DayDetailModal } from "../DayDetailModal/DayDetailModal"

// Tipos locales para los eventos
interface CalendarEvent {
    id: string
    title: string
    date: Date
    time?: string
    type?: "todo" | "consult" | "review"
    patient?: string
    facility?: string
    assignee?: string
    description?: string
    startTime?: string
    endTime?: string
}

interface CalendarViewProps {
    events?: CalendarEvent[]
    onEventClick?: (event: CalendarEvent) => void
    onDateClick?: (date: Date) => void
    onEventDrop?: (event: CalendarEvent, newDate: Date) => void
    onTaskDrop?: (task: any, newDate: Date) => void
    onAddEvent?: (date: Date) => void
    onEditEvent?: (event: CalendarEvent) => void
    onDeleteEvent?: (eventId: string) => void
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
}))

export default function CalendarView({
    events = [],
    onEventClick,
    onDateClick,
    onEventDrop,
    onTaskDrop,
    onAddEvent,
    onEditEvent,
    onDeleteEvent,
}: CalendarViewProps) {
    const classes = useStyles()
    const calendarRef = useRef<FullCalendar>(null)

    // Estados para el modal
    const [openModal, setOpenModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([])

    // Ejemplo de eventos si no se proporcionan
    const [mockEvents, setMockEvents] = useState<CalendarEvent[]>([
        {
            id: "mock-1",
            title: "To Do example",
            date: new Date(2025, 1, 13), // 13 de febrero de 2025
            type: "todo",
            patient: "Juan Pérez",
            facility: "Hospital Central",
            assignee: "Dr. García",
            startTime: "09:00 AM",
            endTime: "10:00 AM",
        },
        {
            id: "mock-2",
            title: "To Do example",
            date: new Date(2025, 1, 13), // 13 de febrero de 2025
            type: "todo",
            patient: "María López",
            facility: "Clínica Norte",
            assignee: "Dr. Martínez",
            startTime: "11:30 AM",
            endTime: "12:30 PM",
        },
        {
            id: "mock-3",
            title: "To Do example",
            date: new Date(2025, 1, 13), // 13 de febrero de 2025
            type: "todo",
            patient: "Carlos Ruiz",
            facility: "Hospital Central",
            assignee: "Enfermera Ana",
            startTime: "02:00 PM",
            endTime: "03:00 PM",
        },
        {
            id: "mock-4",
            title: "To Do example",
            date: new Date(2025, 1, 14), // 14 de febrero de 2025
            type: "todo",
            patient: "Laura Gómez",
            facility: "Clínica Sur",
            assignee: "Dr. Rodríguez",
            startTime: "10:00 AM",
            endTime: "11:00 AM",
        },
        {
            id: "mock-5",
            title: "Followup Care",
            date: new Date(2025, 1, 18), // 18 de febrero de 2025
            type: "consult",
            patient: "Pedro Sánchez",
            facility: "Hospital Este",
            assignee: "Dra. Fernández",
            startTime: "09:30 AM",
            endTime: "10:30 AM",
        },
        {
            id: "mock-6",
            title: "Bi-Annual Med Review",
            date: new Date(2025, 1, 18), // 18 de febrero de 2025
            type: "review",
            patient: "Ana Martínez",
            facility: "Clínica Oeste",
            assignee: "Dr. López",
            startTime: "02:30 PM",
            endTime: "03:30 PM",
        },
        {
            id: "mock-7",
            title: "Followup ICT",
            date: new Date(2025, 1, 21), // 21 de febrero de 2025
            type: "consult",
            patient: "Roberto Díaz",
            facility: "Hospital Central",
            assignee: "Dr. González",
            startTime: "11:00 AM",
            endTime: "12:00 PM",
        },
    ])

    // Combinar eventos de props con mockEvents si es necesario
    const allEvents = events.length > 0 ? events : mockEvents

    // Efecto para actualizar los eventos seleccionados cuando cambia la fecha seleccionada
    useEffect(() => {
        if (selectedDate) {
            const eventsForDate = allEvents.filter((event) => {
                const eventDate = new Date(event.date)
                return (
                    eventDate.getFullYear() === selectedDate.getFullYear() &&
                    eventDate.getMonth() === selectedDate.getMonth() &&
                    eventDate.getDate() === selectedDate.getDate()
                )
            })
            setSelectedDateEvents(eventsForDate)
        }
    }, [selectedDate, allEvents])

    // Función para crear una fecha sin problemas de zona horaria
    const createDateWithoutTimezoneIssue = (dateStr: string): Date => {
        const [year, month, day] = dateStr.split("-").map(Number)
        return new Date(year, month - 1, day) // Mes es 0-indexado en JavaScript
    }

    // Convertir los eventos al formato de FullCalendar
    const getFullCalendarEvents = () => {
        return allEvents.map((event) => ({
            id: event.id,
            title: event.title,
            start: event.date,
            backgroundColor: getEventBackgroundColor(event.type),
            borderColor: getEventBorderColor(event.type),
            textColor: getEventTextColor(event.type),
            extendedProps: {
                ...event,
                type: event.type,
            },
        }))
    }

    // Funciones para obtener colores según el tipo de evento
    const getEventBackgroundColor = (type?: string): string => {
        switch (type) {
            case "todo":
                return "#b3e3e7" // Azul claro como en el Figma
            case "consult":
                return "#fee6c9" // Amarillo claro para Followup Care
            case "review":
                return "transparent" // Transparente para Bi-Annual Med Review
            default:
                return "#b3e3e7" // Default azul claro
        }
    }

    const getEventBorderColor = (type?: string): string => {
        switch (type) {
            case "todo":
                return "#05576f" // Borde azul oscuro
            case "consult":
                return "#f59a00" // Borde amarillo/naranja
            case "review":
                return "#015de7" // Borde azul para texto
            default:
                return "#05576f" // Default azul oscuro
        }
    }

    const getEventTextColor = (type?: string): string => {
        switch (type) {
            case "todo":
                return "#05576f" // Texto azul oscuro
            case "consult":
                return "#05576f" // Texto azul oscuro
            case "review":
                return "#015de7" // Texto azul
            default:
                return "#05576f" // Default azul oscuro
        }
    }

    // Manejar clic en fecha
    const handleDateClick = (info: any) => {
        const clickedDate = createDateWithoutTimezoneIssue(info.dateStr)
        setSelectedDate(clickedDate)
        setOpenModal(true)

        if (onDateClick) {
            onDateClick(clickedDate)
        }
    }

    // Manejar clic en evento
    const handleEventClick = (info: any) => {
        const eventId = info.event.id
        const event = allEvents.find((e) => e.id === eventId)

        if (event) {
            setSelectedDate(new Date(event.date))
            setOpenModal(true)

            if (onEventClick) {
                onEventClick(event)
            }
        }
    }

    // Manejar arrastre de evento
    const handleEventDrop = (info: any) => {
        const eventId = info.event.id
        const event = allEvents.find((e) => e.id === eventId)

        if (event && onEventDrop) {
            const newDate = info.event.start

            // Actualizar el evento en el estado local si estamos usando mockEvents
            if (events.length === 0) {
                setMockEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, date: newDate } : e)))
            }

            onEventDrop(event, newDate)
        }
    }

    // Manejar arrastre de tarea externa
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()

        try {
            const taskData = e.dataTransfer.getData("application/json")
            if (!taskData) return

            const task = JSON.parse(taskData)

            const element = document.elementFromPoint(e.clientX, e.clientY)
            if (!element) return

            const dateCell = element.closest(".fc-daygrid-day")
            if (!dateCell) return

            const dateStr = dateCell.getAttribute("data-date")
            if (!dateStr) return

            const dropDate = createDateWithoutTimezoneIssue(dateStr)

            // Crear un nuevo evento a partir de la tarea
            const newEvent: CalendarEvent = {
                id: `task-${Date.now()}`,
                title: task.title || "New Task",
                date: dropDate,
                type: task.type || "todo",
                patient: task.patient,
                facility: task.facility,
                assignee: task.assignee,
                description: task.description,
                startTime: task.startTime || "09:00 AM",
                endTime: task.endTime || "10:00 AM",
            }

            // Agregar el evento al estado local si estamos usando mockEvents
            if (events.length === 0) {
                setMockEvents((prev) => [...prev, newEvent])
            }

            if (onTaskDrop) {
                onTaskDrop(task, dropDate)
            }
        } catch (error) {
            console.error("Error handling drop:", error)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    // Manejar clic en "more" link
    const handleMoreLinkClick = (info: any) => {
        const clickedDate = info.date
        setSelectedDate(clickedDate)
        setOpenModal(true)
        return "popover"
    }

    // Manejar cierre del modal
    const handleCloseModal = () => {
        setOpenModal(false)
        setSelectedDate(null)
    }

    // Manejar agregar evento
    const handleAddEvent = (date: Date) => {
        if (onAddEvent) {
            onAddEvent(date)
        }
        setOpenModal(false)
    }

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
                    events={getFullCalendarEvents()}
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
                    eventClick={handleEventClick}
                    eventDrop={handleEventDrop}
                    moreLinkClick={handleMoreLinkClick}
                />
            </div>

            {/* Usar el nuevo DayDetailModal */}
            <DayDetailModal
                open={openModal}
                onClose={handleCloseModal}
                date={selectedDate}
                events={selectedDateEvents}
                onAddEvent={handleAddEvent}
            />
        </Box>
    )
}
