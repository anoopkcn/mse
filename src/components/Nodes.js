import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import NodesTable from "./NodesTable";
import { AIIDA_RESTAPI_URL, startServer } from "../lib/global";

const url = `${AIIDA_RESTAPI_URL}/nodes?orderby=-id`;

export default function Nodes() {
    const [data, setData] = useState({})
    const [isLoaded, setLoaded]=useState(false)

    startServer();
    useEffect(() => {
        fetchCalc();
        setInterval(() => fetchCalc(), 3000);
    });

    function fetchCalc() {
        if (AIIDA_RESTAPI_URL) {
            fetch(url)
                .then(result => result.json())
                .then(result => {
                    setData(result);
                })
                .catch(error => {
                    setLoaded(isLoaded);
                });
        }
    }
        // var data = state.data;
        return (
            <React.Fragment>
            <Paper style={{ minHeight: 300, width: "100%" }}>
                {data && data.data && <NodesTable data={data} />}
            </Paper>
            </React.Fragment>
        );
}
