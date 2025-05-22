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
    makeStyles,
    createStyles,
    type Theme,
} from "@material-ui/core"
import { Close as CloseIcon } from "@material-ui/icons"
import { TaskType, useTaskContext } from "../../contexts/TasksContext"


// Definir interfaces para los eventos
interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
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
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            overflow: "hidden",
        },
        viewOption: {
            padding: theme.spacing(1, 2),
            cursor: "pointer",
        },
        activeViewOption: {
            backgroundColor: "#0e766e",
            color: "white",
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
        borderOption: {
            borderLeft: "1px solid #e0e0e0",
            borderRight: "1px solid #e0e0e0",
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

export function TaskFilters() {
    const classes = useStyles()
    const { scheduledTasks } = useTaskContext()
    const [tabValue, setTabValue] = useState<number>(1)
    const [viewValue, setViewValue] = useState<string>("calendar")
    const [facility, setFacility] = useState<string>("watersprings")
    const [dueDate, setDueDate] = useState<string>("all")
    const [assignees, setAssignees] = useState<string[]>(["Me", "Practitioner"])
    const [taskType, setTaskType] = useState<TaskType | "">("")

    // Implementamos filterTasks localmente ya que no está en el contexto
    const filterTasks = (type?: TaskType, assignee?: string, facility?: string) => {
        console.log(`Filtering tasks by type: ${type}, assignee: ${assignee}, facility: ${facility}`)
        // Aquí implementarías la lógica de filtrado real
    }

    const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number): void => {
        setTabValue(newValue)
    }

    const handleViewChange = (view: string): void => {
        setViewValue(view)
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

    return (
        <div className={classes.root}>
            <div className={classes.tabsContainer}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="team tabs" className={classes.tabs}>
                    <Tab label="TEAM" {...a11yProps(0)} className={`${classes.tab} ${tabValue === 0 ? classes.activeTab : ""}`} />
                    <Tab
                        label="PERSONAL"
                        {...a11yProps(1)}
                        className={`${classes.tab} ${tabValue === 1 ? classes.activeTab : ""}`}
                    />
                </Tabs>

                <div className={classes.viewSelector}>
                    <div
                        className={`${classes.viewOption} ${viewValue === "list" ? classes.activeViewOption : ""}`}
                        onClick={() => handleViewChange("list")}
                    >
                        List
                    </div>
                    <div
                        className={`${classes.viewOption} ${classes.borderOption} ${viewValue === "board" ? classes.activeViewOption : ""}`}
                        onClick={() => handleViewChange("board")}
                    >
                        Board
                    </div>
                    <div
                        className={`${classes.viewOption} ${viewValue === "calendar" ? classes.activeViewOption : ""}`}
                        onClick={() => handleViewChange("calendar")}
                    >
                        Calendar
                    </div>
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
