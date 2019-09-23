import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import NodesTable from "./NodesTable";
import { AIIDA_RESTAPI_URL, startServer } from "../lib/global";

const url = `${AIIDA_RESTAPI_URL}/nodes?orderby=-id`;

const useStyles = makeStyles(theme => ({
    root: {
         minHeight: 300, 
         width: "100%",
         // boxShadow: '0 0 0 0',
    },
}));

function fetchCalc() {
    if (AIIDA_RESTAPI_URL) {
        return fetch(url)
            .then(result => result.json())
            .then(result => {
                return result;
            })
            .catch(error => {
                return error;
            });
    }
}

export default function Nodes() {
    const [data, setData] = useState({});
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        startServer();
        fetchCalc()
            .then(result => {
                setData(result);
                setLoaded(true);
            })
            .catch(error => setLoaded(false));
        setInterval(() => {
            fetchCalc()
                .then(result => {
                    setData(result);
                })
                .catch(error => setLoaded(true));
        }, 15000);
    }, []);

    // console.log(isLoaded);
    const classes = useStyles();
    return (
        <React.Fragment>
            <Paper className={classes.root}>
                {isLoaded && data.data && <NodesTable data={data} />}
            </Paper>
        </React.Fragment>
    );
}
