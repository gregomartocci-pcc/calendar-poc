"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Chip,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Button,
  makeStyles,
  createStyles,
  type Theme,
} from "@material-ui/core"
import { Close as CloseIcon, KeyboardArrowDown } from "@material-ui/icons"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #e5e7eb",
    },
    tabsRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing(2, 3, 1, 3),
      borderBottom: "1px solid #e5e7eb",
    },
    tabsLeft: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(4),
    },
    tab: {
      fontSize: "14px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      cursor: "pointer",
      padding: theme.spacing(1, 0),
      position: "relative",
      "&:hover": {
        color: "#374151",
      },
    },
    inactiveTab: {
      color: "#9ca3af",
    },
    activeTab: {
      color: "#1f2937",
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: "-9px",
        left: 0,
        right: 0,
        height: "2px",
        backgroundColor: "#0891b2",
      },
    },
    viewSelector: {
      display: "flex",
      alignItems: "center",
      gap: "0px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      overflow: "hidden",
      backgroundColor: "#ffffff",
    },
    viewOption: {
      padding: theme.spacing(0.75, 2),
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
      backgroundColor: "#ffffff",
      color: "#6b7280",
      border: "none",
      "&:hover": {
        backgroundColor: "#f9fafb",
      },
    },
    borderOption: {
      borderLeft: "1px solid #d1d5db",
      borderRight: "1px solid #d1d5db",
    },
    activeViewOption: {
      backgroundColor: "#0891b2",
      color: "#ffffff",
      "&:hover": {
        backgroundColor: "#0e7490",
      },
    },
    filtersRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      padding: theme.spacing(2.5, 3),
      gap: theme.spacing(4),
    },
    filtersLeft: {
      display: "flex",
      alignItems: "flex-end",
      gap: theme.spacing(3),
    },
    filterGroup: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(0.75),
    },
    filterLabel: {
      fontSize: "13px",
      fontWeight: 500,
      color: "#6b7280",
      marginBottom: theme.spacing(0.5),
      lineHeight: 1,
    },
    select: {
      minWidth: 220,
      "& .MuiOutlinedInput-root": {
        backgroundColor: "white",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        height: "42px",
        "& fieldset": {
          border: "none",
        },
        "&:hover": {
          borderColor: "#9ca3af",
        },
        "&.Mui-focused": {
          borderColor: "#6366f1",
          boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
        },
      },
      "& .MuiSelect-select": {
        fontSize: "14px",
        color: "#374151",
        padding: "11px 14px",
        display: "flex",
        alignItems: "center",
        fontWeight: 400,
      },
      "& .MuiSelect-icon": {
        color: "#6b7280",
        right: "12px",
      },
    },
    assigneeContainer: {
      display: "flex",
      gap: theme.spacing(1),
      alignItems: "center",
      minHeight: "42px",
      padding: "8px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      backgroundColor: "white",
      minWidth: 220,
      "&:hover": {
        borderColor: "#9ca3af",
      },
      "&:focus-within": {
        borderColor: "#6366f1",
        boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
      },
    },
    chip: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      fontSize: "13px",
      height: "26px",
      borderRadius: "13px",
      "& .MuiChip-label": {
        paddingLeft: "10px",
        paddingRight: "6px",
        fontWeight: 500,
      },
      "& .MuiChip-deleteIcon": {
        color: "#9ca3af",
        fontSize: "16px",
        marginRight: "4px",
        "&:hover": {
          color: "#6b7280",
        },
      },
    },
    createButton: {
      backgroundColor: "#0f766e",
      color: "white",
      fontWeight: 700,
      fontSize: "13px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      padding: theme.spacing(1.5, 3),
      borderRadius: "6px",
      minWidth: 160,
      height: "42px",
      "&:hover": {
        backgroundColor: "#0d5d56",
      },
      "&:focus": {
        boxShadow: "0 0 0 3px rgba(15, 118, 110, 0.2)",
      },
    },
  }),
)

interface TaskFiltersProps {
  onCreateTodo?: () => void
  onViewChange?: (view: string) => void
  currentView?: string
}

export function TaskFilters({ onCreateTodo, onViewChange, currentView = "board" }: TaskFiltersProps) {
  const classes = useStyles()
  const [activeTab, setActiveTab] = useState<string>("personal")
  const [facility, setFacility] = useState<string>("watersprings")
  const [dueDate, setDueDate] = useState<string>("all")
  const [assignees, setAssignees] = useState<string[]>(["Me", "Practitioner"])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleViewChange = (view: string) => {
    onViewChange?.(view)
  }

  const handleFacilityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFacility(event.target.value as string)
  }

  const handleDueDateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDueDate(event.target.value as string)
  }

  const handleRemoveAssignee = (assigneeToRemove: string) => {
    setAssignees(assignees.filter((assignee) => assignee !== assigneeToRemove))
  }

  const handleCreateTodo = () => {
    console.log("Create TO DO clicked")
    onCreateTodo?.()
  }

  return (
    <Box className={classes.root}>
      {/* Tabs Row */}
      <Box className={classes.tabsRow}>
        <Box className={classes.tabsLeft}>
          <Typography
            className={`${classes.tab} ${activeTab === "team" ? classes.activeTab : classes.inactiveTab}`}
            onClick={() => handleTabChange("team")}
          >
            Team
          </Typography>
          <Typography
            className={`${classes.tab} ${activeTab === "personal" ? classes.activeTab : classes.inactiveTab}`}
            onClick={() => handleTabChange("personal")}
          >
            Personal
          </Typography>
        </Box>

        <Box className={classes.viewSelector}>
          <Box
            className={`${classes.viewOption} ${currentView === "list" ? classes.activeViewOption : ""}`}
            onClick={() => handleViewChange("list")}
          >
            List
          </Box>
          <Box
            className={`${classes.viewOption} ${classes.borderOption} ${currentView === "board" ? classes.activeViewOption : ""}`}
            onClick={() => handleViewChange("board")}
          >
            Board
          </Box>
          <Box
            className={`${classes.viewOption} ${currentView === "calendar" ? classes.activeViewOption : ""}`}
            onClick={() => handleViewChange("calendar")}
          >
            Calendar
          </Box>
        </Box>
      </Box>

      {/* Filters Row */}
      <Box className={classes.filtersRow}>
        <Box className={classes.filtersLeft}>
          {/* Facilities Filter */}
          <Box className={classes.filterGroup}>
            <Typography className={classes.filterLabel}>Facilities</Typography>
            <FormControl className={classes.select} variant="outlined">
              <Select value={facility} onChange={handleFacilityChange} displayEmpty IconComponent={KeyboardArrowDown}>
                <MenuItem value="watersprings">Watersprings Senior Living</MenuItem>
                <MenuItem value="oakview">Oakview Care Center</MenuItem>
                <MenuItem value="pinegrove">Pine Grove Assisted Living</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Assignee Filter */}
          <Box className={classes.filterGroup}>
            <Typography className={classes.filterLabel}>Assignee</Typography>
            <Box className={classes.assigneeContainer}>
              {assignees.map((assignee) => (
                <Chip
                  key={assignee}
                  label={assignee}
                  size="small"
                  onDelete={() => handleRemoveAssignee(assignee)}
                  deleteIcon={<CloseIcon />}
                  className={classes.chip}
                />
              ))}
            </Box>
          </Box>

          {/* Due Date Filter */}
          <Box className={classes.filterGroup}>
            <Typography className={classes.filterLabel}>Due Date</Typography>
            <FormControl className={classes.select} variant="outlined">
              <Select value={dueDate} onChange={handleDueDateChange} displayEmpty IconComponent={KeyboardArrowDown}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="tomorrow">Tomorrow</MenuItem>
                <MenuItem value="this-week">This Week</MenuItem>
                <MenuItem value="next-week">Next Week</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Create Button */}
        <Button className={classes.createButton} onClick={handleCreateTodo}>
          CREATE TO DO
        </Button>
      </Box>
    </Box>
  )
}
