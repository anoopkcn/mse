import { channels } from "../shared/constants";
import { utils } from "./utils";

const os = window.require("os");
const fs = window.require("fs");
const net = window.require("net");
const { ipcRenderer } = window;

export const HOME_DIR = os.homedir();
export const CONFIG_FILE = `${HOME_DIR}/.elemental`;
export const PORT = 5791;
export const AIIDA_RESTAPI_URL = `http://localhost:${PORT}/api/v3`;
export const VERDI = readConfig("python_env")
    ? `${readConfig("python_env")}/bin/verdi`
    : null;
export const AIIDA_CONFIG_FILE = readConfig("aiida_dir")
    ? `${readConfig("aiida_dir")}/config.json`
    : `${HOME_DIR}/.aiida/config.json`;

ipcRenderer.send(channels.PORT_MESSAGE, PORT);

export const configTemplate = `
{
    "python_env": "",
    "aiida_dir": ""
}
`;

export function writeConfig() {
    fs.access(CONFIG_FILE, fs.F_OK, err => {
        if (err) {
            fs.writeFile(CONFIG_FILE, configTemplate);
            return;
        }
    });
}

export function readConfig(property) {
    var data = fs.readFileSync(CONFIG_FILE, "utf-8");
    var config = JSON.parse(data);
    if (config[property]) {
        return config[property];
    } else {
        return null;
    }
}

// ipcRenderer.on(channels.PORT_MESSAGE, (event, arg) => {
//     ipcRenderer.removeAllListeners(channels.PORT_MESSAGE);
//     console.log(arg)
// });

export function startServer() {
    // TODO:: Find if the REST API is running on port PORT if not start the API...
    // ... and send PID to main else send the pid of the running API to the main process
    //
    var tester = net
        .createServer()
        .once("error", (err) => {
            return `Port ${PORT} is occupied`;
        })
        .once("listening", () => {
            tester
                .once("close", () => {
                    if (VERDI) {
                        utils.spawn(`${VERDI}`, ["restapi", "-P", `${PORT}`], {
                            detached: true,
                            windowsHide: true,
                            stdio: "ignore"
                        });
                    } else {
                        return `Could not start the REST API`;
                    }
                })
                .close();
        })
        .listen(PORT);
}
