"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TextField, FormControl, InputLabel, Select, MenuItem, Grid, Typography, Button } from "@material-ui/core"
import { makeStyles, createStyles, type Theme } from "@material-ui/core/styles"
import { Dialog } from "@evergreen/core"
import type { TaskType } from "../../contexts/TasksContext"

interface CreateEventModalProps {
    open: boolean
    onClose: () => void
    onCreateEvent: (eventData: EventFormData) => void
    initialDate?: string // Nueva prop para fecha inicial
}

export interface EventFormData {
    title: string
    type: TaskType
    patient: string
    facility: string
    assignee: string
    date: string // 🎯 MANTENER COMO STRING PARA EL FORM
    startTime: string
    endTime: string
    timezone: string
    description?: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formContainer: {
            padding: theme.spacing(2),
            minWidth: "500px",
        },
        formRow: {
            marginBottom: theme.spacing(3),
        },
        timeRow: {
            display: "flex",
            gap: theme.spacing(2),
            alignItems: "center",
        },
        timeField: {
            flex: 1,
        },
        buttonContainer: {
            display: "flex",
            gap: theme.spacing(2),
            justifyContent: "flex-end",
            marginTop: theme.spacing(3),
        },
        cancelButton: {
            color: "#666",
            borderColor: "#ddd",
        },
        createButton: {
            backgroundColor: "#0e766e",
            color: "white",
            "&:hover": {
                backgroundColor: "#0d5d56",
            },
        },
    }),
)

export function CreateTaskModal({ open, onClose, onCreateEvent, initialDate }: CreateEventModalProps) {
    const classes = useStyles()

    const [formData, setFormData] = useState<EventFormData>({
        title: "",
        type: "todo",
        patient: "",
        facility: "watersprings",
        assignee: "",
        date: new Date().toISOString().split("T")[0], // Fecha de hoy por defecto
        startTime: "09:00",
        endTime: "10:00",
        timezone: "America/New_York", // Timezone por defecto
        description: "",
    })

    // Actualizar la fecha cuando cambia initialDate
    useEffect(() => {
        if (initialDate) {
            setFormData((prev) => ({ ...prev, date: initialDate }))
        }
    }, [initialDate, open])

    const handleInputChange =
        (field: keyof EventFormData) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
            setFormData({
                ...formData,
                [field]: event.target.value,
            })
        }

    const handleSubmit = () => {
        // Validación básica
        if (!formData.title || !formData.patient || !formData.assignee) {
            alert("Por favor completa todos los campos requeridos")
            return
        }

        console.log("🎯 CreateTaskModal: Submitting form data:", formData)

        // Crear el evento
        onCreateEvent(formData)

        // Resetear el formulario
        setFormData({
            title: "",
            type: "todo",
            patient: "",
            facility: "watersprings",
            assignee: "",
            date: new Date().toISOString().split("T")[0],
            startTime: "09:00",
            endTime: "10:00",
            timezone: "America/New_York",
            description: "",
        })

        onClose()
    }

    const handleCancel = () => {
        // Resetear el formulario al cancelar
        setFormData({
            title: "",
            type: "todo",
            patient: "",
            facility: "watersprings",
            assignee: "",
            date: new Date().toISOString().split("T")[0],
            startTime: "09:00",
            endTime: "10:00",
            timezone: "America/New_York",
            description: "",
        })
        onClose()
    }

    // Contenido del modal
    const content = (
        <div className={classes.formContainer}>
            {/* Título y Tipo */}
            <Grid container spacing={2} className={classes.formRow}>
                <Grid item xs={8}>
                    <TextField
                        fullWidth
                        label="Event Title *"
                        value={formData.title}
                        onChange={handleInputChange("title")}
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Type</InputLabel>
                        <Select value={formData.type} onChange={handleInputChange("type")} label="Type">
                            <MenuItem value="todo">To Do</MenuItem>
                            <MenuItem value="consult">Consult</MenuItem>
                            <MenuItem value="review">Review</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Paciente y Facility */}
            <Grid container spacing={2} className={classes.formRow}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Patient *"
                        value={formData.patient}
                        onChange={handleInputChange("patient")}
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Facility</InputLabel>
                        <Select value={formData.facility} onChange={handleInputChange("facility")} label="Facility">
                            <MenuItem value="watersprings">Watersprings Senior Living</MenuItem>
                            <MenuItem value="oakview">Oakview Care Center</MenuItem>
                            <MenuItem value="pinegrove">Pine Grove Assisted Living</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Assignee */}
            <div className={classes.formRow}>
                <TextField
                    fullWidth
                    label="Assignee *"
                    value={formData.assignee}
                    onChange={handleInputChange("assignee")}
                    variant="outlined"
                    size="small"
                />
            </div>

            {/* Fecha */}
            <div className={classes.formRow}>
                <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange("date")}
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>

            {/* Horarios */}
            <div className={classes.formRow}>
                <Typography variant="subtitle2" gutterBottom>
                    Time
                </Typography>
                <div className={classes.timeRow}>
                    <TextField
                        className={classes.timeField}
                        label="Start Time"
                        type="time"
                        value={formData.startTime}
                        onChange={handleInputChange("startTime")}
                        variant="outlined"
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Typography variant="body2">to</Typography>
                    <TextField
                        className={classes.timeField}
                        label="End Time"
                        type="time"
                        value={formData.endTime}
                        onChange={handleInputChange("endTime")}
                        variant="outlined"
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>

            {/* Timezone */}
            <div className={classes.formRow}>
                <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Timezone</InputLabel>
                    <Select value={formData.timezone} onChange={handleInputChange("timezone")} label="Timezone">
                        <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                        <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                        <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                        <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                        <MenuItem value="UTC">UTC</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {/* Descripción */}
            <div className={classes.formRow}>
                <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange("description")}
                    variant="outlined"
                    size="small"
                    multiline
                    rows={3}
                />
            </div>
        </div>
    )

    // Acciones del modal
    const actions = (
        <div className={classes.buttonContainer}>
            <Button variant="outlined" className={classes.cancelButton} onClick={handleCancel}>
                Cancel
            </Button>
            <Button variant="contained" className={classes.createButton} onClick={handleSubmit}>
                Create Event
            </Button>
        </div>
    )

    // Título del modal
    const title = "Create New Event"

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={title}
            content={content}
            actions={actions}
            contentPadding="0"
            data-testid="create-event-dialog"
        />
    )
}
