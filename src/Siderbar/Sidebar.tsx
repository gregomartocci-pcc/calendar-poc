"use client"
import { useRef, useEffect } from "react"
import { Box, Typography, Paper, Avatar } from "@material-ui/core"
import { makeStyles, type Theme, createStyles } from "@material-ui/core/styles"
import { useTaskContext } from "../contexts/TasksContext"

interface TaskRefs {
    [key: string]: HTMLDivElement | null
}

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
    const taskRefs = useRef<TaskRefs>({})
    const draggableInstancesRef = useRef<any[]>([])

    // Configurar los elementos arrastrables para FullCalendar SOLAMENTE
    useEffect(() => {
        const cleanupDraggables = () => {
            draggableInstancesRef.current.forEach((instance) => {
                if (instance && instance.destroy) {
                    instance.destroy()
                }
            })
            draggableInstancesRef.current = []
        }

        const setupDraggables = () => {
            console.log("Setting up draggables, FullCalendar available:", !!window.FullCalendar)

            if (window.FullCalendar && window.FullCalendar.Draggable) {
                cleanupDraggables()

                try {
                    // @ts-ignore
                    const Draggable = window.FullCalendar.Draggable
                    const containerEl = document.getElementById("draggable-container")

                    if (containerEl) {
                        console.log("Creating draggable for container:", containerEl)
                        const draggable = new Draggable(containerEl, {
                            itemSelector: ".task-card",
                            eventData: (eventEl: HTMLElement) => {
                                const taskId = eventEl.getAttribute("data-task-id")
                                const task = unscheduledTasks.find((t) => t.id === taskId)

                                if (!task) return null

                                return {
                                    title: task.title,
                                    id: task.id,
                                    backgroundColor: getTaskBackgroundColor(task.type),
                                    borderColor: getTaskTextColor(task.type),
                                    textColor: getTaskTextColor(task.type),
                                }
                            },
                        })

                        draggableInstancesRef.current.push(draggable)
                        console.log("Draggable created successfully")
                    } else {
                        console.error("Container element not found")
                    }
                } catch (error) {
                    console.error("Error creating draggable:", error)
                }
            } else {
                console.log("FullCalendar not available yet, retrying...")
                setTimeout(setupDraggables, 1000)
            }
        }

        setTimeout(setupDraggables, 500)
        return cleanupDraggables
    }, [unscheduledTasks])

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
            <Typography className={classes.title}>Not Scheduled</Typography>

            <div id="draggable-container">
                {unscheduledTasks.map((task) => (
                    <Paper
                        key={task.id}
                        ref={(el: HTMLDivElement | null) => (taskRefs.current[task.id] = el)}
                        className={`${classes.taskCard} task-card`}
                        data-task-id={task.id}
                        elevation={0}
                    >
                        <Typography className={classes.taskTitle}>{task.title}</Typography>

                        <Box className={classes.taskDetail}>
                            <Typography className={classes.detailLabel}>Schedule Date</Typography>
                            <Typography className={classes.detailValue}>--</Typography>
                        </Box>

                        <Box className={classes.taskDetail}>
                            <Typography className={classes.detailLabel}>Due Date</Typography>
                            <Typography className={classes.detailValue}>{task.dueDate || "--"}</Typography>
                        </Box>

                        <Box className={classes.taskDetail}>
                            <Typography className={classes.detailLabel}>Facility</Typography>
                            <Typography className={classes.detailValue}>{task.facility || "--"}</Typography>
                        </Box>

                        <Box className={classes.taskDetail}>
                            <Typography className={classes.detailLabel}>Assignee</Typography>
                            <Typography className={classes.detailValue}>{task.assignee || "--"}</Typography>
                        </Box>


                        <Box className={classes.taskDetail}>
                            <Typography className={classes.detailLabel}>Patient</Typography>
                            <Box className={classes.patientInfo}>
                                <Avatar className={classes.avatar}>
                                    {task.patient ? task.patient.substring(0, 2).toUpperCase() : "?"}
                                </Avatar>
                                <Typography className={classes.patientName}>{task.patient || "Unknown"}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </div>
        </Box>
    )
}
