"use client"
import type React from "react"
import { useRef } from "react"
import { Box, Paper, Avatar } from "@material-ui/core"
import { Typography } from "@evergreen/core"
import { makeStyles, type Theme, createStyles } from "@material-ui/core/styles"
import { useTaskContext } from "../contexts/TasksContext"

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
        taskCard: {
            padding: theme.spacing(2),
            marginBottom: theme.spacing(2),
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            position: "relative",
            transition: "all 0.2s ease",
            cursor: "grab",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            "&:hover": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transform: "translateY(-1px)",
            },
            "&:active": {
                cursor: "grabbing",
            },
        },
        taskTitle: {
            fontSize: "16px",
            fontWeight: 600,
            color: "#1f2937",
            marginBottom: theme.spacing(2),
        },
        taskDetail: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing(1),
            "&:last-child": {
                marginBottom: 0,
            },
        },
        detailLabel: {
            fontSize: "14px",
            color: "#6b7280",
            fontWeight: 500,
        },
        detailValue: {
            fontSize: "14px",
            color: "#1f2937",
            fontWeight: 500,
        },
        patientInfo: {
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(1),
        },
        avatar: {
            width: 24,
            height: 24,
            fontSize: "12px",
            backgroundColor: "#e5e7eb",
            color: "#374151",
        },
        patientName: {
            fontSize: "14px",
            color: "#1f2937",
            fontWeight: 500,
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

    // 🎯 DRAG & DROP NATIVO PURO
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: any) => {
        console.log("🚀 Drag started for task:", task.title)

        // Configurar los datos que se van a transferir
        e.dataTransfer.setData("application/json", JSON.stringify(task))
        e.dataTransfer.effectAllowed = "move"

        // Agregar clase visual de arrastre
        const target = e.currentTarget
        setTimeout(() => {
            target.classList.add(classes.dragging)
        }, 0)
    }

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        console.log("🏁 Drag ended")
        // Remover clase visual de arrastre
        e.currentTarget.classList.remove(classes.dragging)
    }

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

    return (
        <Box className={classes.root}>
            <Typography variant="h4" className={classes.title}>
                Not Scheduled
            </Typography>

            <div ref={containerRef}>
                {unscheduledTasks.map((task) => (
                    <Paper
                        key={task.id}
                        className={classes.taskCard}
                        elevation={0}
                        style={{
                            backgroundColor: getTaskBackgroundColor(task.type),
                            borderColor: getTaskTextColor(task.type),
                        }}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                    >
                        <Typography variant="subtitle1" className={classes.taskTitle}>
                            {task.title}
                        </Typography>

                        <Box className={classes.taskDetail}>
                            <Typography variant="body2" className={classes.detailLabel}>
                                Schedule Date
                            </Typography>
                            <Typography variant="body2" className={classes.detailValue}>
                                --
                            </Typography>
                        </Box>

                        <Box className={classes.taskDetail}>
                            <Typography variant="body2" className={classes.detailLabel}>
                                Due Date
                            </Typography>
                            <Typography variant="body2" className={classes.detailValue}>
                                {task.dueDate || "--"}
                            </Typography>
                        </Box>

                        <Box className={classes.taskDetail}>
                            <Typography variant="body2" className={classes.detailLabel}>
                                Facility
                            </Typography>
                            <Typography variant="body2" className={classes.detailValue}>
                                {task.facility || "--"}
                            </Typography>
                        </Box>

                        <Box className={classes.taskDetail}>
                            <Typography variant="body2" className={classes.detailLabel}>
                                Assignee
                            </Typography>
                            <Typography variant="body2" className={classes.detailValue}>
                                {task.assignee || "--"}
                            </Typography>
                        </Box>

                        <Box className={classes.taskDetail}>
                            <Typography variant="body2" className={classes.detailLabel}>
                                Patient
                            </Typography>
                            <Box className={classes.patientInfo}>
                                <Avatar className={classes.avatar}>
                                    {task.patient ? task.patient.substring(0, 2).toUpperCase() : "?"}
                                </Avatar>
                                <Typography variant="body2" className={classes.patientName}>
                                    {task.patient || "Unknown"}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </div>
        </Box>
    )
}
