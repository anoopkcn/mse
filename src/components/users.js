import React, { Component } from "react";
import axios from 'axios';
import {AIIDA_RESTAPI_URL} from './global';

export default class Users extends Component {
  state = {
    error: null,
    isLoaded: false,
    items: {}
  };

  componentDidMount() {
    const url = `${API_URL}/users`
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
          {items.data.users.map(item => (
            <li key={item.id}>
              {item.first_name} {item.last_name} @ {item.institution}
            </li>
          ))}
        </ul>
      );
    }
  }
}