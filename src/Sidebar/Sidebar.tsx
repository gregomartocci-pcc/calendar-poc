"use client"
import type React from "react"
import { useRef, useState } from "react"
import { Box, makeStyles, type Theme, createStyles } from "@material-ui/core"
import { Typography } from "@evergreen/core"
import { useTaskContext } from "../contexts/TasksContext"
import { TaskCard } from "../components/TaskCard/TaskCard"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            [theme.breakpoints.up("md")]: {
                width: 320,
            },
            flexShrink: 0,
            padding: theme.spacing(2),
            backgroundColor: "#f8f9fa",
            minHeight: "100vh",
            transition: "all 0.3s ease",
        },
        title: {
            fontSize: "18px",
            fontWeight: 500,
            color: "#333",
            marginBottom: theme.spacing(3),
            paddingLeft: theme.spacing(1),
        },
        dragging: {
            opacity: 0.5,
            transform: "scale(1.02)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2) !important",
        },
        dropTarget: {
            backgroundColor: "#e3f2fd",
            borderRadius: "8px",
            border: "2px dashed #2196f3",
        },
        dropIndicator: {
            padding: theme.spacing(2),
            textAlign: "center",
            color: "#2196f3",
            fontWeight: "bold",
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            borderRadius: "8px",
            backgroundColor: "rgba(33, 150, 243, 0.1)",
            border: "2px dashed #2196f3",
            display: "none",
        },
        dropIndicatorActive: {
            display: "block",
        },
    }),
)

export function Sidebar() {
    const classes = useStyles()
    const { unscheduledTasks, moveEventToSidebar } = useTaskContext()
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: any) => {
        console.log("🚀 Drag started for task:", task.title)

        e.dataTransfer.setData("application/json", JSON.stringify(task))
        e.dataTransfer.effectAllowed = "move"

        const target = e.currentTarget
        setTimeout(() => {
            target.classList.add(classes.dragging)
        }, 0)
    }

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        console.log("🏁 Drag ended")
        e.currentTarget.classList.remove(classes.dragging)
    }

    // Nuevos manejadores para recibir eventos del calendario
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(false)
        
        try {
            // Intentar obtener datos del evento arrastrado desde el calendario
            const eventData = e.dataTransfer.getData("application/json")
            if (eventData) {
                const event = JSON.parse(eventData)
                console.log("🎯 Sidebar: Event dropped from calendar:", event)
                
                // Mover el evento de vuelta al sidebar (desprogramarlo)
                moveEventToSidebar(event.id)
                console.log(`✅ Sidebar: Event "${event.title}" moved back to sidebar`)
            }
        } catch (error) {
            console.error("Error handling drop in sidebar:", error)
        }
    }

    const formatDate = (date: Date | string | undefined): string => {
        if (!date) return "--"
        try {
            const dateObj = typeof date === "string" ? new Date(date) : date
            return dateObj.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            })
        } catch {
            return "--"
        }
    }

    // Convertir las tareas del sidebar al formato que espera TaskCard
    const convertTaskForCard = (task: any) => ({
        id: task.id,
        title: task.title,
        scheduleDate: formatDate(task.scheduledDate),
        dueDate: formatDate(task.dueDate),
        facility: task.facility || "Watersprings Senior Living",
        assignee: task.assignee || "Nurse",
        assigneeName: task.patient || "Emily Young",
        column: "unscheduled",
    })

    return (
        <Box 
            className={`${classes.root} ${isDragOver ? classes.dropTarget : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <Typography variant="h4" className={classes.title}>
                Not Scheduled
            </Typography>

            {/* Indicador de drop cuando se arrastra un evento sobre el sidebar */}
            <div className={`${classes.dropIndicator} ${isDragOver ? classes.dropIndicatorActive : ''}`}>
                Suelta aquí para desprogramar el evento
            </div>

            <div ref={containerRef}>
                {unscheduledTasks.map((task, index) => (
                    <TaskCard
                        key={task.id}
                        task={convertTaskForCard(task)}
                        index={index}
                        isDraggable={true}
                        dragType="html5"
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                ))}
            </div>
        </Box>
    )
}
