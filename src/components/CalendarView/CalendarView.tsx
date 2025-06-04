"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Box } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import FullCalendar from "@fullcalendar/react"
import interactionPlugin from "@fullcalendar/interaction"
import dayGridPlugin from "@fullcalendar/daygrid"
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
    onEventDragToSidebar?: (event: CalendarEvent) => void
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
            cursor: "grab",
        },
        "& .fc-event:active": {
            cursor: "grabbing",
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
    onEventDragToSidebar,
}: CalendarViewProps) {
    const classes = useStyles()
    const calendarRef = useRef<FullCalendar>(null)

    // Estados para el modal
    const [openModal, setOpenModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([])
    const [isDraggingEvent, setIsDraggingEvent] = useState<CalendarEvent | null>(null)

    // Ejemplo de eventos si no se proporcionan
    const [mockEvents, setMockEvents] = useState<CalendarEvent[]>([
        {
            id: "mock-1",
            title: "To Do example",
            date: new Date(2025, 1, 13),
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
            date: new Date(2025, 1, 13),
            type: "todo",
            patient: "María López",
            facility: "Clínica Norte",
            assignee: "Dr. Martínez",
            startTime: "11:30 AM",
            endTime: "12:30 PM",
        },
        {
            id: "mock-3",
            title: "Followup Care",
            date: new Date(2025, 1, 18),
            type: "consult",
            patient: "Pedro Sánchez",
            facility: "Hospital Este",
            assignee: "Dra. Fernández",
            startTime: "09:30 AM",
            endTime: "10:30 AM",
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
        return new Date(year, month - 1, day)
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
                return "#b3e3e7"
            case "consult":
                return "#fee6c9"
            case "review":
                return "transparent"
            default:
                return "#b3e3e7"
        }
    }

    const getEventBorderColor = (type?: string): string => {
        switch (type) {
            case "todo":
                return "#05576f"
            case "consult":
                return "#f59a00"
            case "review":
                return "#015de7"
            default:
                return "#05576f"
        }
    }

    const getEventTextColor = (type?: string): string => {
        switch (type) {
            case "todo":
                return "#05576f"
            case "consult":
                return "#05576f"
            case "review":
                return "#015de7"
            default:
                return "#05576f"
        }
    }

    // 🎯 NUEVA FUNCIÓN: Manejar cuando un evento se arrastra fuera del calendario
    const handleEventDragStart = (info: any) => {
        console.log("🎯 Event drag started:", info.event.title)

        // Guardar el evento que se está arrastrando
        const eventId = info.event.id
        const event = allEvents.find((e) => e.id === eventId)
        if (event) {
            setIsDraggingEvent(event)
        }

        // Agregar datos del evento al dataTransfer para que el sidebar pueda recibirlo
        const eventData = {
            id: info.event.id,
            title: info.event.title,
            type: info.event.extendedProps.type,
            patient: info.event.extendedProps.patient,
            facility: info.event.extendedProps.facility,
            assignee: info.event.extendedProps.assignee,
            description: info.event.extendedProps.description,
            startTime: info.event.extendedProps.startTime,
            endTime: info.event.extendedProps.endTime,
            fromCalendar: true,
        }

        // Configurar el drag
        if (info.jsEvent.dataTransfer) {
            info.jsEvent.dataTransfer.setData("application/json", JSON.stringify(eventData))
            info.jsEvent.dataTransfer.effectAllowed = "move"
        }
    }

    // 🎯 SIMPLIFICAR: Detectar cuando un evento se arrastra fuera del calendario
    const handleEventDragStop = (info: any) => {
        console.log("🎯 Event drag stopped:", info.event.title)

        // 🛠️ SOLUCIÓN: Usar try/catch y verificar que todo existe antes de acceder
        try {
            if (!calendarRef.current) {
                console.log("🎯 Calendar ref not available")
                setIsDraggingEvent(null)
                return
            }

            // 🛠️ MÉTODO ALTERNATIVO: Usar querySelector en lugar de acceder a elRef
            const calendarElement = document.querySelector(".fc")
            if (!calendarElement) {
                console.log("🎯 Calendar element not found")
                setIsDraggingEvent(null)
                return
            }

            const rect = calendarElement.getBoundingClientRect()
            const x = info.jsEvent.clientX
            const y = info.jsEvent.clientY

            // Si el mouse está fuera del área del calendario
            const isOutsideCalendar = x < rect.left || x > rect.right || y < rect.top || y > rect.bottom

            if (isOutsideCalendar && isDraggingEvent && onEventDragToSidebar) {
                console.log("🎯 Event dragged outside calendar area!")
                onEventDragToSidebar(isDraggingEvent)
            }
        } catch (error) {
            console.error("🚨 Error in handleEventDragStop:", error)
        } finally {
            // Siempre limpiar el estado
            setIsDraggingEvent(null)
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

    // Manejar arrastre de evento dentro del calendario
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

            // 🎯 Si viene del calendario, no hacer nada aquí
            if (task.fromCalendar) {
                console.log("🎯 Ignoring calendar event drop on calendar")
                return
            }

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

    // 🛠️ MEJORAR: Manejador global más robusto
    useEffect(() => {
        const handleGlobalMouseUp = (e: MouseEvent) => {
            if (isDraggingEvent && onEventDragToSidebar) {
                // Verificar si el mouse está sobre el sidebar
                const sidebarElement = document.querySelector('[data-sidebar="true"]')
                if (sidebarElement) {
                    const rect = sidebarElement.getBoundingClientRect()
                    const isOverSidebar =
                        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom

                    if (isOverSidebar) {
                        console.log("🎯 Event dropped on sidebar via global handler")
                        onEventDragToSidebar(isDraggingEvent)
                    }
                }
                setIsDraggingEvent(null)
            }
        }

        document.addEventListener("mouseup", handleGlobalMouseUp)
        return () => {
            document.removeEventListener("mouseup", handleGlobalMouseUp)
        }
    }, [isDraggingEvent, onEventDragToSidebar])

    return (
        <Box className={classes.root}>
            <div className={classes.calendarContainer} onDrop={handleDrop} onDragOver={handleDragOver}>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[interactionPlugin, dayGridPlugin]}
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
                    eventDragStart={handleEventDragStart}
                    eventDragStop={handleEventDragStop}
                    moreLinkClick={handleMoreLinkClick}
                />
            </div>

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
