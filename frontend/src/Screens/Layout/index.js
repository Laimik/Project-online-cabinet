import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {signOut} from "../../Services/authService";
import {
    AccountCircle,
    ExpandLess,
    ExpandMore,
    FlashOn,
    InvertColors,
    StarBorder,
    Whatshot
} from "@material-ui/icons";
import SpeedIcon from '@material-ui/icons/Speed';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import Link from "@material-ui/core/Link";
import Collapse from "@material-ui/core/Collapse";
import style from "./style.css"
import Box from "@material-ui/core/Box";

const drawerWidth = 240;

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            <b className={"phone"}>Телефон: +79990001122</b>
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
            <b className={"email"}>Почта: example@mail.com</b>
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flex:1
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function Layout(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {props.label}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper:  clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <Typography variant="h5" component="a" href={'/'}>ЖКХ онлайн</Typography>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button component="a" href={'/profile'} key={'Личный кабинет'}>
                        <ListItemIcon><AccountCircle /></ListItemIcon>
                        <ListItemText primary={'Личный кабинет'} />
                    </ListItem>
                    <ListItem button onClick={handleClick}>
                        <ListItemIcon>
                            <SpeedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Показания'} />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button component="a" href={'/pokazania'} key={'Вода'}>
                                <ListItemIcon>
                                    <InvertColors />
                                </ListItemIcon>
                                <ListItemText primary={'Вода'} />
                            </ListItem>
                            <ListItem button component="a" href={'/gas'} key={'Газ'}>
                                <ListItemIcon>
                                    <Whatshot />
                                </ListItemIcon>
                                <ListItemText primary={'Газ'} />
                            </ListItem>
                            <ListItem button component="a" href={'/electricity'} key={'Электричество'}>
                                <ListItemIcon>
                                    <FlashOn />
                                </ListItemIcon>
                                <ListItemText primary={'Электричество'} />
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
                <Divider />
                <List>
                    <ListItem button key={'Выход'} onClick={async () => {
                        await signOut();
                        window.location.reload(false);
                    }}>
                        <ListItemIcon><MeetingRoomIcon /></ListItemIcon>
                        <ListItemText primary={'Выход'} />
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {props.children}
            </main>
            <Box className={"footer"}pt={4}>
                <Copyright />
            </Box>
        </div>
    );
}