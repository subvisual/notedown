import * as fs from "fs";
import * as low from "lowdb";
import { LowdbAsync } from "lowdb";
import * as FileAsync from "lowdb/adapters/FileAsync";
import { app } from "electron";

import { Database, ThemeColors } from "../types";
import * as Notes from "../notes";

export type Note = {
  archived?: boolean;
  content: string;
  createdAt: Date;
  deleted: boolean;
  history?: object;
  id: string;
  updatedAt: Date;
};

export interface FileDatabaseInside {
  entries: Note[];
  theme: ThemeColors;
}

export type FileDatabase = LowdbAsync<FileDatabaseInside>;

let localApp = app;

const isRenderer = process && process.type === "renderer";

if (isRenderer) {
  const { remote } = window.require("electron");
  localApp = remote.app;
}

export const databaseFile = `${localApp.getPath("userData")}/.timeline.json`;

export const fileLoadAll = async (db: FileDatabase) => {
  return db
    .get("entries")
    .reject({ deleted: true })
    .value();
};

export const getTheme = async (db: FileDatabase) => {
  return db.get("theme").value();
};

export const run = async (db: Database) => {
  const adapter = new FileAsync<FileDatabaseInside>(databaseFile);
  const fileDB = await low(adapter);

  fileDB
    .defaults({
      entries: [],
      theme: {
        background1: "#2a2438",
        background2: "#352f44",
        accent1: "#411e8f"
      }
    })
    .write();

  const notes = await fileLoadAll(fileDB);

  if (localStorage.getItem("fileDBToSQLITE") != "true") {
    try {
      await db.run("BEGIN");
      const theme = await getTheme(fileDB);

      await db.run("INSERT INTO settings (id, value) values (?, json(?))", [
        "theme",
        JSON.stringify(theme)
      ]);

      await Promise.all(
        notes.map(
          async ({
            content,
            deleted,
            createdAt,
            history,
            updatedAt,
            archived
          }) => {
            return db.run(
              "INSERT INTO notes (content, pdfsContent, deleted, archived, history, createdAt, updatedAt) values (?, ?, ?, ?, ?, ?, ?)",
              [
                content || "",
                await Notes.getPDFsContent(content),
                deleted || false,
                archived || false,
                history ? JSON.stringify(history) : null,
                createdAt,
                updatedAt
              ]
            );
          }
        )
      );

      localStorage.setItem("fileDBToSQLITE", "true");

      await db.run("COMMIT");
    } catch (e) {
      await db.run("ROLLBACK");
      console.error(e);
    }
  }
};

if (!fs.existsSync(databaseFile)) {
  fs.closeSync(fs.openSync(databaseFile, "w"));
}
