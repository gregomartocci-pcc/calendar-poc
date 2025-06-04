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
  Button,
  makeStyles,
  createStyles,
  type Theme,
} from "@material-ui/core"
import { Typography } from "@evergreen/core"
import { Close as CloseIcon } from "@material-ui/icons"
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

// Crear estilos con makeStyles - CORRIGIENDO EL LAYOUT
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(3),
    },
    topRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #e0e0e0",
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    tabs: {
      "& .MuiTabs-indicator": {
        backgroundColor: "#0e766e",
        height: "2px",
      },
      minHeight: "48px",
    },
    tab: {
      fontWeight: 500,
      color: "#6B7280",
      minHeight: "48px",
      padding: theme.spacing(0, 3),
      textTransform: "none",
      fontSize: "14px",
      letterSpacing: "0.5px",
      "&.Mui-selected": {
        color: "#0e766e",
        fontWeight: 600,
      },
    },
    viewButtons: {
      display: "flex",
      backgroundColor: "white",
      borderRadius: "25px",
      border: "1px solid #d1d5db",
      overflow: "hidden",
      height: "32px", // Reducido de 40px a 32px para ser más sutil
    },
    viewButton: {
      flex: 1,
      minWidth: "70px",
      padding: theme.spacing(0.5, 2), // Reducido el padding vertical de 1 a 0.5
      fontSize: "13px",
      textTransform: "none",
      borderRadius: "0", // Sin bordes redondeados individuales
      border: "none",
      backgroundColor: "transparent",
      color: "#6B7280",
      margin: "0", // Sin margen
      "&:hover": {
        backgroundColor: "rgba(14, 118, 110, 0.05)",
      },
      // Solo el primer botón tiene borde izquierdo redondeado
      "&:first-child": {
        borderTopLeftRadius: "25px",
        borderBottomLeftRadius: "25px",
      },
      // Solo el último botón tiene borde derecho redondeado
      "&:last-child": {
        borderTopRightRadius: "25px",
        borderBottomRightRadius: "25px",
      },
    },
    activeViewButton: {
      backgroundColor: "#C9EBEE", // Verde teal más intenso
      color: "#05576F", // Texto blanco para mejor contraste
      fontWeight: 700,
      "&:hover": {
        backgroundColor: "#0f766e", // Verde más oscuro en hover
      },
    },
    // 🎯 FILA DE FILTROS CON CREATE BUTTON
    filtersRow: {
      display: "flex",
      gap: theme.spacing(2),
      alignItems: "flex-end",
      justifyContent: "space-between", // Para separar filtros del botón
      paddingLeft: theme.spacing(3), // 🎯 PADDING IZQUIERDO
      paddingRight: theme.spacing(3), // 🎯 PADDING DERECHO
      paddingTop: theme.spacing(3), // 🎯 AGREGAR ESPACIO SUPERIOR
      paddingBottom: theme.spacing(2), // Un poco de espacio abajo
    },
    filtersSection: {
      display: "flex",
      gap: theme.spacing(2),
      alignItems: "flex-end",
      flex: 1,
    },
    filterGroup: {
      minWidth: "200px",
    },
    filterLabel: {
      marginBottom: theme.spacing(0.5),
      display: "block",
      color: theme.palette.text.secondary,
      fontSize: "12px",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    select: {
      backgroundColor: "white",
      height: "40px",
      "& .MuiSelect-select": {
        padding: theme.spacing(1, 1.5),
        paddingLeft: theme.spacing(2), // 🎯 MÁS PADDING A LA IZQUIERDA
      },
    },
    chipContainer: {
      display: "flex",
      gap: theme.spacing(0.5),
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(2), // 🎯 MÁS PADDING A LA IZQUIERDA
      backgroundColor: "white",
      minHeight: "40px",
      alignItems: "center",
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
    },
    chip: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      height: "24px",
    },
    createButton: {
      backgroundColor: "#05576F",
      color: "white",
      padding: theme.spacing(1, 3),
      fontSize: "14px",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      height: "40px",
      flexShrink: 0,
      "&:hover": {
        backgroundColor: "#0d5d56",
      },
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
      {value === index && <Box>{children}</Box>}
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
  const [tabValue, setTabValue] = useState<number>(1) // PERSONAL por defecto
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

  return (
    <div className={classes.root}>
      {/* 🎯 PRIMERA FILA: SOLO TABS + VIEW SELECTOR */}
      <div className={classes.topRow}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="task filter tabs" className={classes.tabs}>
          <Tab label={<Typography variant="body2">TEAM</Typography>} {...a11yProps(0)} className={classes.tab} />
          <Tab label={<Typography variant="body2">PERSONAL</Typography>} {...a11yProps(1)} className={classes.tab} />
        </Tabs>

        {/* SOLO VIEW SELECTOR BUTTONS - SIN CREATE BUTTON */}
        <div className={classes.viewButtons}>
          <Button
            className={`${classes.viewButton} ${currentView === "list" ? classes.activeViewButton : ""}`}
            onClick={() => onViewChange("list")}
          >
            <Typography variant="body2">List</Typography>
          </Button>
          <Button
            className={`${classes.viewButton} ${currentView === "board" ? classes.activeViewButton : ""}`}
            onClick={() => onViewChange("board")}
          >
            <Typography variant="body2">Board</Typography>
          </Button>
          <Button
            className={`${classes.viewButton} ${currentView === "calendar" ? classes.activeViewButton : ""}`}
            onClick={() => onViewChange("calendar")}
          >
            <Typography variant="body2">Calendar</Typography>
          </Button>
        </div>
      </div>

      {/* CONTENIDO DE LOS TABS */}
      <TabPanel value={tabValue} index={0}>
        {/* TEAM TAB - 🎯 SEGUNDA FILA: FILTROS + CREATE BUTTON */}
        <div className={classes.filtersRow}>
          <div className={classes.filtersSection}>
            <div className={classes.filterGroup}>
              <Typography variant="caption.medium" className={classes.filterLabel}>
                Facilities
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={facility} onChange={handleFacilityChange} displayEmpty className={classes.select}>
                  <MenuItem value="watersprings">
                    <Typography variant="body2">Watersprings Senior Living</Typography>
                  </MenuItem>
                  <MenuItem value="oakview">
                    <Typography variant="body2">Oakview Care Center</Typography>
                  </MenuItem>
                  <MenuItem value="pinegrove">
                    <Typography variant="body2">Pine Grove Assisted Living</Typography>
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className={classes.filterGroup}>
              <Typography variant="caption.medium" className={classes.filterLabel}>
                Assignee
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  multiple
                  value={assignees}
                  onChange={(event) => {
                    const value = event.target.value as string[]
                    setAssignees(value)
                    filterTasks((taskType as TaskType) || undefined, value[0], facility)
                  }}
                  displayEmpty
                  className={classes.select}
                  renderValue={(selected) => (
                    <div className={classes.chipContainer} style={{ border: "none", padding: 0, minHeight: "auto" }}>
                      {(selected as string[]).map((value) => (
                        <Chip
                          key={value}
                          label={<Typography variant="caption">{value}</Typography>}
                          size="small"
                          onDelete={() => handleRemoveAssignee(value)}
                          deleteIcon={<CloseIcon fontSize="small" />}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                >
                  <MenuItem value="Me">
                    <Typography variant="body2">Me</Typography>
                  </MenuItem>
                  <MenuItem value="Practitioner">
                    <Typography variant="body2">Practitioner</Typography>
                  </MenuItem>
                  <MenuItem value="Dr. Smith">
                    <Typography variant="body2">Dr. Smith</Typography>
                  </MenuItem>
                  <MenuItem value="Nurse Johnson">
                    <Typography variant="body2">Nurse Johnson</Typography>
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className={classes.filterGroup}>
              <Typography variant="caption.medium" className={classes.filterLabel}>
                Due Date
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={dueDate} onChange={handleDueDateChange} displayEmpty className={classes.select}>
                  <MenuItem value="all">
                    <Typography variant="body2">All</Typography>
                  </MenuItem>
                  <MenuItem value="today">
                    <Typography variant="body2">Today</Typography>
                  </MenuItem>
                  <MenuItem value="tomorrow">
                    <Typography variant="body2">Tomorrow</Typography>
                  </MenuItem>
                  <MenuItem value="this-week">
                    <Typography variant="body2">This Week</Typography>
                  </MenuItem>
                  <MenuItem value="next-week">
                    <Typography variant="body2">Next Week</Typography>
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {/* 🎯 CREATE BUTTON EN LA SEGUNDA FILA */}
          <Button variant="contained" className={classes.createButton} onClick={onCreateTodo}>
            <Typography variant="button">CREATE TO DO</Typography>
          </Button>
        </div>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* PERSONAL TAB - 🎯 SEGUNDA FILA: FILTROS + CREATE BUTTON */}
        <div className={classes.filtersRow}>
          <div className={classes.filtersSection}>
            <div className={classes.filterGroup}>
              <Typography variant="caption.medium" className={classes.filterLabel}>
                Facilities
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={facility} onChange={handleFacilityChange} displayEmpty className={classes.select}>
                  <MenuItem value="watersprings">
                    <Typography variant="body2">Watersprings Senior Living</Typography>
                  </MenuItem>
                  <MenuItem value="oakview">
                    <Typography variant="body2">Oakview Care Center</Typography>
                  </MenuItem>
                  <MenuItem value="pinegrove">
                    <Typography variant="body2">Pine Grove Assisted Living</Typography>
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className={classes.filterGroup}>
              <Typography variant="caption.medium" className={classes.filterLabel}>
                Assignee
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  multiple
                  value={assignees}
                  onChange={(event) => {
                    const value = event.target.value as string[]
                    setAssignees(value)
                    filterTasks((taskType as TaskType) || undefined, value[0], facility)
                  }}
                  displayEmpty
                  className={classes.select}
                  renderValue={(selected) => (
                    <div className={classes.chipContainer} style={{ border: "none", padding: 0, minHeight: "auto" }}>
                      {(selected as string[]).map((value) => (
                        <Chip
                          key={value}
                          label={<Typography variant="caption">{value}</Typography>}
                          size="small"
                          onDelete={() => handleRemoveAssignee(value)}
                          deleteIcon={<CloseIcon fontSize="small" />}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                >
                  <MenuItem value="Me">
                    <Typography variant="body2">Me</Typography>
                  </MenuItem>
                  <MenuItem value="Practitioner">
                    <Typography variant="body2">Practitioner</Typography>
                  </MenuItem>
                  <MenuItem value="Dr. Smith">
                    <Typography variant="body2">Dr. Smith</Typography>
                  </MenuItem>
                  <MenuItem value="Nurse Johnson">
                    <Typography variant="body2">Nurse Johnson</Typography>
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className={classes.filterGroup}>
              <Typography variant="caption.medium" className={classes.filterLabel}>
                Due Date
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={dueDate} onChange={handleDueDateChange} displayEmpty className={classes.select}>
                  <MenuItem value="all">
                    <Typography variant="body2">All</Typography>
                  </MenuItem>
                  <MenuItem value="today">
                    <Typography variant="body2">Today</Typography>
                  </MenuItem>
                  <MenuItem value="tomorrow">
                    <Typography variant="body2">Tomorrow</Typography>
                  </MenuItem>
                  <MenuItem value="this-week">
                    <Typography variant="body2">This Week</Typography>
                  </MenuItem>
                  <MenuItem value="next-week">
                    <Typography variant="body2">Next Week</Typography>
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {/* 🎯 CREATE BUTTON EN LA SEGUNDA FILA */}
          <Button variant="contained" className={classes.createButton} onClick={onCreateTodo}>
            <Typography variant="button" >CREATE TO DO</Typography>
          </Button>
        </div>
      </TabPanel>
    </div>
  )
}
