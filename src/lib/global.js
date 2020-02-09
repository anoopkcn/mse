import { channels } from "../shared/constants";
import { utils } from "./utils";

const os = window.require("os");
const fs = window.require("fs");
const net = window.require("net");
const { Pool } = window.require("pg");

const { ipcRenderer } = window;

export const HOME_DIR = os.homedir();
export const CONFIG_FILE = `${HOME_DIR}/.mse`;
export const PORT = 5791;
export const AIIDA_RESTAPI_URL = `http://localhost:${PORT}/api/v4`;
export const VERDI = readConfig("python_env")
  ? `${readConfig("python_env")}/bin/verdi`
  : null;
export const AIIDA_CONFIG_FILE = readConfig("aiida_dir")
  ? `${readConfig("aiida_dir")}/config.json`
  : null; //`${HOME_DIR}/.aiida/config.json`
export var db;

var data;
if (AIIDA_CONFIG_FILE) {
  data = fs.readFileSync(AIIDA_CONFIG_FILE, "utf-8");
} else {
  data = null;
}
export const db_profile = data ? JSON.parse(data) : null;

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

export function startRestAPI() {
  // TODO:: Find if the REST API is running on port PORT if not start the API...
  // ... and send PID to main else send the pid of the running API to the main process
  //
  //
  var tester = net
    .createServer()
    .once("error", err => {
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
            return "Server Started";
          } else {
            return "Could not start the REST API";
          }
        })
        .close();
    })
    .listen(PORT);
}

if (db_profile) {
  const pool = new Pool({
    user: db_profile.profiles[db_profile.default_profile].AIIDADB_USER,
    host: db_profile.profiles[db_profile.default_profile].AIIDADB_HOST,
    database: db_profile.profiles[db_profile.default_profile].AIIDADB_NAME,
    password: db_profile.profiles[db_profile.default_profile].AIIDADB_PASS,
    port: db_profile.profiles[db_profile.default_profile].AIIDADB_PORT
  });
  db = {
    query: (text, callback) => {
      return pool.query(text, callback);
    }
  };
}
