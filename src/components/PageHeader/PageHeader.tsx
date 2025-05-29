"use client"

import type React from "react"
import { useState } from "react"
import { Box, Typography, Tabs, Tab } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    pageHeaderContainer: {
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
    },
    pageTitle: {
        fontWeight: 600,
        color: "#2d3748",
        fontSize: "18px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "16px 24px 8px 24px",
    },
    tabsContainer: {
        backgroundColor: "#6c757d",
        minHeight: "40px",
        display: "flex",
        alignItems: "center",
    },
    tabs: {
        minHeight: "40px",
        "& .MuiTabs-indicator": {
            display: "none",
        },
        "& .MuiTabs-flexContainer": {
            height: "40px",
        },
    },
    tab: {
        textTransform: "none",
        fontSize: "14px",
        fontWeight: 500,
        minHeight: "40px",
        height: "40px",
        padding: "0 24px",
        color: "#ffffff",
        backgroundColor: "#6c757d",
        borderRadius: "0",
        minWidth: "auto",
        border: "none",
        "&.Mui-selected": {
            backgroundColor: "#17a2b8",
            color: "#ffffff",
        },
        "&:hover": {
            backgroundColor: "#5a6268",
        },
        "&.Mui-selected:hover": {
            backgroundColor: "#138496",
        },
    },
}))

interface PageHeaderProps {
    title: string
    activeTab?: number
    onTabChange?: (newValue: number) => void
}

export function PageHeader({ title = "To Do Dashboard", activeTab = 1, onTabChange }: PageHeaderProps) {
    const classes = useStyles()
    const [value, setValue] = useState(activeTab)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
        if (onTabChange) {
            onTabChange(newValue)
        }
    }

    return (
        <Box className={classes.pageHeaderContainer}>
            <Typography className={classes.pageTitle}>{title}</Typography>

            <Box className={classes.tabsContainer}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    className={classes.tabs}
                    variant="standard"
                    TabIndicatorProps={{ style: { display: "none" } }}
                >
                    <Tab label="Clinical Dashboard" className={classes.tab} />
                    <Tab label="To Do Dashboard" className={classes.tab} />
                </Tabs>
            </Box>
        </Box>
    )
}
