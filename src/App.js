// eElectron modules are required using window.require()
import React, { Component } from 'react';
import './App.css';

import { channels } from './shared/constants';
import Dashboard from './components/Dashboard'

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
        console.log(appName, appVersion)
        return (
            <div className="App">
        <Dashboard />
      </div>

        );
    }
}

export default App;