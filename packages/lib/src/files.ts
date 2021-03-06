import * as path from "path";
import * as fs from "fs";
import * as shortid from "shortid";
import * as querystring from "querystring";
import { app } from "electron";
import * as axios from "axios";

let localApp = app;
let localAxios = axios as any;

const isRenderer = process && process.type === "renderer";

if (isRenderer) {
  const { remote } = window.require("electron");
  localApp = remote.app;
  localAxios = remote.getGlobal("axios");
}

const fsPromises = fs.promises;

export const folder = path.join(localApp.getPath("userData"), "files");

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}

function getExtension(contentType: string) {
  switch (contentType) {
    case "image/jpeg":
      return "jpeg";
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
  }
}

export const notesFileToFullPath = (uri: string) => {
  let url = uri.substr(12);

  if (url[url.length - 1] === "/") {
    url = url.substr(0, url.length - 1);
  }

  url = querystring.unescape(url);

  return path.join(folder, url);
};

export const addRemoteFile = async (url: string) => {
  const id = shortid();

  const response = await localAxios.get(url, { responseType: "arraybuffer" });

  const ext = getExtension(response.headers["content-type"]);
  const fileName = `${id}.${ext}`.toLowerCase();

  const filePath = path.join(folder, fileName);
  await fsPromises.writeFile(filePath, response.data);

  return { id, name: fileName, filePath, fileName };
};

export const addLocalFile = async (file: File) => {
  const id = shortid();

  const data = await fsPromises.readFile(file.path);

  const fileName = `${id}-${file.name}`
    .match(/[a-zA-Z0-9\.\-_]+/g)
    .join("-")
    .toLowerCase();
  const filePath = path.join(folder, fileName);
  await fsPromises.writeFile(filePath, data);

  return { id, name: file.name, filePath, fileName: fileName };
};

export const addBuffer = async (buffer: Buffer) => {
  const id = shortid();
  const fileName = id.toLowerCase();
  const filePath = path.join(folder, fileName);
  await fsPromises.writeFile(filePath, buffer);

  return { id, name: fileName, filePath, fileName: fileName };
};

export const get = async (fileName: string) => {
  return fsPromises.readFile(path.join(folder, fileName));
};

export const remove = async (fileName: string) => {
  try {
    await fsPromises.unlink(path.join(folder, fileName));
  } catch (e) {
    console.error(e);
  }
};
