// eElectron modules are required using window.require()
import React, {Component} from 'react';
import './App.css';

import { channels } from './shared/constants';
import Users from './components/users';
import Computers from './components/computers';
import Calculations from './components/calculations';

const { ipcRenderer } = window; 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      appVersion: '',
    }
    ipcRenderer.send(channels.APP_INFO);
    ipcRenderer.on(channels.APP_INFO, (event, arg) => {
      ipcRenderer.removeAllListeners(channels.APP_INFO);
      const { appName, appVersion } = arg;
      this.setState({ appName, appVersion });
    });
  }
  render() {
    const { appName, appVersion } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <p>{appName} version {appVersion}</p>
        </header>
        {/*<div className="Users">
          <Users />
        </div>
        <div className="Computers">
          <Computers />
        </div> */}
        <div className="Calculations">
          <Calculations />
        </div>
      </div>

    );
  }
}

export default App;