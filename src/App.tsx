"use client"

import { Box, Paper, Typography } from "@material-ui/core"
import { makeStyles, createStyles, type Theme, ThemeProvider } from "@material-ui/core/styles"
import { theme } from "@evergreen/core"
import { useState } from "react"
import { Header } from "./components/Header/Header"

import { TaskProvider } from "./contexts/TasksContext"
import { Sidebar } from "./Siderbar/Sidebar"

import CalendarView from "./components/CalendarView/CalendarView"
import { MUIKanbanBoard } from "./components/KanbanBoard/KanbanBoard"
import { TaskFilters } from "./components/TaskFilters/TaskFilters"

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

function App() {
  const classes = useStyles()
  const [currentView, setCurrentView] = useState("board")

  const handleViewChange = (view: string) => {
    console.log("Changing view to:", view)
    setCurrentView(view)
  }

  const handleCreateTodo = () => {
    console.log("Creating new TO DO...")
    // Aquí puedes agregar la lógica para crear una nueva tarea
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
    <ThemeProvider theme={theme}>
      <TaskProvider>
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
        </Box>
      </TaskProvider>
    </ThemeProvider>
  )
}

export default App
