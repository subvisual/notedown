import * as elasticlunr from "elasticlunr";
import * as fs from "fs";

import { indexFile } from "./database";

interface IndexNote {
  content: string;
  createdAt: string;
  id: string;
}

elasticlunr.tokenizer.setSeperator(/[\s\-\]/[\.]+/);

let idx = elasticlunr<IndexNote>(function () {
  this.addField("createdAt");
  this.addField("content");
  this.setRef("id");
  this.saveDocument(false);
});

export const search = async (query: string) => {
  return idx.search(query, {
    // @ts-ignore
    expand: true,
  });
};

export const add = (doc: IndexNote) => idx.addDoc(doc);

export const update = (doc: IndexNote) => idx.updateDoc(doc);

export const remove = (id: string) => idx.removeDocByRef(id);

export const saveIndex = async () => {
  const data = idx.toJSON();
  return fs.promises.writeFile(indexFile, JSON.stringify(data, null, 2));
};

export const hasSavedIndex = (): boolean => {
  return fs.existsSync(indexFile);
};

export const loadIndex = async () => {
  const data = await fs.promises.readFile(indexFile, "utf-8");
  idx = elasticlunr.Index.load(JSON.parse(data));
};
