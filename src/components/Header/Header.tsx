"use client"

import React, { useState } from "react"
import { Toolbar, Button, Menu, MenuItem, Box, IconButton, Select, FormControl } from "@material-ui/core"
import { KeyboardArrowDown, Notifications, Help, AccountCircle } from "@material-ui/icons"
import { makeStyles } from "@material-ui/core/styles"
import { Header as PCCHeader } from "@evergreen/core-header"
import { PageHeader } from "../PageHeader/PageHeader"
import { Typography } from "@evergreen/core"

const useStyles = makeStyles((theme) => ({
    headerContainer: {
        position: "relative",
        zIndex: 1000,
    },
    bottomToolbar: {
        minHeight: "50px",
        backgroundColor: "#f8f9fa",
        paddingLeft: "24px",
        paddingRight: "24px",
    },
    facilitySelect: {
        minWidth: 220,
        "& .MuiOutlinedInput-root": {
            backgroundColor: "transparent",
            border: "none",
            "& fieldset": {
                border: "none",
            },
        },
        "& .MuiSelect-select": {
            fontWeight: 500,
            color: "#4a5568",
        },
    },
    iconButton: {
        color: "#718096",
        padding: "6px",
        marginLeft: theme.spacing(1),
    },
    navButton: {
        color: "#6c757d",
        textTransform: "none",
        fontSize: "14px",
        fontWeight: 400,
        padding: "12px 16px",
        minWidth: "auto",
        borderRadius: 0,
        height: "48px",
        borderBottom: "3px solid transparent",
        "&:hover": {
            backgroundColor: "transparent",
            color: "#495057",
        },
    },
    activeNavButton: {
        color: "#495057",
        backgroundColor: "transparent",
        fontWeight: 500,
        borderBottom: "3px solid #17a2b8",
        "&:hover": {
            backgroundColor: "transparent",
        },
    },
    searchButton: {
        color: "#6c757d",
        textTransform: "none",
        fontSize: "14px",
        fontWeight: 400,
        padding: "6px 16px",
        border: "1px solid #ced4da",
        borderRadius: "4px",
        backgroundColor: "#ffffff",
        "&:hover": {
            backgroundColor: "#f8f9fa",
            borderColor: "#adb5bd",
        },
    },
    flexGrow: {
        flexGrow: 1,
    },
    navigationContainer: {
        display: "flex",
        alignItems: "center",
    },
    headerChildren: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
    },
}))

interface NavigationItem {
    label: string
    hasDropdown: boolean
    isActive?: boolean
    dropdownItems?: string[]
}

const navigationItems: NavigationItem[] = [
    {
        label: "Home",
        hasDropdown: true,
        dropdownItems: ["Dashboard", "Quick Actions", "Recent Items"],
    },
    {
        label: "Billing",
        hasDropdown: true,
        dropdownItems: ["Invoices", "Payments", "Billing Reports", "Payment Settings"],
    },
    {
        label: "Care Services",
        hasDropdown: true,
        isActive: true,
        dropdownItems: ["Care Plans", "Assessments", "Medications", "Progress Notes", "To Do Dashboard"],
    },
    {
        label: "Insights",
        hasDropdown: false,
    },
    {
        label: "Reports",
        hasDropdown: false,
    },
]

export function Header() {
    const classes = useStyles()
    const [anchorEls, setAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({})

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, label: string) => {
        setAnchorEls((prev) => ({
            ...prev,
            [label]: event.currentTarget,
        }))
    }

    const handleMenuClose = (label: string) => {
        setAnchorEls((prev) => ({
            ...prev,
            [label]: null,
        }))
    }

    const handleMenuItemClick = (parentLabel: string, itemLabel: string) => {
        console.log(`Navigation: ${parentLabel} -> ${itemLabel}`)
        handleMenuClose(parentLabel)
    }

    const handleNavClick = (label: string) => {
        if (label === "Insights" || label === "Reports") {
            console.log(`Navigate to: ${label}`)
        }
    }

    const handleSearchClick = () => {
        console.log("Search clicked")
    }

    const handleTabChange = (newValue: number) => {
        console.log(`Tab changed to: ${newValue === 0 ? "Clinical Dashboard" : "To Do Dashboard"}`)
    }

    return (
        <Box className={classes.headerContainer}>
            {/* PCC Header replacing AppBar */}
            <PCCHeader headerText>
                <div className={classes.headerChildren}>
                    <FormControl className={classes.facilitySelect}>
                        <Select value="watersprings" displayEmpty IconComponent={KeyboardArrowDown}>
                            <MenuItem value="watersprings">Watersprings Senior Living</MenuItem>
                            <MenuItem value="oakview">Oakview Care Center</MenuItem>
                            <MenuItem value="pinegrove">Pine Grove Assisted Living</MenuItem>
                        </Select>
                    </FormControl>

                    <IconButton
                        className={classes.iconButton}
                        onClick={() => console.log("Notifications clicked")}
                        aria-label="notifications"
                    >
                        <Notifications />
                    </IconButton>

                    <IconButton className={classes.iconButton} onClick={() => console.log("Help clicked")} aria-label="help">
                        <Help />
                    </IconButton>

                    <IconButton
                        className={classes.iconButton}
                        onClick={() => console.log("Account clicked")}
                        aria-label="account"
                    >
                        <AccountCircle />
                    </IconButton>
                </div>
            </PCCHeader>

            {/* Main Navigation */}
            <Toolbar
                className={classes.bottomToolbar}
                style={{
                    marginTop: "65px",
                }}
            >
                <Box className={classes.navigationContainer}>
                    {navigationItems.map((item) => (
                        <React.Fragment key={item.label}>
                            <Button
                                className={item.isActive ? `${classes.navButton} ${classes.activeNavButton}` : classes.navButton}
                                onClick={item.hasDropdown ? (e) => handleMenuOpen(e, item.label) : () => handleNavClick(item.label)}
                                endIcon={item.hasDropdown ? <KeyboardArrowDown style={{ fontSize: "16px" }} /> : null}
                            >
                                <Typography variant="body2" color="inherit">
                                    {item.label}
                                </Typography>
                            </Button>

                            {item.hasDropdown && item.dropdownItems && (
                                <Menu
                                    anchorEl={anchorEls[item.label]}
                                    open={Boolean(anchorEls[item.label])}
                                    onClose={() => handleMenuClose(item.label)}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                    }}
                                    getContentAnchorEl={null}
                                    PaperProps={{
                                        style: {
                                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "4px",
                                            marginTop: "0px",
                                        },
                                    }}
                                >
                                    {item.dropdownItems.map((dropdownItem) => (
                                        <MenuItem
                                            key={dropdownItem}
                                            onClick={() => handleMenuItemClick(item.label, dropdownItem)}
                                            style={{
                                                padding: "8px 16px",
                                            }}
                                        >
                                            <Typography variant="body2">{dropdownItem}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            )}
                        </React.Fragment>
                    ))}
                </Box>

                <Box className={classes.flexGrow} />

                <Button className={classes.searchButton} onClick={handleSearchClick}>
                    <Typography variant="button">Search</Typography>
                </Button>
            </Toolbar>

            {/* Page Header with Title and Tabs */}
            <PageHeader title="To Do Dashboard" activeTab={1} onTabChange={handleTabChange} />
        </Box>
    )
}
