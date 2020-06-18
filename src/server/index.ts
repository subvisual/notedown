import { app, BrowserWindow, protocol, shell, session } from "electron";
import * as path from "path";
import * as isDev from "electron-is-dev";
import * as querystring from "querystring";
import * as axios from "axios";
import { exec } from "child_process";
import * as os from "os";

import * as Theme from "../models/theme";

const filesFolder = path.join(app.getPath("userData"), "files");

let mainWindow: Electron.BrowserWindow;

declare global {
  namespace NodeJS {
    interface Global {
      axios: any;
    }
  }
}

global.axios = axios;

protocol.registerSchemesAsPrivileged([
  {
    scheme: "notesfile",
    privileges: {
      standard: true,
      secure: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

async function createWindow() {
  protocol.registerFileProtocol("notesfile", (request, cb) => {
    let url = request.url.substr(12);

    if (url[url.length - 1] === "/") {
      url = url.substr(0, url.length - 1);
    }

    url = querystring.unescape(url);

    cb({ path: path.join(filesFolder, url) });
  });

  if (isDev) {
    session.defaultSession.loadExtension(
      path.join(
        os.homedir(),
        "/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0"
      )
    );
  }

  const colors = await Theme.get();

  mainWindow = new BrowserWindow({
    backgroundColor: colors.background1,
    height: 900,
    show: false,
    titleBarStyle: "hiddenInset",
    width: 1500,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.menuBarVisible = false;

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:8080"
      : `file://${path.join(__dirname, "../../build/client/index.html")}`
  );

  if (isDev) setTimeout(() => mainWindow.webContents.openDevTools(), 4000);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.startsWith("notesfile")) {
      let fileURL = url;

      if (fileURL[fileURL.length - 1] === "/") {
        fileURL = fileURL.substr(0, fileURL.length - 1);
      }

      fileURL = querystring.unescape(fileURL).replace("notesfile:/", "");

      exec(`open \"${path.join(filesFolder, fileURL)}\"`);
      event.preventDefault();
      return;
    }

    if (url.startsWith("http://localhost")) return;

    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.webContents.on("new-window", (event, url) => {
    if (url.startsWith("notesfile")) {
      let fileURL = url;

      if (fileURL[fileURL.length - 1] === "/") {
        fileURL = fileURL.substr(0, fileURL.length - 1);
      }

      fileURL = querystring.unescape(fileURL);
      exec(
        "open " + path.join(filesFolder, fileURL.replace("notesfile:/", ""))
      );
      event.preventDefault();
      return;
    }

    if (url.startsWith("http://localhost")) return;

    event.preventDefault();
    shell.openExternal(url);
  });
}

app.allowRendererProcessReuse = true;

app.on("ready", createWindow);

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
