import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardArrowDown } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    tab: {
        textTransform: 'none',
        minWidth: 0,
        padding: '16px 12px',
        [theme.breakpoints.up('sm')]: {
            minWidth: 0,
        },
    },
    activeTab: {
        borderBottom: `2px solid #0e766e`,
    },
    tabContent: {
        display: 'flex',
        alignItems: 'center',
    },
}));

export function Navigation() {
    const classes = useStyles();
    const [value, setValue] = useState(2);

    const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box className={classes.root}>
            <Tabs value={value} onChange={handleChange} aria-label="navigation tabs">
                <Tab
                    className={classes.tab}
                    label={
                        <Box className={classes.tabContent}>
                            Home <KeyboardArrowDown fontSize="small" />
                        </Box>
                    }
                />
                <Tab
                    className={classes.tab}
                    label={
                        <Box className={classes.tabContent}>
                            Billing <KeyboardArrowDown fontSize="small" />
                        </Box>
                    }
                />
                <Tab
                    className={`${classes.tab} ${value === 2 ? classes.activeTab : ''}`}
                    label={
                        <Box className={classes.tabContent}>
                            Care Services <KeyboardArrowDown fontSize="small" />
                        </Box>
                    }
                />
                <Tab className={classes.tab} label="Insights" />
                <Tab className={classes.tab} label="Reports" />
            </Tabs>
        </Box>
    );
}