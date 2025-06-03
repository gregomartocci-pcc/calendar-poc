"use client"
import { Dialog, Typography } from "@evergreen/core"
import { makeStyles, createStyles, type Theme, Box, Button, IconButton, Chip } from "@material-ui/core"
import {
    Add as AddIcon,
    Close as CloseIcon,
    AccessTime as TimeIcon,
    Person as PersonIcon,
    LocationOn as LocationIcon,
} from "@material-ui/icons"

interface CalendarEvent {
    id: string
    title: string
    date: Date
    time?: string
    type?: "todo" | "consult" | "review"
    patient?: string
    facility?: string
    assignee?: string
    description?: string
    startTime?: string
    endTime?: string
    dueDate?: string
    timezone?: string
}

interface DayDetailModalProps {
    open: boolean
    onClose: () => void
    date: Date | null
    events: CalendarEvent[]
    onAddEvent?: (date: Date) => void
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modalHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: theme.spacing(2, 3),
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f8f9fa",
        },
        dateTitle: {
            fontWeight: 600,
            color: "#333",
            fontSize: "20px",
        },
        dateSubtitle: {
            color: "#666",
            marginTop: theme.spacing(0.5),
            fontSize: "14px",
        },
        closeButton: {
            padding: theme.spacing(0.5),
        },
        contentContainer: {
            padding: theme.spacing(0),
            maxHeight: "60vh",
            overflowY: "auto",
        },
        emptyState: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: theme.spacing(6),
            textAlign: "center",
        },
        emptyStateIcon: {
            fontSize: 48,
            color: "#ccc",
            marginBottom: theme.spacing(2),
        },
        emptyStateText: {
            color: "#666",
            marginBottom: theme.spacing(2),
        },
        addButton: {
            backgroundColor: "#0e766e",
            color: "white",
            "&:hover": {
                backgroundColor: "#0d5d56",
            },
        },
        eventsList: {
            padding: theme.spacing(1),
        },
        eventItem: {
            display: "flex",
            padding: theme.spacing(2),
            marginBottom: theme.spacing(1),
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            position: "relative",
        },
        timeColumn: {
            minWidth: "100px",
            marginRight: theme.spacing(3),
            textAlign: "left",
            borderRight: "2px solid #f0f0f0",
            paddingRight: theme.spacing(2),
        },
        timeDisplay: {
            fontSize: "18px",
            fontWeight: 700,
            color: "#0e766e",
            lineHeight: 1.2,
        },
        timeRange: {
            fontSize: "13px",
            color: "#666",
            marginTop: theme.spacing(0.5),
            fontWeight: 500,
        },
        eventContent: {
            flex: 1,
        },
        eventHeader: {
            display: "flex",
            alignItems: "center",
            marginBottom: theme.spacing(1),
        },
        eventTitle: {
            fontWeight: 600,
            color: "#333",
            fontSize: "16px",
            marginRight: theme.spacing(1),
        },
        eventTypeChip: {
            fontSize: "11px",
            fontWeight: "bold",
            textTransform: "uppercase",
            height: "22px",
        },
        eventDetails: {
            display: "flex",
            flexWrap: "wrap",
            gap: theme.spacing(2),
            fontSize: "14px",
            color: "#666",
        },
        eventDetail: {
            display: "flex",
            alignItems: "center",
        },
        detailIcon: {
            fontSize: "16px",
            marginRight: theme.spacing(0.5),
            color: "#888",
        },
        eventDescription: {
            marginTop: theme.spacing(1),
            fontSize: "13px",
            color: "#666",
            fontStyle: "italic",
        },
        eventTypeIndicator: {
            width: "4px",
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            borderRadius: "0 4px 4px 0",
        },
        todoIndicator: {
            backgroundColor: "#0e766e",
        },
        consultIndicator: {
            backgroundColor: "#0056b3",
        },
        reviewIndicator: {
            backgroundColor: "#8b4513",
        },
        addEventButton: {
            display: "flex",
            justifyContent: "center",
            padding: theme.spacing(2),
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#f8f9fa",
        },
    }),
)

export function DayDetailModal({ open, onClose, date, events, onAddEvent }: DayDetailModalProps) {
    const classes = useStyles()

    if (!date) {
        return null
    }

    // Formatear la fecha para el título
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" })
    const monthAndDay = date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    const year = date.getFullYear()

    // Función para obtener el color del tipo de evento
    const getEventTypeColor = (type?: string) => {
        switch (type) {
            case "todo":
                return { backgroundColor: "#e6f7f5", color: "#0e766e" }
            case "consult":
                return { backgroundColor: "#e0f2fe", color: "#0056b3" }
            case "review":
                return { backgroundColor: "#fee6c9", color: "#8b4513" }
            default:
                return { backgroundColor: "#f3f4f6", color: "#374151" }
        }
    }

    // Renderizar un evento individual de forma compacta
    const renderEvent = (event: CalendarEvent) => {
        const typeClass =
            event.type === "todo"
                ? classes.todoIndicator
                : event.type === "consult"
                    ? classes.consultIndicator
                    : classes.reviewIndicator

        const typeColors = getEventTypeColor(event.type)

        // Mostrar la hora o "All Day"
        const displayTime = event.startTime || "All Day"
        const timeRange = event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : null

        return (
            <Box key={event.id} className={classes.eventItem}>
                <Box className={`${classes.eventTypeIndicator} ${typeClass}`} />

                {/* Columna de tiempo - MÁS VISIBLE */}
                <Box className={classes.timeColumn}>
                    <Typography variant="h6" className={classes.timeDisplay}>
                        {displayTime}
                    </Typography>
                    {timeRange && (
                        <Typography variant="body2" className={classes.timeRange}>
                            {timeRange}
                        </Typography>
                    )}
                </Box>

                {/* Contenido del evento */}
                <Box className={classes.eventContent}>
                    {/* Header con título y tipo */}
                    <Box className={classes.eventHeader}>
                        <Typography variant="subtitle1" className={classes.eventTitle}>
                            {event.title}
                        </Typography>
                        <Chip label={event.type || "General"} size="small" className={classes.eventTypeChip} style={typeColors} />
                    </Box>

                    {/* Detalles en línea */}
                    <Box className={classes.eventDetails}>
                        {event.patient && (
                            <Box className={classes.eventDetail}>
                                <PersonIcon className={classes.detailIcon} />
                                <Typography variant="body2">{event.patient}</Typography>
                            </Box>
                        )}

                        {event.assignee && (
                            <Box className={classes.eventDetail}>
                                <PersonIcon className={classes.detailIcon} />
                                <Typography variant="body2">Assigned: {event.assignee}</Typography>
                            </Box>
                        )}

                        {event.facility && (
                            <Box className={classes.eventDetail}>
                                <LocationIcon className={classes.detailIcon} />
                                <Typography variant="body2">{event.facility}</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Descripción si existe */}
                    {event.description && (
                        <Box className={classes.eventDescription}>
                            <Typography variant="body2">{event.description}</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        )
    }

    // Ordenar eventos por hora de inicio
    const sortedEvents = [...events].sort((a, b) => {
        const timeA = a.startTime || "00:00"
        const timeB = b.startTime || "00:00"
        return timeA.localeCompare(timeB)
    })

    // Contenido del modal
    const content = (
        <Box className={classes.contentContainer}>
            {events.length === 0 ? (
                <Box className={classes.emptyState}>
                    <TimeIcon className={classes.emptyStateIcon} />
                    <Typography variant="h6" className={classes.emptyStateText}>
                        No events scheduled for this day
                    </Typography>
                    <Button
                        variant="contained"
                        className={classes.addButton}
                        startIcon={<AddIcon />}
                        onClick={() => onAddEvent && onAddEvent(date)}
                    >
                        Add Event
                    </Button>
                </Box>
            ) : (
                <>
                    <Box className={classes.eventsList}>{sortedEvents.map(renderEvent)}</Box>
                    <Box className={classes.addEventButton}>
                        <Button
                            variant="contained"
                            className={classes.addButton}
                            startIcon={<AddIcon />}
                            onClick={() => onAddEvent && onAddEvent(date)}
                        >
                            Add Event
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    )

    // Título personalizado del modal
    const title = (
        <Box className={classes.modalHeader}>
            <Box>
                <Typography variant="h3" className={classes.dateTitle}>
                    {dayOfWeek}
                </Typography>
                <Typography variant="subtitle2" className={classes.dateSubtitle}>
                    {monthAndDay}, {year} • {events.length} event{events.length !== 1 ? "s" : ""}
                </Typography>
            </Box>
            <IconButton className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </Box>
    )

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={title}
            content={content}
        />
    )
}
