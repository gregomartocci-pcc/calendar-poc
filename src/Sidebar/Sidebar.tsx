"use client"
import type React from "react"
import { useRef } from "react"
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
    }),
)

export function Sidebar() {
    const classes = useStyles()
    const { unscheduledTasks } = useTaskContext()
    const containerRef = useRef<HTMLDivElement>(null)

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
        <Box className={classes.root}>
            <Typography variant="h4" className={classes.title}>
                Not Scheduled
            </Typography>

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
