// eElectron modules are required using window.require()
import React, {Component} from 'react';
import './App.css';

import { channels } from './shared/constants';
import {VERDI} from './components/global'
import Dashboard from './components/Dashboard'

const exec = window.require('child_process').exec;
const find = window.require('find-process');


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
  // Find if the REST API is running on port 5000 if not start the API... 
  // ... and send PID to main else send the pid of the running API to the main process
    find('port', 5000).then(function (list) {
        if (!list.length) {
          console.log('Nothing is running on this port');
          exec(`${VERDI} restapi`,(err, stdout, stderr) => { 
            if(err){
                console.log(err)
            }else{
                ipcRenderer.send(channels.PID_MESSAGE, list[0].pid)
            }
      })
        } else {
          ipcRenderer.send(channels.PID_MESSAGE, list[0].pid)
        }
      })
    
    

  
  }
  render() {
    const { appName, appVersion} = this.state;
    console.log(appName,appVersion)
    return (
      <div className="App">
        <Dashboard />
      </div>

    );
  }
}

export default App;