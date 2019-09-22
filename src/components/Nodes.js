import React, { Component } from "react";
import CalcTable from "./CalcTable";
import { AIIDA_RESTAPI_URL, startServer } from "../lib/global";

const url = `${AIIDA_RESTAPI_URL}/nodes?orderby=-id`;

export default class Nodes extends Component {
    state = {
        error: null,
        isLoaded: false,
        items: {}
    };

    componentDidMount() {
        startServer();
        this.fetchCalc();
        this.timer = setInterval(() => this.fetchCalc(), 3000);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }
    fetchCalc() {
        if (AIIDA_RESTAPI_URL) {
            fetch(url)
                .then(result => result.json())
                .then(result => {
                    this.setState({ items: result, isLoaded: true });
                })
                .catch(error => {
                    this.setState({ error, isLoaded: true });
                });
        }
    }

    render() {
        var items = this.state.items;
        return (
            <React.Fragment>
                {items && items.data && <CalcTable data={items} />}
            </React.Fragment>
        );
    }
}
