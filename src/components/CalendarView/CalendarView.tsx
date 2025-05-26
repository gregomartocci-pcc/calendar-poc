"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Box, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Dialog, DialogContentText, Button } from "@evergreen/core"
import "./calendar-styles.css"

// Tipos locales para los eventos de mockup
interface Task {
    id: string
    title: string
    type: "todo" | "consult" | "review"
    patient?: string
    facility?: string
    assignee?: string
}

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

interface DateClickInfo {
    dateStr: string
    date: Date
    allDay: boolean
    jsEvent: MouseEvent
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
    const calendarRef = useRef<HTMLDivElement>(null)
    const calendarInstanceRef = useRef<any>(null)

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
            {
                id: "mock-4",
                title: "Cirugía Programada",
                type: "todo",
                patient: "Elena Vásquez",
                facility: "Hospital Sur",
                assignee: "Dr. Rodríguez",
            },
            {
                id: "mock-5",
                title: "Consulta de Seguimiento",
                type: "consult",
                patient: "Roberto Silva",
                facility: "Clínica Este",
                assignee: "Dr. Fernández",
            },
        ],
        "2025-05-10": [
            {
                id: "mock-6",
                title: "Revisión Post-Operatoria",
                type: "review",
                patient: "Ana Torres",
                facility: "Hospital Central",
                assignee: "Dr. García",
            },
            {
                id: "mock-7",
                title: "Emergencia",
                type: "todo",
                patient: "Luis Morales",
                facility: "Hospital de Emergencias",
                assignee: "Dr. Urgencias",
            },
        ],
        "2025-05-15": [
            {
                id: "mock-8",
                title: "Consulta Especializada",
                type: "consult",
                patient: "Carmen Díaz",
                facility: "Centro Médico",
                assignee: "Dr. Especialista",
            },
        ],
        "2025-05-20": [
            {
                id: "mock-9",
                title: "Revisión Anual",
                type: "review",
                patient: "Pedro Jiménez",
                facility: "Clínica Familiar",
                assignee: "Dr. Familia",
            },
            {
                id: "mock-10",
                title: "Terapia Física",
                type: "todo",
                patient: "Sofia Herrera",
                facility: "Centro de Rehabilitación",
                assignee: "Fisioterapeuta",
            },
            {
                id: "mock-11",
                title: "Consulta de Control",
                type: "consult",
                patient: "Miguel Ángel",
                facility: "Clínica Familiar",
                assignee: "Dr. Control",
            },
        ],
        "2025-05-25": [
            {
                id: "mock-12",
                title: "Revisión Mensual",
                type: "review",
                patient: "Laura Gómez",
                facility: "Hospital Norte",
                assignee: "Dr. Mensual",
            },
            {
                id: "mock-13",
                title: "Cita Urgente",
                type: "todo",
                patient: "Fernando Castro",
                facility: "Urgencias 24h",
                assignee: "Dr. Urgente",
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

    // Función para agregar un evento cuando se arrastra algo
    const addEventToDate = (title: string, type: "todo" | "consult" | "review", date: string) => {
        const newEvent: Task = {
            id: `dragged-${Date.now()}-${Math.random()}`,
            title: title,
            type: type,
            patient: "Paciente Arrastrado",
            facility: "Facility desde Drag",
            assignee: "Asignado por Drag",
        }

        setMockEvents((prev) => {
            const updated = {
                ...prev,
                [date]: [...(prev[date] || []), newEvent],
            }
            console.log(`✅ Estado actualizado para ${date}:`, updated[date])
            return updated
        })

        console.log(`✅ Evento agregado: ${title} para ${date}`)
    }

    // Formatear fecha para mostrar en el modal
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    // Inicializar el calendario
    useEffect(() => {
        const initializeCalendar = () => {
            console.log("Initializing calendar, FullCalendar available:", !!window.FullCalendar)

            if (window.FullCalendar && calendarRef.current) {
                if (calendarInstanceRef.current) {
                    calendarInstanceRef.current.destroy()
                }

                try {
                    // @ts-ignore
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
                            console.log("📅 Drop event detectado:", info)

                            // Obtener datos del elemento arrastrado
                            const taskTitle = info.draggedEl.textContent?.trim() || "Tarea Arrastrada"
                            const taskType = info.draggedEl.getAttribute("data-task-type") || "todo"

                            console.log(`📦 Agregando evento: ${taskTitle} (${taskType}) para ${info.dateStr}`)

                            // Verificar que no existe ya este evento en esta fecha
                            const existingEvents = mockEvents[info.dateStr] || []
                            const isDuplicate = existingEvents.some((event) => event.title === taskTitle)

                            if (!isDuplicate) {
                                addEventToDate(taskTitle, taskType as "todo" | "consult" | "review", info.dateStr)
                                console.log(`✅ Evento agregado exitosamente`)
                            } else {
                                console.log(`⚠️ Evento ya existe, no se duplicará`)
                            }

                            // Remover el elemento arrastrado del DOM
                            info.draggedEl.remove()
                        },
                        // REMOVEMOS eventReceive para evitar duplicación
                        dateClick: (info: DateClickInfo) => {
                            const date = info.dateStr
                            const events = mockEvents[date] || []
                            console.log(`🎯 Clicked on date: ${date}`)
                            console.log(`📅 Found ${events.length} events:`, events)

                            setSelectedDateEvents(events)
                            setSelectedDate(date)
                            setOpenModal(true)
                        },
                        dayMaxEventRows: 3,
                        moreLinkClick: (info: any) => {
                            const date = info.date.toISOString().split("T")[0]
                            const events = mockEvents[date] || []
                            setSelectedDateEvents(events)
                            setSelectedDate(date)
                            setOpenModal(true)
                        },
                    })

                    calendar.render()
                    calendarInstanceRef.current = calendar
                    console.log("✅ Calendar initialized successfully")
                    // Debugging para verificar que los eventos se cargan
                    console.log("🎯 Mock events:", mockEvents)
                    console.log("📅 Formatted events for calendar:", getEvents())
                } catch (error) {
                    console.error("❌ Error initializing calendar:", error)
                }
            } else {
                console.log("⏳ FullCalendar not available yet, retrying...")
                setTimeout(initializeCalendar, 1000)
            }
        }

        setTimeout(initializeCalendar, 500)

        return () => {
            if (calendarInstanceRef.current) {
                calendarInstanceRef.current.destroy()
            }
        }
    }, [])

    // Actualizar eventos cuando cambien los mockEvents
    useEffect(() => {
        if (calendarInstanceRef.current) {
            console.log("🔄 Actualizando eventos del calendario")
            calendarInstanceRef.current.removeAllEvents()
            calendarInstanceRef.current.addEventSource(getEvents())
        }
    }, [mockEvents])

    // Manejar el evento de soltar para el arrastrar y soltar nativo
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const taskTitle = e.dataTransfer.getData("text/plain") || "Tarea Arrastrada"
        const taskType = e.dataTransfer.getData("text/type") || "todo"

        console.log(`📦 Drop nativo detectado: ${taskTitle}`)

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const element = document.elementFromPoint(e.clientX, e.clientY)
        if (!element) return

        const dateCell = element.closest(".fc-daygrid-day")
        if (!dateCell) return

        const date = dateCell.getAttribute("data-date")
        if (!date) return

        addEventToDate(taskTitle, taskType as "todo" | "consult" | "review", date)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
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
        <Box className={classes.root} onDrop={handleDrop} onDragOver={handleDragOver}>
            <div ref={calendarRef} className={classes.calendarContainer} />

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
