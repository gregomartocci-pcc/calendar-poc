"use client"

import type React from "react"
import { useState } from "react"
import {
    Box,
    Chip,
    FormControl,
    MenuItem,
    Select,
    Tabs,
    Tab,
    Typography,
    Paper,
    Button,
    makeStyles,
    createStyles,
    type Theme,
} from "@material-ui/core"
import { Close as CloseIcon, Add as AddIcon } from "@material-ui/icons"
import { type TaskType, useTaskContext } from "../../contexts/TasksContext"

// Definir interfaces para los eventos
interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

// Agregar las props que necesita el componente
type TaskFiltersProps = {
    onCreateTodo: () => void
    onViewChange: (view: string) => void
    currentView: string
}

// Crear estilos con makeStyles
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginBottom: theme.spacing(3),
        },
        tabsContainer: {
            display: "flex",
            flexDirection: "column",
            [theme.breakpoints.up("md")]: {
                flexDirection: "row",
            },
            justifyContent: "space-between",
            alignItems: "flex-start",
            [theme.breakpoints.up("md")]: {
                alignItems: "center",
            },
            marginBottom: theme.spacing(2),
            gap: theme.spacing(2),
            borderBottom: "1px solid #e0e0e0",
            paddingBottom: theme.spacing(1),
        },
        tabs: {
            "& .MuiTabs-indicator": {
                backgroundColor: "#0e766e",
                height: "3px",
            },
            minHeight: "36px",
        },
        tab: {
            fontWeight: "bold",
            color: "inherit",
            minHeight: "36px",
            padding: theme.spacing(0, 2),
        },
        activeTab: {
            color: "#0e766e",
        },
        viewSelector: {
            display: "flex",
            gap: theme.spacing(1),
            alignItems: "center",
        },
        viewButton: {
            minWidth: "auto",
            padding: theme.spacing(0.5, 1),
            fontSize: "12px",
        },
        createButton: {
            backgroundColor: "#0e766e",
            color: "white",
            "&:hover": {
                backgroundColor: "#0d5d56",
            },
        },
        filtersGrid: {
            display: "grid",
            gridTemplateColumns: "1fr",
            [theme.breakpoints.up("md")]: {
                gridTemplateColumns: "1fr 1fr 1fr",
            },
            gap: theme.spacing(2),
            marginBottom: theme.spacing(2),
        },
        filterLabel: {
            marginBottom: theme.spacing(0.5),
            display: "block",
            color: theme.palette.text.secondary,
        },
        select: {
            backgroundColor: "white",
            height: "36px",
        },
        chipContainer: {
            display: "flex",
            gap: theme.spacing(1),
            padding: theme.spacing(1),
            backgroundColor: "white",
            minHeight: "36px",
            alignItems: "center",
        },
        chip: {
            backgroundColor: "#f3f4f6",
            color: "#374151",
        },
    }),
)

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`task-tabpanel-${index}`}
            aria-labelledby={`task-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={1}>{children}</Box>}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `task-tab-${index}`,
        "aria-controls": `task-tabpanel-${index}`,
    }
}

export function TaskFilters({ onCreateTodo, onViewChange, currentView }: TaskFiltersProps) {
    const classes = useStyles()
    const { scheduledTasks, filterTasks } = useTaskContext()
    const [tabValue, setTabValue] = useState<number>(1)
    const [facility, setFacility] = useState<string>("watersprings")
    const [dueDate, setDueDate] = useState<string>("all")
    const [assignees, setAssignees] = useState<string[]>(["Me", "Practitioner"])
    const [taskType, setTaskType] = useState<TaskType | "">("")

    const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number): void => {
        setTabValue(newValue)
    }

    const handleFacilityChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
        const value = event.target.value as string
        setFacility(value)
        filterTasks((taskType as TaskType) || undefined, assignees[0], value)
    }

    const handleDueDateChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
        setDueDate(event.target.value as string)
    }

    const handleRemoveAssignee = (assigneeToRemove: string): void => {
        const newAssignees = assignees.filter((assignee) => assignee !== assigneeToRemove)
        setAssignees(newAssignees)
        filterTasks((taskType as TaskType) || undefined, newAssignees[0], facility)
    }

    const handleTaskTypeChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
        const value = event.target.value as TaskType | ""
        setTaskType(value)
        filterTasks(value || undefined, assignees[0], facility)
    }

    const handleViewChange = (view: string) => {
        onViewChange(view)
    }

    return (
        <div className={classes.root}>
            <div className={classes.tabsContainer}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="task filter tabs" className={classes.tabs}>
                    <Tab label="All Tasks" {...a11yProps(0)} className={classes.tab} />
                    <Tab label="My Tasks" {...a11yProps(1)} className={classes.tab} />
                </Tabs>

                {/* Selector de vista y botón crear */}
                <div className={classes.viewSelector}>
                    <Button
                        variant={currentView === "list" ? "contained" : "outlined"}
                        size="small"
                        className={classes.viewButton}
                        onClick={() => handleViewChange("list")}
                    >
                        List
                    </Button>
                    <Button
                        variant={currentView === "board" ? "contained" : "outlined"}
                        size="small"
                        className={classes.viewButton}
                        onClick={() => handleViewChange("board")}
                    >
                        Board
                    </Button>
                    <Button
                        variant={currentView === "calendar" ? "contained" : "outlined"}
                        size="small"
                        className={classes.viewButton}
                        onClick={() => handleViewChange("calendar")}
                    >
                        Calendar
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        className={`${classes.viewButton} ${classes.createButton}`}
                        startIcon={<AddIcon />}
                        onClick={onCreateTodo}
                    >
                        Create TO DO
                    </Button>
                </div>
            </div>

            <TabPanel value={tabValue} index={0}>
                <div className={classes.filtersGrid}>
                    <div>
                        <Typography variant="caption" className={classes.filterLabel}>
                            Facilities
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select value={facility} onChange={handleFacilityChange} displayEmpty className={classes.select}>
                                <MenuItem value="watersprings">Watersprings Senior Living</MenuItem>
                                <MenuItem value="oakview">Oakview Care Center</MenuItem>
                                <MenuItem value="pinegrove">Pine Grove Assisted Living</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div>
                        <Typography variant="caption" className={classes.filterLabel}>
                            Task Type
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select value={taskType} onChange={handleTaskTypeChange} displayEmpty className={classes.select}>
                                <MenuItem value="">All Types</MenuItem>
                                <MenuItem value="todo">To Do</MenuItem>
                                <MenuItem value="consult">Consult</MenuItem>
                                <MenuItem value="review">Review</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div>
                        <Typography variant="caption" className={classes.filterLabel}>
                            Due Date
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select value={dueDate} onChange={handleDueDateChange} displayEmpty className={classes.select}>
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="today">Today</MenuItem>
                                <MenuItem value="tomorrow">Tomorrow</MenuItem>
                                <MenuItem value="this-week">This Week</MenuItem>
                                <MenuItem value="next-week">Next Week</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <div className={classes.filtersGrid}>
                    <div>
                        <Typography variant="caption" className={classes.filterLabel}>
                            Facilities
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select value={facility} onChange={handleFacilityChange} displayEmpty className={classes.select}>
                                <MenuItem value="watersprings">Watersprings Senior Living</MenuItem>
                                <MenuItem value="oakview">Oakview Care Center</MenuItem>
                                <MenuItem value="pinegrove">Pine Grove Assisted Living</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div>
                        <Typography variant="caption" className={classes.filterLabel}>
                            Assignee
                        </Typography>
                        <Paper variant="outlined" className={classes.chipContainer}>
                            {assignees.map((assignee) => (
                                <Chip
                                    key={assignee}
                                    label={assignee}
                                    size="small"
                                    onDelete={() => handleRemoveAssignee(assignee)}
                                    deleteIcon={<CloseIcon fontSize="small" />}
                                    className={classes.chip}
                                />
                            ))}
                        </Paper>
                    </div>

                    <div>
                        <Typography variant="caption" className={classes.filterLabel}>
                            Due Date
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select value={dueDate} onChange={handleDueDateChange} displayEmpty className={classes.select}>
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="today">Today</MenuItem>
                                <MenuItem value="tomorrow">Tomorrow</MenuItem>
                                <MenuItem value="this-week">This Week</MenuItem>
                                <MenuItem value="next-week">Next Week</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </TabPanel>
        </div>
    )
}
