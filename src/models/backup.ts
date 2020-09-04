import * as fs from "fs";
import * as path from "path";

import { file } from "models/database";
import { folder } from "models/files";

const fsPromises = fs.promises;

export const get = async () => {
  return localStorage.getItem("backupFolder") || null;
};

export const set = async (folder: string | null) => {
  localStorage.setItem("backupFolder", folder || "");
  return folder;
};

export const run = async (backupFolder: string) => {
  await fsPromises.copyFile(file, path.join(backupFolder, "notedown.sqlite"));

  try {
    await fsPromises.mkdir(path.join(backupFolder, "files"));
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }

  const allFiles = await fsPromises.readdir(folder);

  allFiles.map(async (file) => {
    try {
      await fsPromises.copyFile(
        path.join(folder, file),
        path.join(backupFolder, "files", file),
        fs.constants.COPYFILE_EXCL
      );
    } catch (_) {}
  });
};
