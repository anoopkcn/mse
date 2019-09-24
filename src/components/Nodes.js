import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
// import Container from '@material-ui/core/Container';
import RotateRightIcon from "@material-ui/icons/RotateRight";
import { makeStyles } from "@material-ui/core/styles";
import NodesTable from "./NodesTable";
import "../assets/css/animations.css";
import { AIIDA_RESTAPI_URL, connectServer, db_profile} from "../lib/global";

const url = `${AIIDA_RESTAPI_URL}/nodes?orderby=-id`;

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: 300,
        width: "100%"
        // boxShadow: '0 0 0 0',
    },
    loading: {
        textAlign: "center",
        paddingTop: 132.5 // (minheight/2) - (imageSize/2)
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
    } // else load from the local database https://node-postgres.com/
}
console.log(db_profile)
export default function Nodes() {
    const [data, setData] = useState({});
    const [isLoaded, setLoaded] = useState(false);

    connectServer();
    useEffect(() => {
        fetchNode()
            .then(result => {
                if (result) {
                    setData(result);
                    setLoaded(true);
                }
            })
            .catch(error => setLoaded(false));

        setInterval(() => {
            fetchNode()
                .then(result => {
                    if (result) {
                        setData(result);
                        setLoaded(true);
                    }
                })
                .catch(error => {
                    setLoaded(false);
                });
        }, 5000);
    }, []);

    console.log(isLoaded);
    const classes = useStyles();
    let nodesTable;
    if (isLoaded && data) {
        nodesTable = <NodesTable data={data} />;
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
            <Paper className={classes.root}>{nodesTable}</Paper>
        </React.Fragment>
    );
}
