"use client"

import { useState } from "react"
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Chip,
    IconButton,
    makeStyles,
    createStyles,
    type Theme,
} from "@material-ui/core"
import { Add as AddIcon, MoreVert as MoreVertIcon } from "@material-ui/icons"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        kanbanContainer: {
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: theme.spacing(2),
            padding: theme.spacing(2),
            backgroundColor: "#f9fafb",
            minHeight: "70vh",
        },
        column: {
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            padding: theme.spacing(1),
            minHeight: "500px",
        },
        columnHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing(2),
            padding: theme.spacing(0, 1),
        },
        columnTitle: {
            fontWeight: 600,
            fontSize: "14px",
            color: "#374151",
        },
        taskCount: {
            backgroundColor: "#e5e7eb",
            color: "#6b7280",
            fontSize: "12px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "12px",
            minWidth: "20px",
            textAlign: "center",
        },
        taskCard: {
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: theme.spacing(2),
            marginBottom: theme.spacing(1.5),
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transform: "translateY(-1px)",
            },
        },
        taskHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: theme.spacing(1),
        },
        taskTitle: {
            fontSize: "14px",
            fontWeight: 600,
            color: "#111827",
            lineHeight: 1.4,
            marginBottom: theme.spacing(0.5),
        },
        taskSubtitle: {
            fontSize: "12px",
            color: "#6b7280",
            marginBottom: theme.spacing(1.5),
        },
        taskFooter: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        taskDate: {
            fontSize: "12px",
            color: "#6b7280",
        },
        avatar: {
            width: 24,
            height: 24,
            fontSize: "10px",
            backgroundColor: "#0e766e",
        },
        priorityChip: {
            height: "20px",
            fontSize: "10px",
            fontWeight: 600,
        },
        highPriority: {
            backgroundColor: "#fef2f2",
            color: "#dc2626",
        },
        mediumPriority: {
            backgroundColor: "#fffbeb",
            color: "#d97706",
        },
        lowPriority: {
            backgroundColor: "#f0fdf4",
            color: "#16a34a",
        },
        addTaskButton: {
            width: "100%",
            padding: theme.spacing(2),
            border: "2px dashed #d1d5db",
            borderRadius: "8px",
            backgroundColor: "transparent",
            color: "#6b7280",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing(1),
            fontSize: "14px",
            fontWeight: 500,
            transition: "all 0.2s ease",
            "&:hover": {
                borderColor: "#0e766e",
                color: "#0e766e",
                backgroundColor: "#f0fdfa",
            },
        },
        dropZone: {
            minHeight: "100px",
            border: "2px dashed transparent",
            borderRadius: "8px",
            transition: "all 0.2s ease",
        },
        dropZoneActive: {
            borderColor: "#0e766e",
            backgroundColor: "#f0fdfa",
        },
    }),
)

interface Task {
    id: string
    title: string
    subtitle: string
    date: string
    assignee: string
    priority: "high" | "medium" | "low"
    column: string
}

const initialTasks: Task[] = [
    {
        id: "1",
        title: "PHQ2-9 Screening",
        subtitle: "Resident: Johnson, Mary",
        date: "Apr 1",
        assignee: "JD",
        priority: "high",
        column: "today",
    },
    {
        id: "2",
        title: "Medication Review",
        subtitle: "Resident: Smith, John",
        date: "Apr 2",
        assignee: "AS",
        priority: "medium",
        column: "next7days",
    },
    {
        id: "3",
        title: "Care Plan Update",
        subtitle: "Resident: Brown, Lisa",
        date: "Apr 3",
        assignee: "MR",
        priority: "low",
        column: "next7days",
    },
    {
        id: "4",
        title: "Family Conference",
        subtitle: "Resident: Davis, Robert",
        date: "Apr 15",
        assignee: "JD",
        priority: "medium",
        column: "scheduled",
    },
]

const columns = [
    { id: "today", title: "Today", color: "#0e766e" },
    { id: "next7days", title: "Next 7 Days", color: "#0e766e" },
    { id: "scheduled", title: "Scheduled", color: "#0e766e" },
    { id: "completed", title: "Completed", color: "#16a34a" },
]

export function MUIKanbanBoard() {
    const classes = useStyles()
    const [tasks, setTasks] = useState<Task[]>(initialTasks)

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const { source, destination } = result
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return
        }

        const newTasks = Array.from(tasks)
        const [reorderedTask] = newTasks.splice(source.index, 1)
        reorderedTask.column = destination.droppableId
        newTasks.splice(destination.index, 0, reorderedTask)

        setTasks(newTasks)
    }

    const getTasksByColumn = (columnId: string) => {
        return tasks.filter((task) => task.column === columnId)
    }

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case "high":
                return classes.highPriority
            case "medium":
                return classes.mediumPriority
            case "low":
                return classes.lowPriority
            default:
                return classes.lowPriority
        }
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Box className={classes.kanbanContainer}>
                {columns.map((column) => {
                    const columnTasks = getTasksByColumn(column.id)
                    return (
                        <div key={column.id} className={classes.column}>
                            <div className={classes.columnHeader}>
                                <Typography className={classes.columnTitle}>{column.title}</Typography>
                                <span className={classes.taskCount}>{columnTasks.length}</span>
                            </div>

                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`${classes.dropZone} ${snapshot.isDraggingOver ? classes.dropZoneActive : ""}`}
                                    >
                                        {columnTasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Paper
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={classes.taskCard}
                                                        elevation={snapshot.isDragging ? 4 : 1}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            transform: snapshot.isDragging ? provided.draggableProps.style?.transform : "none",
                                                        }}
                                                    >
                                                        <div className={classes.taskHeader}>
                                                            <Chip
                                                                label={task.priority.toUpperCase()}
                                                                size="small"
                                                                className={`${classes.priorityChip} ${getPriorityClass(task.priority)}`}
                                                            />
                                                            <IconButton size="small">
                                                                <MoreVertIcon fontSize="small" />
                                                            </IconButton>
                                                        </div>

                                                        <Typography className={classes.taskTitle}>{task.title}</Typography>
                                                        <Typography className={classes.taskSubtitle}>{task.subtitle}</Typography>

                                                        <div className={classes.taskFooter}>
                                                            <Typography className={classes.taskDate}>{task.date}</Typography>
                                                            <Avatar className={classes.avatar}>{task.assignee}</Avatar>
                                                        </div>
                                                    </Paper>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        <div className={classes.addTaskButton} onClick={() => console.log(`Add task to ${column.title}`)}>
                                            <AddIcon fontSize="small" />
                                            Add Task
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )
                })}
            </Box>
        </DragDropContext>
    )
}
