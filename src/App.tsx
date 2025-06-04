"use client"

import { Box, Paper, Typography } from "@material-ui/core"
import { makeStyles, createStyles, type Theme, ThemeProvider } from "@material-ui/core/styles"
import { theme } from "@evergreen/core"
import { useState } from "react"
import { Header } from "./components/Header/Header"

import { TaskProvider, useTaskContext } from "./contexts/TasksContext"

import { MUIKanbanBoard } from "./components/KanbanBoard/KanbanBoard"
import { TaskFilters } from "./components/TasksFilters/TasksFilters"
import { CreateTaskModal, type EventFormData } from "./components/CreateTaskModal/CreateTaskModal"

import { Sidebar } from "./Sidebar/Sidebar"
import CalendarView from "./components/CalendarView/CalendarView"

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
  const [currentView, setCurrentView] = useState("calendar")
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { addNewEvent, scheduledTasks, moveTaskToCalendar, deleteEvent, moveEventToSidebar } = useTaskContext()

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

    const newTask = {
      id: `event-${Date.now()}-${Math.random()}`,
      title: eventData.title,
      type: eventData.type,
      patient: eventData.patient,
      facility: eventData.facility,
      assignee: eventData.assignee,
      scheduledDate: (() => {
        const [year, month, day] = eventData.date.split("-").map(Number)
        return new Date(year, month - 1, day)
      })(),
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      timezone: eventData.timezone,
      description: eventData.description,
    }

    console.log("🎯 App: New task object:", newTask)
    addNewEvent(newTask)
    console.log(`✅ App: Event "${eventData.title}" created successfully!`)
    // 🛠️ QUITAR ALERT AQUÍ TAMBIÉN
    // alert(`Event "${eventData.title}" created successfully!`)
  }

  // Manejar cuando se arrastra una tarea al calendario
  const handleTaskDropOnCalendar = (task: any, newDate: Date) => {
    console.log("🎯 App: Task dropped on calendar:", task, "to date:", newDate)

    if (moveTaskToCalendar) {
      moveTaskToCalendar(task.id, newDate)
      console.log(`✅ App: Task "${task.title}" moved to ${newDate.toDateString()}`)
    }
  }

  // Manejar cuando se mueve una tarea ya programada en el calendario
  const handleEventMoveInCalendar = (event: any, newDate: Date) => {
    console.log("🎯 App: Event moved in calendar:", event, "to date:", newDate)

    if (moveTaskToCalendar) {
      moveTaskToCalendar(event.id, newDate)
      console.log(`✅ App: Event "${event.title}" moved to ${newDate.toDateString()}`)
    }
  }

  // 🎯 NUEVA FUNCIÓN: Manejar cuando un evento se arrastra del calendario al sidebar
  const handleEventDragToSidebar = (event: any) => {
    console.log("🎯 App: Event dragged from calendar to sidebar:", event)

    if (moveEventToSidebar) {
      moveEventToSidebar(event.id)
      console.log(`✅ App: Event "${event.title}" unscheduled and moved back to sidebar`)
      // 🛠️ QUITAR ALERT MOLESTO
      // alert(`Event "${event.title}" has been unscheduled and moved back to the sidebar`)
    }
  }

  // Manejar cuando se hace clic en una fecha para agregar un evento
  const handleAddEvent = (date: Date) => {
    setSelectedDate(date)
    setCreateModalOpen(true)
  }

  const renderView = () => {
    switch (currentView) {
      case "board":
        return <MUIKanbanBoard />
      case "calendar":
        return (
          <CalendarView
            events={scheduledTasks.map((task) => ({
              id: task.id,
              title: task.title,
              date: task.scheduledDate || new Date(),
              time: task.startTime,
              type: task.type,
              patient: task.patient,
              facility: task.facility,
              assignee: task.assignee,
              description: task.description,
              startTime: task.startTime,
              endTime: task.endTime,
            }))}
            onEventDrop={handleEventMoveInCalendar}
            onTaskDrop={handleTaskDropOnCalendar}
            onAddEvent={handleAddEvent}
            onEventDragToSidebar={handleEventDragToSidebar}
          />
        )
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
      <Header />

      <Box className={classes.content}>
        <Paper elevation={1}>
          <TaskFilters onCreateTodo={handleCreateTodo} onViewChange={handleViewChange} currentView={currentView} />

          <Box className={classes.mainContent}>
            <Box className={classes.contentLayout}>
              <Sidebar />
              <Box className={classes.rightContent}>{renderView()}</Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      <CreateTaskModal
        open={createModalOpen}
        onClose={handleCloseModal}
        onCreateEvent={handleCreateEvent}
        initialDate={selectedDate ? selectedDate.toISOString().split("T")[0] : undefined}
      />
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
