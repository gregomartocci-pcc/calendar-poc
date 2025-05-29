"use client"

import React, { useState } from "react"
import { Button, Header as EvergreenHeader } from "@evergreen/core"
import { Menu, MenuItem } from "@material-ui/core"
import { KeyboardArrowDown } from "@material-ui/icons"

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

export function MainNavigation() {
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

    return (
        <EvergreenHeader
            headerText=""
            style={{
                backgroundColor: "white",
                borderBottom: "1px solid #e1e5e9",
                paddingLeft: "24px",
                paddingRight: "24px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "static"
            }}
        >
            {/* Navigation Items Container */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                }}
            >
                {navigationItems.map((item) => (
                    <React.Fragment key={item.label}>
                        <Button
                            appearance="minimal"
                            size="small"
                            onClick={item.hasDropdown ? (e) => handleMenuOpen(e, item.label) : () => handleNavClick(item.label)}
                            color={item.isActive ? "#0e766e" : "#6c757d"}
                            backgroundColor={item.isActive ? "#e6f7ff" : "transparent"}
                            fontWeight={item.isActive ? 500 : 400}
                            fontSize="14px"
                            paddingX={16}
                            paddingY={8}
                            borderRadius={4}
                            style={{
                                textTransform: "none",
                                minWidth: "auto",
                            }}
                        >
                            {item.label}
                            {item.hasDropdown && (
                                <KeyboardArrowDown
                                    style={{
                                        marginLeft: "4px",
                                        fontSize: "16px",
                                        color: "inherit",
                                    }}
                                />
                            )}
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
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                        border: "1px solid #e1e5e9",
                                        borderRadius: "4px",
                                        marginTop: "4px",
                                    },
                                }}
                            >
                                {item.dropdownItems.map((dropdownItem) => (
                                    <MenuItem
                                        key={dropdownItem}
                                        onClick={() => handleMenuItemClick(item.label, dropdownItem)}
                                        style={{
                                            fontSize: "14px",
                                            padding: "8px 16px",
                                        }}
                                    >
                                        {dropdownItem}
                                    </MenuItem>
                                ))}
                            </Menu>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Search Button */}
            <Button
                variant="contained"
                size="small"
                onClick={handleSearchClick}
            >
                Search
            </Button>
        </EvergreenHeader>
    )
}
