import React, { Component } from "react";
import axios from 'axios';
import {AIIDA_RESTAPI_URL} from './global';

export default class Computers extends Component {
  state = {
    error: null,
    isLoaded: false,
    items: {}
  };

  componentDidMount() {
    const url = `${API_URL}/computers`
    axios.get(url).then(
      result => {
        this.setState({
          isLoaded: true,
          items: result.data
        });
      },
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
      );
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
         <ul>
          {items.data.computers.map(item => (
            <li key={item.id}>
              {item.name} {item.hostname} @ {item.scheduler_type} {item.transport_type}
            </li>
          ))}
        </ul>
      );
    }
  }
}