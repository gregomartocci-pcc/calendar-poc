"use client"

import { Box, Paper, Typography } from "@material-ui/core"
import { makeStyles, createStyles, type Theme, ThemeProvider } from "@material-ui/core/styles"
import { theme } from "@evergreen/core"
import { useState } from "react"
import { Header } from "./components/Header/Header"

import { TaskProvider, useTaskContext } from "./contexts/TasksContext"


import CalendarView from "./components/CalendarView/CalendarView"
import { MUIKanbanBoard } from "./components/KanbanBoard/KanbanBoard"
import { TaskFilters } from "./components/TasksFilters/TasksFilters"
import { CreateTaskModal, EventFormData } from "./components/CreateTaskModal/CreateTaskModal"
import { Sidebar } from "./Siderbar/Sidebar"


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
    },
    content: {
      padding: theme.spacing(2, 3),
    },
    mainContent: {
      padding: theme.spacing(2),
    },
    contentLayout: {
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up("md")]: {
        flexDirection: "row",
      },
      gap: theme.spacing(3),
      width: "100%",
    },
    rightContent: {
      flex: 1,
      width: "100%",
    },
  }),
)

function AppContent() {
  const classes = useStyles()
  const [currentView, setCurrentView] = useState("calendar") // 🎯 CAMBIAR A CALENDAR PARA PROBAR
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const { addNewEvent } = useTaskContext()

  const handleViewChange = (view: string) => {
    console.log("Changing view to:", view)
    setCurrentView(view)
  }

  const handleCreateTodo = () => {
    console.log("Opening create event modal...")
    setCreateModalOpen(true)
  }

  const handleCloseModal = () => {
    setCreateModalOpen(false)
  }

  const handleCreateEvent = (eventData: EventFormData) => {
    console.log("🎯 App: Creating new event:", eventData)

    // Crear el task con la fecha programada
    const newTask = {
      id: `event-${Date.now()}-${Math.random()}`,
      title: eventData.title,
      type: eventData.type,
      patient: eventData.patient,
      facility: eventData.facility,
      assignee: eventData.assignee,
      scheduledDate: eventData.date, // 🎯 IMPORTANTE: FECHA PROGRAMADA
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      timezone: eventData.timezone,
      description: eventData.description,
    }

    console.log("🎯 App: New task object:", newTask)

    // 🎯 USAR FUNCIÓN DEL CONTEXTO
    addNewEvent(newTask)

    console.log(`✅ App: Event "${eventData.title}" created successfully!`)
    alert(`Event "${eventData.title}" created successfully!`)
  }

  const renderView = () => {
    switch (currentView) {
      case "board":
        return <MUIKanbanBoard />
      case "calendar":
        return <CalendarView />
      case "list":
        return (
          <Box style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h6">List View</Typography>
            <Typography>Lista de tareas pendiente de implementar</Typography>
          </Box>
        )
      default:
        return <MUIKanbanBoard />
    }
  }

  return (
    <Box className={classes.root}>
      {/* Header superior */}
      <Header />

      <Box className={classes.content}>
        <Paper elevation={1}>
          {/* Filtros con props para cambiar la vista */}
          <TaskFilters onCreateTodo={handleCreateTodo} onViewChange={handleViewChange} currentView={currentView} />

          <Box className={classes.mainContent}>
            <Box className={classes.contentLayout}>
              <Sidebar />
              <Box className={classes.rightContent}>{renderView()}</Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Modal para crear eventos */}
      <CreateTaskModal open={createModalOpen} onClose={handleCloseModal} onCreateEvent={handleCreateEvent} />
    </Box>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </ThemeProvider>
  )
}

export default App
