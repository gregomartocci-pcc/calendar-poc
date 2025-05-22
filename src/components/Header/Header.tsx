import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Select, MenuItem, FormControl } from '@material-ui/core';
import { alpha, makeStyles } from '@material-ui/core/styles';
import { Notifications, Help, AccountCircle, Search as SearchIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    title: {
        fontWeight: 'bold',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
        border: '1px solid #e5e7eb',
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    formControl: {
        minWidth: 220,
    },
    appBar: {
        backgroundColor: 'white',
        color: 'inherit',
        boxShadow: 'none',
        borderBottom: '1px solid #e5e7eb',
    },
    iconButton: {
        marginLeft: theme.spacing(1),
    },
}));

export function Header() {
    const classes = useStyles();

    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    PointClickCare
                </Typography>
                <div className={classes.grow} />

                <FormControl variant="outlined" size="small" className={classes.formControl}>
                    <Select defaultValue="watersprings" displayEmpty>
                        <MenuItem value="watersprings">Watersprings Senior Living</MenuItem>
                        <MenuItem value="oakview">Oakview Care Center</MenuItem>
                        <MenuItem value="pinegrove">Pine Grove Assisted Living</MenuItem>
                    </Select>
                </FormControl>

                <IconButton color="inherit" className={classes.iconButton}>
                    <Notifications />
                </IconButton>
                <IconButton color="inherit" className={classes.iconButton}>
                    <Help />
                </IconButton>
                <IconButton color="inherit" className={classes.iconButton}>
                    <AccountCircle />
                </IconButton>

                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </div>
            </Toolbar>
        </AppBar>
    );
}