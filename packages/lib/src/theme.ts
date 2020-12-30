import { ThemeColors, Database } from "./types";

export const get = async (db: Database) => {
  const result = (await db.get(
    "SELECT value FROM settings WHERE id='theme'"
  )) as { value: string };

  if (result && result.value) return JSON.parse(result.value) as ThemeColors;
  else
    return {
      background1: "#2a2438",
      background2: "#352f44",
      accent1: "#411e8f",
    };
};

export const set = async (db: Database, colors: ThemeColors) => {
  return db.run("REPLACE INTO settings(value, id) VALUES(?, 'theme')", [
    JSON.stringify(colors),
  ]);
};
