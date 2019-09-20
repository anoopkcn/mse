import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { amber } from "@material-ui/core/colors";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import SyncIcon from "@material-ui/icons/Sync";
import Grid from "@material-ui/core/Grid";

import { VERDI } from "../lib/global";
import { utils } from "../lib/utils";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        backgroundColor: theme.palette.background.paper
    },
    inline: {
        display: "inline"
    },
    reloadButton: {},
    warning: {
        backgroundColor: amber[300]
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
    message: {
        display: "flex",
        alignItems: "center",
        color: "#533F02"
    },
    verdi: {
        float: "left"
    }
}));

const ReloadButton = withStyles({
    root: {
        float: "right"
    }
})(IconButton);

function getStatus() {
    if (VERDI) {
        var stdout = utils
            .execSync(
                `${VERDI} status | grep -E "profile:|repository:|postgres:|rabbitmq:|daemon:"`
            )
            .toString();
        return stdout.split("\n");
    } else {
        return "Could not find command verdi";
    }
}

export default function Status() {
    const [items, setData] = useState([]);

    useEffect(() => {
        setData(getStatus());
    }, []);

    const updateStatus = () => {
        setData(getStatus());
        console.log("clicked");
    };
    const classes = useStyles();
    let verdiStatus;

    if (!VERDI) {
        verdiStatus = (
            <SnackbarContent
                className={clsx(classes["warning"], "noVerdi")}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={classes.message}>
                        <WarningIcon
                            className={clsx(classes.icon, classes.iconVariant)}
                        />
                        <Box fontStyle="italic" m={1}>
                            Did not find python environment. Add path to the{" "}
                            <code>bin</code> of your environment in{" "}
                            <code>~/.elemental</code> JSON file.
                            {"{"}
                            <code>"python_env": "/path/to/python_env"</code>
                            {"}"}
                        </Box>
                    </span>
                }
            />
        );
    } else {
        verdiStatus = (
            <React.Fragment>
                {items.map((item, i) => (
                    <ListItem key={i}>
                        <ListItemText primary={item} />
                    </ListItem>
                ))}
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={10}>
                    <List className={classes.root} dense={true}>
                        {verdiStatus}
                    </List>
                </Grid>
                <Grid item xs={2}>
                    <ReloadButton aria-label="reload" onClick={updateStatus}>
                        <SyncIcon fontSize="small" />
                    </ReloadButton>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
