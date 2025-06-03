"use client"

import type React from "react"
import { useState } from "react"
import { Box, Tabs, Tab } from "@material-ui/core"
import { Typography } from "@evergreen/core"
import { makeStyles } from "@material-ui/core/styles"
import { KeyboardArrowDown } from "@material-ui/icons"

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    tab: {
        textTransform: "none",
        minWidth: 0,
        padding: "16px 12px",
        [theme.breakpoints.up("sm")]: {
            minWidth: 0,
        },
    },
    activeTab: {
        borderBottom: `2px solid #0e766e`,
    },
    tabContent: {
        display: "flex",
        alignItems: "center",
    },
}))

export function Navigation() {
    const classes = useStyles()
    const [value, setValue] = useState(2)

    const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Box className={classes.root}>
            <Tabs value={value} onChange={handleChange} aria-label="navigation tabs">
                <Tab
                    className={classes.tab}
                    label={
                        <Box className={classes.tabContent}>
                            <Typography variant="body2">Home</Typography>
                            <KeyboardArrowDown fontSize="small" />
                        </Box>
                    }
                />
                <Tab
                    className={classes.tab}
                    label={
                        <Box className={classes.tabContent}>
                            <Typography variant="body2">Billing</Typography>
                            <KeyboardArrowDown fontSize="small" />
                        </Box>
                    }
                />
                <Tab
                    className={`${classes.tab} ${value === 2 ? classes.activeTab : ""}`}
                    label={
                        <Box className={classes.tabContent}>
                            <Typography variant="body2">Care Services</Typography>
                            <KeyboardArrowDown fontSize="small" />
                        </Box>
                    }
                />
                <Tab className={classes.tab} label={<Typography variant="body2">Insights</Typography>} />
                <Tab className={classes.tab} label={<Typography variant="body2">Reports</Typography>} />
            </Tabs>
        </Box>
    )
}
