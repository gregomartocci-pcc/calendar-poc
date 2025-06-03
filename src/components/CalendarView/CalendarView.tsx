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

    // States for the modal
    const [openModal, setOpenModal] = useState(false)
    const [selectedDateEvents, setSelectedDateEvents] = useState<Task[]>([])
    const [selectedDate, setSelectedDate] = useState<string>("")

    // Functions to get colors based on task type
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

    // USE EVENTS FROM CONTEXT
    const getEvents = () => {
        console.log("🔍 Getting events from context:", calendarEvents)
        return Object.entries(calendarEvents).flatMap(([date, tasks]) =>
            tasks.map((task) => ({
                id: task.id,
                title: task.title,
                start: task.startTime ? `${date}T${task.startTime}:00` : date,
                end: task.endTime ? `${date}T${task.endTime}:00` : undefined,
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
                    timezone: task.timezone,
                    description: task.description,
                },
            })),
        )
    }

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr + "T00:00:00")
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatTime = (time: string): string => {
        if (!time) return ""
        const [hours, minutes] = time.split(":")
        const hour = Number.parseInt(hours)
        const ampm = hour >= 12 ? "PM" : "AM"
        const displayHour = hour % 12 || 12
        return `${displayHour}:${minutes} ${ampm}`
    }

    // CALLBACK FOR DATE CLICK
    const handleDateClick = (info: any) => {
        console.log(`🎯 Clicked on date: ${info.dateStr}`)
        const events = calendarEvents[info.dateStr] || []
        console.log(`📅 Found ${events.length} events for ${info.dateStr}:`, events)

        setSelectedDateEvents(events)
        setSelectedDate(info.dateStr)
        setOpenModal(true)
    }

    // HANDLE NATIVE DROP
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()

        try {
            const taskData = e.dataTransfer.getData("application/json")
            if (!taskData) return

            const task = JSON.parse(taskData)
            console.log("🔍 Task data received:", task)

            // Get the date of the day where it was dropped
            const element = document.elementFromPoint(e.clientX, e.clientY)
            if (!element) return

            const dateCell = element.closest(".fc-daygrid-day")
            if (!dateCell) return

            const date = dateCell.getAttribute("data-date")
            if (!date) return

            console.log(`📦 Dropping task "${task.title}" on ${date}`)

            // Check if this event already exists on this date
            const existingEvents = calendarEvents[date] || []
            const isDuplicate = existingEvents.some((event) => event.id === task.id)

            if (!isDuplicate) {
                // 🎯 USE CONTEXT FUNCTION
                addEventToCalendar(task, date)

                // 🎯 REMOVE TASK FROM SIDEBAR
                if (removeTaskFromUnscheduled && task.id) {
                    console.log(`🗑️ Attempting to remove task with ID: ${task.id}`)
                    removeTaskFromUnscheduled(task.id)
                    console.log(`🗑️ Remove function called for task ${task.id}`)
                }
                console.log(`✅ Event added successfully`)
            } else {
                console.log(`⚠️ Event already exists, won't duplicate`)
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

    // Modal content
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
                        <Typography variant="body1" style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "16px" }}>
                            {event.title}
                        </Typography>

                        <Typography
                            variant="caption"
                            style={{
                                fontSize: "12px",
                                opacity: 0.8,
                                textTransform: "uppercase",
                                marginBottom: "8px",
                                display: "block",
                            }}
                        >
                            Type: {event.type}
                        </Typography>

                        {event.patient && (
                            <Typography variant="caption" style={{ fontSize: "12px", marginBottom: "4px", display: "block" }}>
                                👤 <strong>Patient:</strong> {event.patient}
                            </Typography>
                        )}

                        {event.facility && (
                            <Typography variant="caption" style={{ fontSize: "12px", marginBottom: "4px", display: "block" }}>
                                🏥 <strong>Facility:</strong> {event.facility}
                            </Typography>
                        )}

                        {event.assignee && (
                            <Typography variant="caption" style={{ fontSize: "12px", marginBottom: "4px", display: "block" }}>
                                👨‍⚕️ <strong>Assignee:</strong> {event.assignee}
                            </Typography>
                        )}

                        {event.startTime && event.endTime && (
                            <Typography variant="caption" style={{ fontSize: "12px", marginBottom: "4px", display: "block" }}>
                                🕐 <strong>Time:</strong> {formatTime(event.startTime)} - {formatTime(event.endTime)}
                            </Typography>
                        )}

                        {event.timezone && (
                            <Typography variant="caption" style={{ fontSize: "12px", marginBottom: "4px", display: "block" }}>
                                🌍 <strong>Timezone:</strong> {event.timezone}
                            </Typography>
                        )}

                        {event.dueDate && (
                            <Typography variant="caption" style={{ fontSize: "12px", marginBottom: "4px", display: "block" }}>
                                📅 <strong>Due Date:</strong> {event.dueDate}
                            </Typography>
                        )}

                        {event.description && (
                            <Typography
                                variant="caption"
                                style={{ fontSize: "12px", marginBottom: "4px", display: "block", fontStyle: "italic" }}
                            >
                                📝 <strong>Description:</strong> {event.description}
                            </Typography>
                        )}

                        {event.createdAt && (
                            <Typography
                                variant="caption"
                                style={{ fontSize: "11px", opacity: 0.7, display: "block", marginTop: "8px" }}
                            >
                                📋 <strong>Created:</strong>{" "}
                                {new Date(event.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Typography>
                        )}

                        <Typography
                            variant="caption"
                            style={{ fontSize: "11px", opacity: 0.7, display: "block", marginTop: "4px" }}
                        >
                            🆔 <strong>ID:</strong> {event.id}
                        </Typography>
                    </div>
                ))
            ) : (
                <DialogContentText>No events scheduled for {formatDate(selectedDate)}</DialogContentText>
            )}
        </div>
    )

    // Modal actions
    const actions = (
        <Button color="primary" label="Close" onClick={() => setOpenModal(false)} size="small" variant="contained" />
    )

    // Modal header
    const title = (
        <Typography variant="h4" style={{ color: "#333", fontWeight: "bold" }}>
            Events for {formatDate(selectedDate)}
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
                {/* 🎯 FULLCALENDAR REACT COMPONENT */}
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
