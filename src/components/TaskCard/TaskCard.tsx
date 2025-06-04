"use client"

import type React from "react"

import { Paper, Avatar, Box, makeStyles, createStyles, type Theme } from "@material-ui/core"
import { Typography } from "@evergreen/core"
import { Draggable } from "react-beautiful-dnd"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(1.5),
                marginBottom: theme.spacing(1.5),
            },
        },
        taskTitle: {
            fontSize: "16px",
            fontWeight: 600,
            color: "#111827",
            marginBottom: theme.spacing(2),
            [theme.breakpoints.down("sm")]: {
                fontSize: "14px",
                marginBottom: theme.spacing(1.5),
            },
        },
        taskDetail: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing(1),
            "&:last-child": {
                marginBottom: 0,
            },
            [theme.breakpoints.down("xs")]: {
                flexDirection: "column",
                alignItems: "flex-start",
                gap: theme.spacing(0.5),
            },
        },
        detailLabel: {
            fontSize: "14px",
            color: "#6b7280",
            fontWeight: 500,
            [theme.breakpoints.down("sm")]: {
                fontSize: "12px",
            },
        },
        detailValue: {
            fontSize: "14px",
            color: "#111827",
            fontWeight: 500,
            [theme.breakpoints.down("sm")]: {
                fontSize: "12px",
            },
        },
        assigneeSection: {
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(1),
            marginTop: theme.spacing(2),
            paddingTop: theme.spacing(2),
            borderTop: "1px solid #f3f4f6",
            [theme.breakpoints.down("sm")]: {
                marginTop: theme.spacing(1.5),
                paddingTop: theme.spacing(1.5),
            },
        },
        avatar: {
            width: 24,
            height: 24,
            fontSize: "12px",
            backgroundColor: "#e5e7eb",
            color: "#374151",
            [theme.breakpoints.down("sm")]: {
                width: 20,
                height: 20,
                fontSize: "10px",
            },
        },
        assigneeName: {
            fontSize: "14px",
            color: "#111827",
            fontWeight: 500,
            [theme.breakpoints.down("sm")]: {
                fontSize: "12px",
            },
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

interface TaskCardProps {
    task: Task
    index: number
    isDraggable?: boolean
    dragType?: "react-beautiful-dnd" | "html5"
    onDragStart?: (e: React.DragEvent<HTMLDivElement>, task: Task) => void
    onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void
    className?: string
}

export function TaskCard({
    task,
    index,
    isDraggable = true,
    dragType = "react-beautiful-dnd",
    onDragStart,
    onDragEnd,
    className,
}: TaskCardProps) {
    const classes = useStyles()

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    // Contenido común de la tarjeta
    const cardContent = (
        <div>
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
        </div>
    )

    // Si no es draggable, devolver solo el contenido
    if (!isDraggable) {
        return (
            <Paper className={`${classes.taskCard} ${className || ""}`} elevation={1}>
                {cardContent}
            </Paper>
        )
    }

    // HTML5 Drag & Drop
    if (dragType === "html5") {
        return (
            <Paper
                className={`${classes.taskCard} ${className || ""}`}
                elevation={1}
                draggable={true}
                onDragStart={(e) => onDragStart?.(e, task)}
                onDragEnd={onDragEnd}
                style={{ cursor: "grab" }}
            >
                {cardContent}
            </Paper>
        )
    }

    // React Beautiful DnD
    return (
        <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        transform: snapshot.isDragging ? provided.draggableProps.style?.transform : "none",
                    }}
                >
                    <Paper className={`${classes.taskCard} ${className || ""}`} elevation={snapshot.isDragging ? 4 : 1}>
                        {cardContent}
                    </Paper>
                </div>
            )}
        </Draggable>
    )
}
