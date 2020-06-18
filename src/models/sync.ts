import { app } from "electron";
import * as path from "path";
import * as fs from "fs";

import { databaseFile, createDatabase } from "./database";
import * as Notes from "./notes";
import * as Files from "./files";

interface Settings {
  syncPath: string;
}

const fsPromises = fs.promises;

let localApp = app;

const isRenderer = process && process.type === "renderer";

if (isRenderer) {
  const { remote } = window.require("electron");
  localApp = remote.app;
}

const settingsFile = `${localApp.getPath("userData")}/sync.json`;

if (!fs.existsSync(settingsFile)) {
  fs.closeSync(fs.openSync(settingsFile, "w"));
}

export const setFolder = async (path: string) => {
  let settings: Settings = { syncPath: null };

  try {
    settings = JSON.parse(await fsPromises.readFile(settingsFile, "utf-8"));
  } catch (e) {
    console.error(e);
    settings = { syncPath: null };
  }

  settings.syncPath = path;

  await fsPromises.writeFile(settingsFile, JSON.stringify(settings));
  return run();
};

export const getFolder = async () => {
  const settings = JSON.parse(await fsPromises.readFile(settingsFile, "utf-8"));
  return settings.syncPath;
};

export const run = async () => {
  try {
    const syncFolder = await getFolder();

    if (!syncFolder) return console.log("Folder for syncing not set");

    const syncFiles = path.join(syncFolder, "files");
    const syncDataFile = path.join(syncFolder, "timeline.json");

    if (!fs.existsSync(syncFiles)) fs.mkdirSync(syncFiles);

    const localFiles = await fsPromises.readdir(Files.folder);
    const remoteFiles = await fsPromises.readdir(syncFiles);

    localFiles.forEach((file) => {
      if (!remoteFiles.includes(file))
        fsPromises.copyFile(
          path.join(Files.folder, file),
          path.join(syncFiles, file)
        );
    });

    remoteFiles.forEach((file) => {
      if (!localFiles.includes(file))
        fsPromises.copyFile(
          path.join(syncFiles, file),
          path.join(Files.folder, file)
        );
    });

    if (!fs.existsSync(syncDataFile)) {
      await fsPromises.copyFile(databaseFile, syncDataFile);
      return;
    }

    const syncDB = createDatabase(syncDataFile);

    const localNotes = await Notes.loadAll();
    await Promise.all(
      localNotes.map((note) => Notes.updateOrInsert(note, { db: syncDB }))
    );

    const syncNotes = await Notes.loadAll({ db: syncDB });
    await Promise.all(syncNotes.map((note) => Notes.updateOrInsert(note)));
  } catch (e) {
    console.error(e);
  }
};
