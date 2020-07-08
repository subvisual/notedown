import { ThemeColors, Database } from "./types";
import { LowdbAsync } from "lowdb";

export const get = async (db: LowdbAsync<Database>) => {
  return db.get("theme").value();
};

export const set = async (db: LowdbAsync<Database>, colors: ThemeColors) => {
  return db.get("theme").assign(colors).write();
};
