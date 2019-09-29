const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const path = require("path");
const isDev = require("electron-is-dev");
const execSync = require("child_process").execSync;

const { channels } = require(isDev
    ? "../src/shared/constants"
    : "./src/shared/constants");

let mainWindow = null;

function initialize() {
    makeSingleInstance();
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

    function createWindow() {
        mainWindow = new BrowserWindow({
            width: 900,
            height: 680,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, "preload.js")
            }
        });
        mainWindow.loadURL(
            isDev
                ? "http://localhost:3000"
                : `file://${path.join(__dirname, "../build/index.html")}`
        );
        mainWindow.on("closed", () => (mainWindow = null));
    }

    app.on("ready", createWindow);

    var ports = [];
    ipcMain.on(channels.PORT_MESSAGE, (event, arg) => {
        ports.push(arg);
        event.sender.send(channels.PORT_MESSAGE, ports);
    });

    app.on("before-quit", () => {
        killPort(ports[0], "tcp");
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    app.on("activate", () => {
        if (mainWindow === null) {
            createWindow();
        }
    });

    ipcMain.on(channels.APP_INFO, event => {
        event.sender.send(channels.APP_INFO, {
            appName: app.getName(),
            appVersion: app.getVersion()
        });
    });

    // ipcMain.on(channels.PROCESS_PLATFORM, (event) => {
    //     event.sender.send(channels.PROCESS_PLATFORM, {
    //         appPlatform: process.platform
    //     });
    // });
}

// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
    if (process.mas) return;

    app.requestSingleInstanceLock();

    app.on("second-instance", () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}
// KILL a process knowing its PORT over TCP
function killPort(port, method = "tcp") {
    port = Number.parseInt(port);
    if (!port) {
        return console.log("Invalid argument provided for port");
    }
    if (process.platform === "win32") {
        return execSync(
            `Stop-Process -Id (Get-Net${
                method === "UDP" ? "UDP" : "TCP"
            }Connection -LocalPort ${port}).OwningProcess -Force`
        );
    }
    return execSync(
        `lsof -i ${method === "udp" ? "udp" : "tcp"}:${port} | grep ${
            method === "udp" ? "UDP" : "LISTEN"
        } | awk '{print $2}' | xargs kill -9`
    );
}

initialize();
