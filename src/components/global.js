import { channels } from '../shared/constants';

const os = window.require('os')
const exec = window.require('child_process').spawn;
const find = window.require('find-process');
const { ipcRenderer } = window;

export const HOME_DIR = os.homedir()
export const CONFIG_FILE = `${HOME_DIR}/.elemental`
export const AIIDA_RESTAPI_URL = 'http://localhost:5000/api/v3'
export const AIIDA_CONFIG_FILE = `${HOME_DIR}/.aiida/config.json`
export const PYENV_BIN_DIR = `${HOME_DIR}/pyenvs/aiida/bin`
export const VERDI = `${PYENV_BIN_DIR}/verdi`
    
export function startServer(){
    // Find if the REST API is running on port 5000 if not start the API... 
    // ... and send PID to main else send the pid of the running API to the main process
    const procDetails = find('port', 5000).then( (list) => {
        if (!list.length) {
            console.log('Nothing is running on this port');
            exec(`${VERDI}`, ['restapi'], { detached: true , windowsHide: true, stdio: 'ignore'})
        } else {
            ipcRenderer.send(channels.PID_MESSAGE, list[0].pid)
        }
    })

    return procDetails
}