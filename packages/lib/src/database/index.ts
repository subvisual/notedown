import { app } from "electron";
import * as SQLite3 from "sqlite3";

import { Database } from "../types";
import * as migrations from "./sqlite/migrations";
import * as migrateLegacyFileDB from "./migrateLegacyFileDB";

let localApp = app;

const isRenderer = process && process.type === "renderer";

if (isRenderer) {
  const { remote } = window.require("electron");
  localApp = remote.app;
}

export const file = `${localApp.getPath("userData")}/notedown.sqlite`;

export const createDatabase = async () => {
  const sqlite = new SQLite3.Database(file);

  const db = new Database(sqlite);

  try {
    if (isRenderer) {
      await migrations.run(db);
      await migrateLegacyFileDB.run(db);
    }
  } catch (e) {
    console.error(e);
  }

  return db;
};
