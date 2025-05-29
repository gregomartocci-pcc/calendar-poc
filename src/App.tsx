"use client"

import { Box, Paper, Typography, Button } from "@material-ui/core"
import { makeStyles, createStyles, type Theme, ThemeProvider } from "@material-ui/core/styles"
import { theme } from "@evergreen/core"
import { useState } from "react"
import { Header } from "./components/Header/Header"

import { TaskProvider } from "./contexts/TasksContext"
import { Sidebar } from "./Siderbar/Sidebar"
import { TaskFilters } from "./components/TasksFilters/TasksFilters"
import CalendarView from "./components/CalendarView/CalendarView"
import { MUIKanbanBoard } from "./components/KanbanBoard/KanbanBoard"

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
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing(2),
    },
    title: {
      fontWeight: "bold",
    },
    createButton: {
      backgroundColor: "#0e766e",
      color: "white",
      "&:hover": {
        backgroundColor: "#0c5e58",
      },
      textTransform: "uppercase",
      fontWeight: "bold",
      borderRadius: "4px",
    },
    tabContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #e1e5e9",
      backgroundColor: "transparent",
      padding: theme.spacing(0, 2),
    },
    tabsLeft: {
      display: "flex",
    },
    tab: {
      padding: theme.spacing(1.5, 3),
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: 500,
      textTransform: "uppercase",
      position: "relative",
      backgroundColor: "transparent",
      border: "none",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
      },
    },
    inactiveTab: {
      color: "#6c757d",
      backgroundColor: "transparent",
    },
    activeTab: {
      color: "#17a2b8",
      backgroundColor: "transparent",
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "3px",
        backgroundColor: "#17a2b8",
      },
    },
    viewSelector: {
      display: "flex",
      alignItems: "center",
      gap: "0px",
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      overflow: "hidden",
    },
    viewOption: {
      padding: theme.spacing(0.75, 2),
      fontSize: "14px",
      fontWeight: 400,
      cursor: "pointer",
      backgroundColor: "#ffffff",
      color: "#6c757d",
      border: "none",
      "&:hover": {
        backgroundColor: "#f8f9fa",
      },
    },
    borderOption: {
      borderLeft: "1px solid #d1d5db",
      borderRight: "1px solid #d1d5db",
    },
    activeViewOption: {
      backgroundColor: "#17a2b8",
      color: "#ffffff",
      "&:hover": {
        backgroundColor: "#138496",
      },
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
  const [currentView, setCurrentView] = useState("board") // Cambiado a "board" por defecto
  const [viewValue, setViewValue] = useState("board") // Estado para el selector de vista

  const handleViewChange = (view: string) => {
    setCurrentView(view)
    setViewValue(view)
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
      <Box className={classes.root}>
        {/* Header superior */}
        <Header />

        {/* MainNavigation debajo del header */}

        <Box className={classes.content}>

          <Paper elevation={1}>
            <Box className={classes.tabContainer}>
              <Box className={classes.tabsLeft}>
                <Box className={`${classes.tab} ${classes.inactiveTab}`}>Team</Box>
                <Box className={`${classes.tab} ${classes.activeTab}`}>Clinical</Box>
              </Box>

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
            </Box>

            <Box className={classes.mainContent}>
              <TaskProvider>
                <Box className={classes.contentLayout}>
                  <Sidebar />
                  <Box className={classes.rightContent}>

                    {renderView()}
                  </Box>
                </Box>
              </TaskProvider>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
