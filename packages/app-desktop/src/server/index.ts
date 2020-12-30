import { app, BrowserWindow, protocol, shell, session } from "electron";
import * as path from "path";
import * as isDev from "electron-is-dev";
import * as querystring from "querystring";
import * as axios from "axios";
import { exec } from "child_process";
import * as os from "os";

import * as Theme from "@notedown/lib/theme";
import { notesFileToFullPath } from "@notedown/lib/files";
import { createDatabase } from "@notedown/lib/database";

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
    const fileURI = notesFileToFullPath(request.url);

    cb({ path: fileURI });
  });

  if (isDev) {
    session.defaultSession.loadExtension(
      path.join(
        os.homedir(),
        "/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0"
      )
    );
  }

  let colors = null;

  try {
    const db = await createDatabase();
    colors = await Theme.get(db);
    db.close();
  } catch (e) {
    console.error(e);
  }

  mainWindow = new BrowserWindow({
    backgroundColor: colors ? colors.background1 : undefined,
    height: 900,
    titleBarStyle: "hiddenInset",
    width: 1500,
    autoHideMenuBar: true,
    minimizable: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  });

  mainWindow.menuBarVisible = false;

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
      const fileURI = notesFileToFullPath(url);
      exec(`open \"${fileURI}\"`);
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
        `open '${path.join(filesFolder, fileURL.replace("notesfile://", ""))}'`
      );
      event.preventDefault();
      return;
    }

    if (url.startsWith("http://localhost")) return;

    event.preventDefault();
    shell.openExternal(url);
  });
}

app.allowRendererProcessReuse = false;
app.setAsDefaultProtocolClient("notedown");

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("open-url", async function (event, data) {
    if (mainWindow === null) {
      await createWindow();
    }

    event.preventDefault();
    mainWindow.webContents.send("open-url", data);
  });

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
}
