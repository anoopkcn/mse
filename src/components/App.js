// Electron modules are required using window.require()
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SettingsInputCompositeIcon from "@material-ui/icons/SettingsInputComposite";
import BarChartIcon from "@material-ui/icons/BarChart";
import WbCloudyIcon from "@material-ui/icons/WbCloudy";
import AccountTreeIcon from "@material-ui/icons/AccountTree";

import { channels } from "../shared/constants";
import Dashboard from "./Dashboard";
import Plugins from "./Plugins";
import { writeConfig } from "../lib/global";
// import ToolBar from "./listItems";
// import { toolbar } from "../lib/global";

const { ipcRenderer } = window;

const drawerWidth = 220;

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    toolbar: {
        paddingRight: 20, // keep right padding when drawer closed
        backgroundColor: "#115293"
    },
    toolbarIcon: {
        position: "absolute",
        bottom: theme.spacing(1),
        right: theme.spacing(1)
    },
    drawerPaper: {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerPaperClose: {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(8)
        }
    }
}));

export default function App() {
    const [appName, setAppName] = useState("");
    const [appVersion, setAppVersion] = useState("");
    const [open, setOpen] = useState(false);
    const [isDashboard, setDashboard] = useState(true);
    const [isPlugins, setPlugins] = useState(false);

    const activeColor = isActive => {
        if (isActive) {
            return "primary";
        } else {
            return "disabled";
        }
    };

    const switchDashboard = () => {
        setDashboard(true);
        setPlugins(false);
    };
    const switchPlugins = () => {
        setDashboard(false);
        setPlugins(true);
    };

    // useEffect(() => {
        ipcRenderer.send(channels.APP_INFO);
        ipcRenderer.on(channels.APP_INFO, (event, arg) => {
            ipcRenderer.removeAllListeners(channels.APP_INFO);
            setAppName(arg.appName);
            setAppVersion(arg.appVersion);
        });
        writeConfig();
    // }, []);

    const classes = useStyles();
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    let drawerState;
    if (open) {
        drawerState = (
            <IconButton onClick={handleDrawerClose}>
                <MenuOpenIcon fontSize="small" />
            </IconButton>
        );
    } else {
        drawerState = (
            <IconButton onClick={handleDrawerOpen}>
                <MenuIcon fontSize="small" />
            </IconButton>
        );
    }

    console.log(appName, appVersion);

    let windowView;
    if (isDashboard) {
        windowView = <Dashboard />;
    } else if (isPlugins) {
        windowView = <Plugins />;
    }

    return (
        <div className="App">
            <div className={classes.root}>
                <CssBaseline />
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: clsx(
                            classes.drawerPaper,
                            !open && classes.drawerPaperClose
                        )
                    }}
                    open={open}
                >
                    <List>
                        <div>
                            <ListItem button onClick={switchDashboard}>
                                <ListItemIcon>
                                    <DashboardIcon
                                        color={activeColor(isDashboard)}
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItem>
                            <ListItem button onClick={switchPlugins}>
                                <ListItemIcon>
                                    <SettingsInputCompositeIcon
                                        color={activeColor(isPlugins)}
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Plugins" />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <BarChartIcon color="disabled" />
                                </ListItemIcon>
                                <ListItemText primary="Plots" />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <AccountTreeIcon color="disabled" />
                                </ListItemIcon>
                                <ListItemText primary="Provanance" />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <WbCloudyIcon color="disabled" />
                                </ListItemIcon>
                                <ListItemText primary="Search" />
                            </ListItem>
                        </div>
                    </List>
                    <div className={classes.toolbarIcon}>{drawerState}</div>
                </Drawer>
                {windowView}
            </div>
        </div>
    );
}
