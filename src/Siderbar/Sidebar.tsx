"use client"
import { useRef, useEffect } from "react"
import { Box, Typography, Paper, Divider, Avatar, Tooltip } from "@material-ui/core"
import { makeStyles, type Theme, createStyles } from "@material-ui/core/styles"
import { DragIndicator } from "@material-ui/icons"
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
        },
        title: {
            marginBottom: theme.spacing(2),
        },
        infoBox: {
            marginBottom: theme.spacing(2),
            padding: theme.spacing(2),
            backgroundColor: "#f3f4f6",
            borderRadius: "4px",
        },
        infoText: {
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(1),
        },
        taskCard: {
            padding: theme.spacing(2),
            marginBottom: theme.spacing(2),
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            position: "relative",
            transition: "all 0.2s ease",
            cursor: "grab",
            "&:hover": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderColor: "#0e766e",
            },
            "&:active": {
                cursor: "grabbing",
            },
        },
        dragIndicator: {
            position: "absolute",
            top: "8px",
            right: "8px",
            cursor: "grab",
            color: "#0e766e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
            borderRadius: "4px",
            backgroundColor: "rgba(14, 118, 110, 0.1)",
            "&:hover": {
                backgroundColor: "rgba(14, 118, 110, 0.2)",
            },
        },
        taskTitle: {
            marginBottom: theme.spacing(1),
            fontWeight: "bold",
            paddingRight: theme.spacing(5),
        },
        taskDetail: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        detailLabel: {
            color: theme.palette.text.secondary,
        },
        divider: {
            margin: theme.spacing(2, 0),
        },
        patientInfo: {
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(1),
        },
        avatar: {
            width: 24,
            height: 24,
        },
        dragging: {
            opacity: 0.5,
            transform: "scale(1.02)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1) !important",
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
            <Typography variant="h6" className={classes.title}>
                Not Scheduled
            </Typography>

            <Box className={classes.infoBox}>
                <Typography variant="body2" className={classes.infoText}>
                    <DragIndicator />
                    Drag task to calendar
                </Typography>
            </Box>

            <div id="draggable-container">
                {unscheduledTasks.map((task) => (
                    <Paper
                        key={task.id}
                        ref={(el: HTMLDivElement | null) => (taskRefs.current[task.id] = el)}
                        className={`${classes.taskCard} task-card`}
                        data-task-id={task.id}
                    // REMOVEMOS completamente los manejadores nativos de HTML5
                    // draggable={true}
                    // onDragStart={...}
                    // onDragEnd={...}
                    >
                        <Tooltip title="Drag this task to the calendar">
                            <Box className={classes.dragIndicator}>
                                <DragIndicator />
                            </Box>
                        </Tooltip>

                        <Typography variant="h6" className={classes.taskTitle}>
                            {task.title}
                        </Typography>
                        <Box>
                            <Box className={classes.taskDetail}>
                                <Typography variant="body2" className={classes.detailLabel}>
                                    Due Date
                                </Typography>
                                <Typography variant="body2">{task.dueDate || "--"}</Typography>
                            </Box>
                            <Box className={classes.taskDetail}>
                                <Typography variant="body2" className={classes.detailLabel}>
                                    Type
                                </Typography>
                                <Typography variant="body2" style={{ textTransform: "capitalize" }}>
                                    {task.type}
                                </Typography>
                            </Box>
                            <Box className={classes.taskDetail}>
                                <Typography variant="body2" className={classes.detailLabel}>
                                    Facility
                                </Typography>
                                <Typography variant="body2">{task.facility || "--"}</Typography>
                            </Box>
                            <Box className={classes.taskDetail}>
                                <Typography variant="body2" className={classes.detailLabel}>
                                    Assignee
                                </Typography>
                                <Typography variant="body2">{task.assignee || "--"}</Typography>
                            </Box>

                            <Divider className={classes.divider} />

                            <Box className={classes.taskDetail}>
                                <Typography variant="body2" className={classes.detailLabel}>
                                    Patient
                                </Typography>
                                <Box className={classes.patientInfo}>
                                    <Avatar className={classes.avatar}>
                                        {task.patient ? task.patient.substring(0, 2).toUpperCase() : "?"}
                                    </Avatar>
                                    <Typography variant="body2">{task.patient || "Unknown"}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </div>
        </Box>
    )
}
