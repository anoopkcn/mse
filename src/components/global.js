import { channels } from '../shared/constants';

const os = window.require('os')
const fs = window.require('fs')
const { ipcRenderer } = window;

export const HOME_DIR = os.homedir()
export const CONFIG_FILE = `${HOME_DIR}/.elemental`
export const AIIDA_RESTAPI_URL = 'http://localhost:5000/api/v3'
export const VERDI = (readConfig('python_env')) ? `${readConfig('python_env')}/bin/verdi` : null

export var AIIDA_CONFIG_FILE = (readConfig('aiida_dir')) ? `${readConfig('aiida_dir')}/config.json` : `${HOME_DIR}/.aiida/config.json`
export var processVar={}

export const configTemplate = `
{
    "python_env": "",
    "aiida_dir": ""
}
`;

export function writeConfig() {
    fs.access(CONFIG_FILE, fs.F_OK, (err) => {
        if (err) {
            fs.writeFile(CONFIG_FILE, configTemplate)
            return;
        }
    });
}

export function readConfig(property) {
    var data =fs.readFileSync(CONFIG_FILE, 'utf-8')
    var config = JSON.parse(data)
    if (config[property]) {
        return config[property]
    }else{
        return null
    }
}

// ipcRenderer.send(channels.PROCESS_PLATFORM);
// ipcRenderer.on(channels.PROCESS_PLATFORM, (event, arg) => {
//     ipcRenderer.removeAllListeners(channels.PROCESS_PLATFORM);
//     const {appPlatform} = arg;
//     processVar['platform'] = appPlatform
// });


export function startServer() {
    // Find if the REST API is running on port 5000 if not start the API... 
    // ... and send PID to main else send the pid of the running API to the main process
    // console.log(findPidByPort(5000,processVar.platform))
    // if (VERDI) {
    //     var pid = findPidByPort(5000)
    //     if (!pid) {
    //         console.log('Nothing is running on this port');
    //         exec(`${VERDI}`, ['restapi'], { detached: true, windowsHide: true, stdio: 'ignore' })
    //         pid = findPidByPort(5000)
    //     }
    //     ipcRenderer.send(channels.PID_MESSAGE, pid)
    // }
}