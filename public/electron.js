const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const glob = require('glob');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

const { channels } = require(isDev ? '../src/shared/constants' : './src/shared/constants');

let mainWindow = null

function initialize() {
    makeSingleInstance()
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

    function createWindow() {
        mainWindow = new BrowserWindow({
            width: 900,
            height: 680,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js'),
            }
        });
        mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
        mainWindow.on('closed', () => mainWindow = null);
    }

    app.on('ready', createWindow);

    var pids = []
    ipcMain.on(channels.PID_MESSAGE, (event, arg) => {
        pids.push(arg)
        // event.sender.send(channels.PID_MESSAGE, pids)
    });

    app.on('before-quit', () => {
        pids.forEach(pid => {
            process.kill(pid);
        })
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (mainWindow === null) {
            createWindow();
        }
    });

    ipcMain.on(channels.APP_INFO, (event) => {
        event.sender.send(channels.APP_INFO, {
            appName: app.getName(),
            appVersion: app.getVersion(),
        });
    });
}

// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
    if (process.mas) return

    app.requestSingleInstanceLock()

    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}

initialize()