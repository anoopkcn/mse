import React, { Component } from "react";
import axios from 'axios';
import CalcTable from "./CalcTable";
import { AIIDA_RESTAPI_URL, startServer } from './global';

const url = `${AIIDA_RESTAPI_URL}/calculations?orderby=-id`

export default class Calculations extends Component {
    state = {
        error: null,
        isLoaded: false,
        items: {}
    };

    componentDidMount() {
        this.fetchCalc();
        this.timer = setInterval(() => this.fetchCalc(), 5000);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }
    fetchCalc() {
        startServer() // TODO dont call this several times
        axios.get(url).then( result => {
            this.setState({ items: result.data, isLoaded: true });
        }).catch (error => {
            this.setState({ error, isLoaded: true });
        });
    };

    render() {
        var items = this.state.items
        return (
            <React.Fragment>
          {
            items && items.data && 
            <CalcTable data={items} />
          }
          </React.Fragment>
        );
    }
}