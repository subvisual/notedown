import * as fs from "tauri/api/fs";
import * as SQLite3 from "sqlite3";

import { Database } from "../types";
import * as migrations from "./sqlite/migrations";
import * as migrateLegacyFileDB from "./migrateLegacyFileDB";

// const isRenderer = process && process.type === "renderer";

export const createDatabase = async () => {
  console.log("here", fs.BaseDirectory.Data);
  const sqlite = new SQLite3.Database(
    `${fs.BaseDirectory.Data}/notedown.sqlite`
  );

  const db = new Database(sqlite);

  try {
    await migrations.run(db);
    await migrateLegacyFileDB.run(db);
  } catch (e) {
    console.error(e);
  }

  return db;
};
