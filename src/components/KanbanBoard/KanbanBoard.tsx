"use client"

import { useState } from "react"
import { Box, Paper, Avatar, makeStyles, createStyles, type Theme } from "@material-ui/core"
import { Typography } from "@evergreen/core"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        kanbanContainer: {
            display: "grid",
            gridTemplateColumns: "repeat(4, 320px)", // 🎯 MISMO ANCHO QUE EL SIDEBAR (320px)
            gap: theme.spacing(3),
            backgroundColor: "#ffffff",
            minHeight: "70vh",
            overflowX: "auto", // 🎯 SCROLL HORIZONTAL SI ES NECESARIO
            justifyContent: "start", // 🎯 ALINEAR A LA IZQUIERDA
        },
        column: {
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            padding: theme.spacing(2),
            minHeight: "500px",
            border: "1px solid #e9ecef",
            width: "320px", // 🎯 ANCHO FIJO IGUAL AL SIDEBAR
            flexShrink: 0, // 🎯 NO SE ENCOGE
        },
        columnHeader: {
            marginBottom: theme.spacing(2),
            padding: theme.spacing(0, 1),
        },
        columnTitle: {
            fontWeight: 600,
            fontSize: "16px",
            color: "#374151",
        },
        taskCard: {
            backgroundColor: "white",
            borderRadius: "8px",
            padding: theme.spacing(2),
            marginBottom: theme.spacing(2),
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e9ecef",
            "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transform: "translateY(-1px)",
            },
        },
        taskTitle: {
            fontSize: "16px",
            fontWeight: 600,
            color: "#111827",
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
            color: "#111827",
            fontWeight: 500,
        },
        assigneeSection: {
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(1),
            marginTop: theme.spacing(2),
            paddingTop: theme.spacing(2),
            borderTop: "1px solid #f3f4f6",
        },
        avatar: {
            width: 24,
            height: 24,
            fontSize: "12px",
            backgroundColor: "#e5e7eb",
            color: "#374151",
        },
        assigneeName: {
            fontSize: "14px",
            color: "#111827",
            fontWeight: 500,
        },
        dropZone: {
            minHeight: "400px",
            borderRadius: "8px",
            transition: "all 0.2s ease",
        },
        dropZoneActive: {
            backgroundColor: "#f0fdfa",
        },
    }),
)

interface Task {
    id: string
    title: string
    scheduleDate: string
    dueDate: string
    facility: string
    assignee: string
    assigneeName: string
    column: string
}

const initialTasks: Task[] = [
    {
        id: "1",
        title: "PHQ2-9 Screening",
        scheduleDate: "--",
        dueDate: "04/07/2025",
        facility: "Watersprings Senior Living",
        assignee: "Nurse",
        assigneeName: "Emily Young",
        column: "notscheduled",
    },
    {
        id: "2",
        title: "Fall Risk Assessment",
        scheduleDate: "04/01/2025",
        dueDate: "04/02/2025",
        facility: "Watersprings Senior Living",
        assignee: "Nurse",
        assigneeName: "Emily Young",
        column: "today",
    },
    {
        id: "3",
        title: "BIMS",
        scheduleDate: "04/07/2025",
        dueDate: "04/07/2025",
        facility: "Watersprings Senior Living",
        assignee: "Amanda Johnson",
        assigneeName: "Emily Young",
        column: "next7days",
    },
]

const columns = [
    { id: "notscheduled", title: "Not Scheduled" },
    { id: "today", title: "Today (April 1)" },
    { id: "tomorrow", title: "Tomorrow (April 2)" },
    { id: "next7days", title: "Next 7 Days" },
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
        const taskIndex = newTasks.findIndex((task) => task.id === result.draggableId)
        if (taskIndex !== -1) {
            newTasks[taskIndex].column = destination.droppableId
        }

        setTasks(newTasks)
    }

    const getTasksByColumn = (columnId: string) => {
        return tasks.filter((task) => task.column === columnId)
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Box className={classes.kanbanContainer}>
                {columns.map((column) => {
                    const columnTasks = getTasksByColumn(column.id)
                    return (
                        <div key={column.id} className={classes.column}>
                            <div className={classes.columnHeader}>
                                <Typography variant="h4" className={classes.columnTitle}>
                                    {column.title}
                                </Typography>
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
                                                        <Typography variant="subtitle1" className={classes.taskTitle}>
                                                            {task.title}
                                                        </Typography>

                                                        <Box className={classes.taskDetail}>
                                                            <Typography variant="body2" className={classes.detailLabel}>
                                                                Schedule Date
                                                            </Typography>
                                                            <Typography variant="body2" className={classes.detailValue}>
                                                                {task.scheduleDate}
                                                            </Typography>
                                                        </Box>

                                                        <Box className={classes.taskDetail}>
                                                            <Typography variant="body2" className={classes.detailLabel}>
                                                                Due Date
                                                            </Typography>
                                                            <Typography variant="body2" className={classes.detailValue}>
                                                                {task.dueDate}
                                                            </Typography>
                                                        </Box>

                                                        <Box className={classes.taskDetail}>
                                                            <Typography variant="body2" className={classes.detailLabel}>
                                                                Facility
                                                            </Typography>
                                                            <Typography variant="body2" className={classes.detailValue}>
                                                                {task.facility}
                                                            </Typography>
                                                        </Box>

                                                        <Box className={classes.taskDetail}>
                                                            <Typography variant="body2" className={classes.detailLabel}>
                                                                Assignee
                                                            </Typography>
                                                            <Typography variant="body2" className={classes.detailValue}>
                                                                {task.assignee}
                                                            </Typography>
                                                        </Box>

                                                        <Box className={classes.assigneeSection}>
                                                            <Avatar className={classes.avatar}>{getInitials(task.assigneeName)}</Avatar>
                                                            <Typography variant="body2" className={classes.assigneeName}>
                                                                {task.assigneeName}
                                                            </Typography>
                                                        </Box>
                                                    </Paper>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
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
