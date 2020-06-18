import * as path from "path";
import * as fs from "fs";
import * as shortid from "shortid";
const { remote } = window.require("electron");

const app = remote.app;
const axios = remote.getGlobal("axios");

const fsPromises = fs.promises;

export const folder = path.join(app.getPath("userData"), "files");

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

export const addRemoteFile = async (url: string) => {
  const id = shortid();

  const response = await axios.get(url, { responseType: "arraybuffer" });

  const ext = getExtension(response.headers["content-type"]);
  const fileName = `${id}.${ext}`.toLowerCase();

  const filePath = path.join(folder, fileName);
  await fsPromises.writeFile(filePath, response.data);

  return { id, filePath, fileName };
};

export const addLocalFile = async (file: File) => {
  const id = shortid();

  const data = await fsPromises.readFile(file.path);

  const fileName = (
    id + file.name.replace("(", "-").replace(")", "-")
  ).toLowerCase();
  const filePath = path.join(folder, fileName);
  await fsPromises.writeFile(filePath, data);

  return { id, filePath, fileName: fileName };
};

export const addBuffer = async (buffer: Buffer) => {
  const id = shortid();
  const fileName = id.toLowerCase();
  const filePath = path.join(folder, fileName);
  await fsPromises.writeFile(filePath, buffer);

  return { id, filePath, fileName: fileName };
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
