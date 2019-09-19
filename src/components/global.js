import { channels } from '../shared/constants';

const os = window.require('os')
const exec = window.require('child_process').spawn;
const find = window.require('find-process');
const fs = window.require('fs')
const { ipcRenderer } = window;

export const HOME_DIR = os.homedir()
export const CONFIG_FILE = `${HOME_DIR}/.elemental`
export const AIIDA_RESTAPI_URL = 'http://localhost:5000/api/v3'
export var AIIDA_CONFIG_FILE = `${HOME_DIR}/.aiida/config.json`
export var PYENV_BIN_DIR = `${HOME_DIR}/pyenvs/aiida/bin`
export const VERDI = `${PYENV_BIN_DIR}/verdi`

const configTemplate=`
{
    "python_env": "/path/to/python_env",
    "aiida_dir": "/path/to/aiida"
}
`;

fs.access(CONFIG_FILE, fs.F_OK, (err) => {
  if (err) {
    fs.writeFile(CONFIG_FILE, configTemplate, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Config file witten");
    }); 
    return;
  }
  fs.readFile(CONFIG_FILE, 'utf-8', (err, data) => { 
    var config = JSON.parse(data)
    if (config.python_env) { PYENV_BIN_DIR = `${config.python_env}/bin` }
    if (config.aiida_dir) { AIIDA_CONFIG_FILE = `${config.aiida_dir}/config.json` }
    });
});

    
export function startServer(){
    // Find if the REST API is running on port 5000 if not start the API... 
    // ... and send PID to main else send the pid of the running API to the main process
    find('port', 5000).then( (list) => {
        if (!list.length) {
            console.log('Nothing is running on this port');
            exec(`${VERDI}`, ['restapi'], { detached: true , windowsHide: true, stdio: 'ignore'})
        } else {
            ipcRenderer.send(channels.PID_MESSAGE, list[0].pid)
        }
    })
}