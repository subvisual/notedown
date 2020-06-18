import * as fs from "fs";
import * as low from "lowdb";
import * as FileSync from "lowdb/adapters/FileSync";
import { app } from "electron";

import { Database } from "./types";

let localApp = app;

const isRenderer = process && process.type === "renderer";

if (isRenderer) {
  const { remote } = window.require("electron");
  localApp = remote.app;
}

export const databaseFile = `${localApp.getPath("userData")}/.timeline.json`;

export const createDatabase = (file: string) => {
  const adapter = new FileSync<Database>(file);
  const db = low(adapter);

  db.defaults({
    entries: [],
    theme: {
      background1: "#2a2438",
      background2: "#352f44",
      accent1: "#411e8f",
    },
  }).write();

  return db;
};

if (!fs.existsSync(databaseFile)) {
  fs.closeSync(fs.openSync(databaseFile, "w"));
}

export const db = createDatabase(databaseFile);
