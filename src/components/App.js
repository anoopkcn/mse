// Electron modules are required using window.require()
import React, { useEffect, useState } from "react";

import { channels } from "../shared/constants";
import Dashboard from "./Dashboard";
import { writeConfig } from "../lib/global";

const { ipcRenderer } = window;

export default function App() {
    const [appName, setAppName] = useState("");
    const [appVersion, setAppVersion] = useState("");
    useEffect(() => {
        ipcRenderer.send(channels.APP_INFO);
        ipcRenderer.on(channels.APP_INFO, (event, arg) => {
            ipcRenderer.removeAllListeners(channels.APP_INFO);
            setAppName(arg.appName);
            setAppVersion(arg.appVersion);
        });
        writeConfig();
    }, []);

    console.log(appName, appVersion);

    return (
        <div className="App">
            <Dashboard />
        </div>
    );
}