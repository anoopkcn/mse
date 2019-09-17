import React, { Component } from "react";
import axios from 'axios';
import CalcTable from "./CalcTable";

import {API_URL} from './global';

const url = `${API_URL}/calculations?orderby=-id`

export default class Calculations extends Component {
  state = {
    error: null,
    isLoaded: false,
    items: {}
  };

  componentDidMount() {
        this.fetchCalc();
        this.timer = setInterval(() => this.fetchCalc(), 1000);
  }
  componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
  }
  async fetchCalc() {
        try {
            this.setState({...this.state, isLoaded: false});
            const result = await axios.get(url);
            this.setState({items: result.data, isLoaded: true});
        } catch (error) {
            this.setState({error, isLoaded: true});
        }
    };

  render() {
    var items= this.state.items
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