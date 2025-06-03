"use client"

import type React from "react"

import { useState } from "react"
import { Box, Button, Paper, makeStyles, createStyles, type Theme } from "@material-ui/core"
import { ChevronLeft, ChevronRight } from "@material-ui/icons"
import { Typography } from "@evergreen/core"

interface CalendarEvent {
    id: string
    title: string
    date: Date
    time?: string
    type?: "todo" | "consult" | "review"
}

interface CalendarViewProps {
    events?: CalendarEvent[]
    onEventClick?: (event: CalendarEvent) => void
    onDateClick?: (date: Date) => void
    onEventDrop?: (event: CalendarEvent, newDate: Date) => void
    onTaskDrop?: (task: any, newDate: Date) => void // 🎯 NUEVA PROP
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        calendarContainer: {
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflow: "hidden",
        },
        calendarHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: theme.spacing(2),
            backgroundColor: "#f8f9fa",
        },
        navigationSection: {
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(1),
        },
        navButton: {
            minWidth: "32px",
            height: "32px",
            padding: 0,
            backgroundColor: "transparent",
            color: "#666",
            "&:hover": {
                backgroundColor: "#e9ecef",
            },
        },
        todayButton: {
            backgroundColor: "transparent",
            color: "#17a2b8",
            textTransform: "uppercase",
            fontSize: "12px",
            fontWeight: "bold",
            padding: theme.spacing(0.5, 1),
            "&:hover": {
                backgroundColor: "#e9ecef",
            },
        },
        monthTitle: {
            fontSize: "18px",
            fontWeight: 500,
            color: "#333",
        },
        viewToggle: {
            display: "flex",
            backgroundColor: "#fff",
            borderRadius: "4px",
            overflow: "hidden",
            border: "1px solid #dee2e6",
        },
        viewButton: {
            backgroundColor: "transparent",
            color: "#666",
            textTransform: "none",
            padding: theme.spacing(0.5, 2),
            borderRadius: 0,
            fontSize: "14px",
            "&:hover": {
                backgroundColor: "#f8f9fa",
            },
        },
        activeViewButton: {
            backgroundColor: "#17a2b8",
            color: "#fff",
            "&:hover": {
                backgroundColor: "#138496",
            },
        },
        weekdaysHeader: {
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
        },
        weekday: {
            padding: theme.spacing(1.5),
            textAlign: "center",
            borderRight: "1px solid #dee2e6",
            "&:last-child": {
                borderRight: "none",
            },
        },
        calendarGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gridAutoRows: "minmax(120px, auto)",
        },
        calendarCell: {
            position: "relative",
            border: "1px solid #dee2e6",
            borderTop: "none",
            borderLeft: "none",
            padding: theme.spacing(1),
            height: "100%",
            minHeight: "120px",
            backgroundColor: "#fff",
            "&:hover": {
                backgroundColor: "#f8f9fa",
            },
            "&:first-child": {
                borderLeft: "1px solid #dee2e6",
            },
        },
        dateNumber: {
            position: "absolute",
            top: "8px",
            left: "8px",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            fontSize: "14px",
            fontWeight: 500,
        },
        currentDateNumber: {
            backgroundColor: "#333",
            color: "#fff",
        },
        otherMonthDate: {
            color: "#adb5bd",
        },
        eventContainer: {
            marginTop: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
        },
        event: {
            padding: theme.spacing(0.5, 1),
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "grab",
            display: "block",
            marginBottom: "2px",
            "&:active": {
                cursor: "grabbing",
            },
        },
        todoEvent: {
            backgroundColor: "#b8e6e1",
            color: "#0e766e",
        },
        consultEvent: {
            backgroundColor: "#a8d8ea",
            color: "#0056b3",
        },
        reviewEvent: {
            backgroundColor: "#ffd6a5",
            color: "#8b4513",
        },
        viewMoreLink: {
            color: "#17a2b8",
            fontSize: "11px",
            cursor: "pointer",
            marginTop: "4px",
            "&:hover": {
                textDecoration: "underline",
            },
        },
        dragOver: {
            backgroundColor: "#e3f2fd",
            borderColor: "#2196f3",
        },
        dragging: {
            opacity: 0.5,
        },
    }),
)

export function CalendarView({ events = [], onEventClick, onDateClick, onEventDrop, onTaskDrop }: CalendarViewProps) {
    const classes = useStyles()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentView, setCurrentView] = useState<"Month" | "Week">("Month")
    const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null)

    // Get current month and year
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Get first day of the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const firstDayOfWeek = firstDayOfMonth.getDay()

    // Get last day of the month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()

    // Navigation functions
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    }

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    }

    const goToToday = () => {
        setCurrentDate(new Date())
    }

    // Generate calendar days
    const generateCalendarDays = () => {
        const days = []

        // Previous month days
        const prevMonth = new Date(currentYear, currentMonth - 1, 0)
        const prevMonthDays = prevMonth.getDate()

        for (let i = prevMonthDays - firstDayOfWeek + 1; i <= prevMonthDays; i++) {
            days.push({
                date: new Date(currentYear, currentMonth - 1, i),
                isCurrentMonth: false,
            })
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(currentYear, currentMonth, i),
                isCurrentMonth: true,
            })
        }

        // Fill remaining cells to complete the grid (42 cells = 6 weeks)
        const totalCells = 42
        const remainingCells = totalCells - days.length

        for (let i = 1; i <= remainingCells; i++) {
            days.push({
                date: new Date(currentYear, currentMonth + 1, i),
                isCurrentMonth: false,
            })
        }

        return days
    }

    // Check if a date is today
    const isToday = (date: Date) => {
        const today = new Date()
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    }

    // Get events for a specific date
    const getEventsForDate = (date: Date) => {
        return events.filter(
            (event) =>
                event.date.getDate() === date.getDate() &&
                event.date.getMonth() === date.getMonth() &&
                event.date.getFullYear() === date.getFullYear(),
        )
    }

    // Format month name
    const formatMonth = (date: Date) => {
        return date.toLocaleDateString("en-US", { month: "long" })
    }

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
        setDraggedEvent(event)
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/html", e.currentTarget.outerHTML)
        e.currentTarget.classList.add(classes.dragging)
    }

    const handleDragEnd = (e: React.DragEvent) => {
        e.currentTarget.classList.remove(classes.dragging)
        setDraggedEvent(null)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        e.currentTarget.classList.add(classes.dragOver)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove(classes.dragOver)
    }

    const handleDrop = (e: React.DragEvent, targetDate: Date) => {
        e.preventDefault()
        e.currentTarget.classList.remove(classes.dragOver)

        // Intentar obtener datos del evento arrastrado
        try {
            const draggedData = e.dataTransfer.getData("application/json")
            if (draggedData) {
                const task = JSON.parse(draggedData)
                console.log("🎯 CalendarView: Task dropped from sidebar:", task)

                if (onTaskDrop) {
                    onTaskDrop(task, targetDate)
                }
                return
            }
        } catch (error) {
            console.log("No JSON data found, checking for internal event")
        }

        // Si no hay datos JSON, es un evento interno del calendario
        if (draggedEvent && onEventDrop) {
            onEventDrop(draggedEvent, targetDate)
        }
    }

    // Weekday names
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Calendar days
    const calendarDays = generateCalendarDays()

    return (
        <Paper className={classes.calendarContainer}>
            {/* Calendar Header */}
            <Box className={classes.calendarHeader}>
                <Box className={classes.navigationSection}>
                    <Button className={classes.navButton} onClick={goToPreviousMonth}>
                        <ChevronLeft fontSize="small" />
                    </Button>
                    <Button className={classes.navButton} onClick={goToNextMonth}>
                        <ChevronRight fontSize="small" />
                    </Button>
                    <Button className={classes.todayButton} onClick={goToToday}>
                        <Typography variant="caption" style={{ textTransform: "uppercase", fontWeight: "bold" }}>
                            TODAY
                        </Typography>
                    </Button>
                </Box>

                <Typography variant="h3" className={classes.monthTitle}>
                    {formatMonth(currentDate)}
                </Typography>

                <Box className={classes.viewToggle}>
                    <Button
                        className={`${classes.viewButton} ${currentView === "Month" ? classes.activeViewButton : ""}`}
                        onClick={() => setCurrentView("Month")}
                    >
                        <Typography variant="body2">Month</Typography>
                    </Button>
                    <Button
                        className={`${classes.viewButton} ${currentView === "Week" ? classes.activeViewButton : ""}`}
                        onClick={() => setCurrentView("Week")}
                    >
                        <Typography variant="body2">Week</Typography>
                    </Button>
                </Box>
            </Box>

            {/* Weekday Headers */}
            <Box className={classes.weekdaysHeader}>
                {weekdays.map((day) => (
                    <Box key={day} className={classes.weekday}>
                        <Typography variant="body2" style={{ fontWeight: 500, color: "#666" }}>
                            {day}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Calendar Grid */}
            <Box className={classes.calendarGrid}>
                {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDate(day.date)
                    const isCurrentDay = isToday(day.date)
                    const visibleEvents = dayEvents.slice(0, 3) // Show max 3 events
                    const hasMoreEvents = dayEvents.length > 3

                    return (
                        <Box
                            key={index}
                            className={classes.calendarCell}
                            onClick={() => onDateClick && onDateClick(day.date)}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, day.date)}
                        >
                            <Box
                                className={`${classes.dateNumber} ${isCurrentDay ? classes.currentDateNumber : ""} ${!day.isCurrentMonth ? classes.otherMonthDate : ""
                                    }`}
                            >
                                <Typography variant="body2">{day.date.getDate()}</Typography>
                            </Box>

                            <Box className={classes.eventContainer}>
                                {visibleEvents.map((event) => (
                                    <Box
                                        key={event.id}
                                        className={`${classes.event} ${event.type === "todo"
                                            ? classes.todoEvent
                                            : event.type === "consult"
                                                ? classes.consultEvent
                                                : classes.reviewEvent
                                            }`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, event)}
                                        onDragEnd={handleDragEnd}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onEventClick && onEventClick(event)
                                        }}
                                    >
                                        <Typography variant="caption">{event.title}</Typography>
                                    </Box>
                                ))}
                                {hasMoreEvents && (
                                    <Typography variant="caption" className={classes.viewMoreLink}>
                                        view more
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )
                })}
            </Box>
        </Paper>
    )
}
