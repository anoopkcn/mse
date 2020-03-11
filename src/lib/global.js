const os = window.require("os");
const fs = window.require("fs");
const { Pool } = window.require("pg");

export const HOME_DIR = os.homedir();
export const CONFIG_FILE = `${HOME_DIR}/.mse`;
export var db =null;

export function readConfig() {
  let fd;
  var py_config
  try {
    fd = fs.openSync(CONFIG_FILE, 'wx+');
    fs.appendFileSync(fd, `{ "python_env": "${HOME_DIR}/.virtualenvs/aiida", "aiida_config": "${HOME_DIR}/.aiida/config.json" }`, 'utf8');
  } catch (err) {
    //console.log('Config file already exists')
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
  var data = fs.readFileSync(CONFIG_FILE, "utf-8");
  if (data) {
    try {
      py_config = JSON.parse(data);
    } catch (e) {
      py_config = null
      alert(e);
    }
  }
  return py_config
}

var py_config = readConfig()
export const VERDI = py_config ? `${py_config['python_env']}/bin/verdi` : null;
export const AIIDA_CONFIG_FILE = py_config ? `${py_config['aiida_config']}` : null;

var data;
if (AIIDA_CONFIG_FILE) {
  data = fs.readFileSync(AIIDA_CONFIG_FILE, "utf-8");
} else {
  data = null;
}
export const db_profile = data ? JSON.parse(data) : null;

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
