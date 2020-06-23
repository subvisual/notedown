import { db } from "./database";
import { ThemeColors } from "./types";

export const get = async () => {
  return db.get("theme").value();
};

export const set = async (colors: ThemeColors) => {
  return db.get("theme").assign(colors).write();
};
