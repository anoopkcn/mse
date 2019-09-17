import React, { Component } from "react";
import axios from 'axios';
import {API_URL} from './global';
const url = `${API_URL}/calculations`

export default class Calculations extends Component {
  state = {
    error: null,
    isLoaded: false,
    items: {}
  };

  componentDidMount() {
        this.fetchCalc();
        // this.timer = setInterval(() => this.fetchCalc(), 1000);
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
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
         <ul>
          {items.data.calculations.map(item => (
            <li key={item.id}>
              {item.id} {item.attributes.function_name}  {item.attributes.process_label} {item.attributes.process_state}
            </li>
          ))}
        </ul>
      );
    }
  }
}