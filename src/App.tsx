import { Box, Paper, Typography, Button } from "@material-ui/core"
import { makeStyles, createStyles, type Theme } from "@material-ui/core/styles"
import { Header } from "./components/Header/Header"
import { Navigation } from "./components/Navigation/Navigation"

import { CalendarView } from "./components/CalendarView/CalendarView"
import { TaskProvider } from "./contexts/TasksContext"
import { Sidebar } from "./Siderbar/Sidebar"
import { TaskFilters } from "./components/TasksFilters/TasksFilters"


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
    },
    tab: {
      padding: theme.spacing(1.5),
    },
    inactiveTab: {
      backgroundColor: "#e5e7eb",
      color: "#4b5563",
    },
    activeTab: {
      backgroundColor: "#0e766e",
      color: "white",
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

  return (
    <Box className={classes.root}>
      <Header />
      <Navigation />

      <Box className={classes.content}>
        <Box className={classes.header}>
          <Typography variant="h5" className={classes.title}>
            To Do Dashboard
          </Typography>

          <Button variant="contained" className={classes.createButton}>
            CREATE TO DO
          </Button>
        </Box>

        <Paper elevation={1}>
          <Box className={classes.tabContainer}>
            <Box className={`${classes.tab} ${classes.inactiveTab}`}>Clinical Dashboard</Box>
            <Box className={`${classes.tab} ${classes.activeTab}`}>To Do Dashboard</Box>
          </Box>

          <Box className={classes.mainContent}>
            <TaskProvider>
              <Box className={classes.contentLayout}>
                <Sidebar />
                <Box className={classes.rightContent}>
                  <TaskFilters />
                  <CalendarView />
                </Box>
              </Box>
            </TaskProvider>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default App
