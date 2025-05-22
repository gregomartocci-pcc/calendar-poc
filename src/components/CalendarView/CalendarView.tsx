"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Box } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import "./calendar-styles.css"
import { useTaskContext } from "../../contexts/TasksContext"

// Definir interfaces para los eventos de FullCalendar
interface DropInfo {
    draggedEl: HTMLElement
    date: Date
    dateStr: string
    allDay: boolean
    jsEvent: MouseEvent
    view: any
    resource?: any
}

interface EventReceiveInfo {
    draggedEl: HTMLElement
    event: {
        id: string
        title: string
        start: Date
        startStr: string
        end: Date | null
        endStr: string | null
        allDay: boolean
    }
    relatedEvents: any[]
    view: any
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
    },
}))

export function CalendarView() {
    const classes = useStyles()
    const { scheduledTasks, scheduleTask } = useTaskContext()
    const calendarRef = useRef<HTMLDivElement>(null)
    const calendarInstanceRef = useRef<any>(null)

    // Convertir las tareas programadas al formato de eventos de FullCalendar
    const getEvents = () => {
        return Object.entries(scheduledTasks).flatMap(([date, tasks]) =>
            tasks.map((task) => ({
                id: task.id,
                title: task.title,
                start: date,
                backgroundColor: getTaskBackgroundColor(task.type),
                borderColor: getTaskTextColor(task.type),
                textColor: getTaskTextColor(task.type),
                extendedProps: {
                    type: task.type,
                },
            })),
        )
    }

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

    // Inicializar el calendario
    useEffect(() => {
        const initializeCalendar = () => {
            console.log("Initializing calendar, FullCalendar available:", !!window.FullCalendar)

            if (window.FullCalendar && calendarRef.current) {
                // Destruir la instancia anterior si existe
                if (calendarInstanceRef.current) {
                    calendarInstanceRef.current.destroy()
                }

                try {
                    // Crear una nueva instancia de Calendar
                    // @ts-ignore - Ignoramos el error de TypeScript aquí
                    const Calendar = window.FullCalendar.Calendar
                    const calendarEl = calendarRef.current

                    const calendar = new Calendar(calendarEl, {
                        initialView: "dayGridMonth",
                        headerToolbar: {
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,dayGridWeek",
                        },
                        events: getEvents(),
                        droppable: true,
                        editable: true,
                        height: "auto",
                        fixedWeekCount: false,
                        dayMaxEvents: 3,
                        eventTimeFormat: {
                            hour: "numeric",
                            minute: "2-digit",
                            meridiem: "short",
                        },
                        drop: (info: DropInfo) => {
                            console.log("Drop event:", info)
                            // Obtener el ID de la tarea desde el elemento arrastrado
                            const taskId = info.draggedEl.getAttribute("data-task-id")
                            if (taskId) {
                                // Programar la tarea en la fecha donde se soltó
                                scheduleTask(taskId, info.dateStr)
                            }
                        },
                        eventReceive: (info: EventReceiveInfo) => {
                            console.log("Event received:", info)
                            // Este evento se dispara cuando un evento externo es arrastrado al calendario
                            const taskId = info.draggedEl.getAttribute("data-task-id")
                            if (taskId) {
                                scheduleTask(taskId, info.event.startStr)
                            }
                        },
                    })

                    calendar.render()
                    calendarInstanceRef.current = calendar
                    console.log("Calendar initialized successfully")
                } catch (error) {
                    console.error("Error initializing calendar:", error)
                }
            } else {
                // Si FullCalendar no está disponible, intentar de nuevo después de un tiempo
                console.log("FullCalendar not available yet, retrying...")
                setTimeout(initializeCalendar, 1000)
            }
        }

        // Iniciar la inicialización después de un breve retraso
        setTimeout(initializeCalendar, 500)

        // Limpiar al desmontar
        return () => {
            if (calendarInstanceRef.current) {
                calendarInstanceRef.current.destroy()
            }
        }
    }, []) // Solo se ejecuta una vez al montar

    // Actualizar los eventos cuando cambien las tareas programadas
    useEffect(() => {
        if (calendarInstanceRef.current) {
            calendarInstanceRef.current.removeAllEvents()
            calendarInstanceRef.current.addEventSource(getEvents())
        }
    }, [scheduledTasks])

    // Manejar el evento de soltar para el arrastrar y soltar nativo
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()

        // Obtener el ID de la tarea desde el dataTransfer
        const taskId = e.dataTransfer.getData("text/plain")
        if (!taskId) return

        // Obtener la fecha donde se soltó
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Encontrar la celda del día donde se soltó
        const element = document.elementFromPoint(e.clientX, e.clientY)
        if (!element) return

        const dateCell = element.closest(".fc-daygrid-day")
        if (!dateCell) return

        const date = dateCell.getAttribute("data-date")
        if (!date) return

        // Programar la tarea
        scheduleTask(taskId, date)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    return (
        <Box className={classes.root} onDrop={handleDrop} onDragOver={handleDragOver}>
            <div ref={calendarRef} className={classes.calendarContainer} />
        </Box>
    )
}
