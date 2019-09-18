const os = window.require('os')

export const HOME_DIR = os.homedir()
export const CONFIG_FILE = `${HOME_DIR}/.elemental`
export const AIIDA_RESTAPI_URL = 'http://localhost:5000/api/v3'
export const AIIDA_CONFIG_FILE = `${HOME_DIR}/.aiida/config.json`
export const PYENV_BIN_DIR = `${HOME_DIR}/pyenvs/aiida/bin`