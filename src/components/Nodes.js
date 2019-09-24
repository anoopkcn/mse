import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
// import Container from '@material-ui/core/Container';
import RotateRightIcon from "@material-ui/icons/RotateRight";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import BallotIcon from "@material-ui/icons/Ballot";
import CastConnectedIcon from "@material-ui/icons/CastConnected";
import NodesTable from "./NodesTable";
import "../assets/css/animations.css";
import { AIIDA_RESTAPI_URL, startRestAPI, db_profile, db } from "../lib/global";

const url = `${AIIDA_RESTAPI_URL}/nodes?orderby=-id`;

const theme = createMuiTheme({
    palette: {
        secondary: { main: "#00a152" }
    }
});

const useStyles = makeStyles(theme => ({
    palette: {
        secondary: { main: "#11cb5f" }
    },
    root: {
        minHeight: 500,
        width: "100%"
        // boxShadow: '0 0 0 0',
    },
    loading: {
        textAlign: "center",
        paddingTop: 132.5 // (minheight/2) - (iconSize/2)
    },
    toolbar: {
        width: "100%"
    }
}));

function fetchNode() {
    if (AIIDA_RESTAPI_URL) {
        return fetch(url)
            .then(result => result.json())
            .then(result => {
                if (result.data) {
                    return result;
                } else {
                    return false;
                }
            })
            .catch(error => {
                return false;
            });
    }
}

export default function Nodes() {
    const [data, setData] = useState({});
    const [isLoaded, setLoaded] = useState(false);
    const [isDatabase, setDatabase] = useState(true);
    const [isRestAPI, setRestAPI] = useState(false);
    const classes = useStyles();
    const queryText = "select * from db_dbnode";

    const activeColor = isActive => {
        return (isActive) ?  "secondary": "disabled";
    };

    const switchDatabase = () => {
        if(isRestAPI !== true) setDatabase(!isDatabase);
    };
    const switchRestAPI = () => {
        if(isDatabase !== true){setRestAPI(!isRestAPI)}
    };

    if (!isDatabase) {
        startRestAPI();
    }
    useEffect(() => {
        let didCancel = false;
        async function fetchData() {
            if (db_profile && isDatabase) {
                db.query(queryText, (err, res) => {
                    if (!err && !didCancel) {
                        setData(res.rows);
                        setLoaded(true);
                    }
                });
            } else if (isRestAPI) {
                fetchNode()
                    .then(result => {
                        if (result.data && !didCancel) {
                            setData(result);
                            setLoaded(true);
                        }
                    })
                    .catch(error => setLoaded(false));
            }
        }

        if (isDatabase || isRestAPI) {
            fetchData();
            setInterval(() => {
                fetchData();
            }, 7000);
        }
        return () => {
            didCancel = true;
        };
    }, [isDatabase, isRestAPI]);

    console.log(isLoaded);
    let nodesTable;
    if (isLoaded && data) {
        if(isDatabase === false && isRestAPI === false){
            nodesTable = <div>You have to set the path to aiida config and start the postgress server </div>
        }else if (isDatabase && !isRestAPI && !data.data) {
            nodesTable = <NodesTable data={data} />
        } else if (isRestAPI && !isDatabase && data.data) {
            nodesTable = <NodesTable data={data.data.nodes} />
        }else{
            nodesTable = (
            <div className={classes.loading}>
                <RotateRightIcon
                    className="Loading"
                    color="disabled"
                    fontSize="large"
                />
            </div>)
        }
    } else {
        nodesTable = (
            <div className={classes.loading}>
                <RotateRightIcon
                    className="Loading"
                    color="disabled"
                    fontSize="large"
                />
            </div>
        );
    }
    return (
        <React.Fragment>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Paper className={classes.toolbar}>
                        <div className={classes.toolbarIcons}>
                            <ThemeProvider theme={theme}>
                                <Button onClick={switchDatabase}>
                                    <BallotIcon
                                        color={activeColor(isDatabase)}
                                    />
                                </Button>
                                <Button onClick={switchRestAPI}>
                                    <CastConnectedIcon
                                        color={activeColor(isRestAPI)}
                                    />
                                </Button>
                            </ThemeProvider>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.root}>{nodesTable}</Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
