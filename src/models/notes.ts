import * as shortid from "shortid";
import * as elasticlunr from "elasticlunr";
import { format } from "date-fns";

import { Note } from "./types";
import { db as DB } from "./database";

interface IndexNote {
  content: string;
  createdAt: string;
  id: string;
}

elasticlunr.tokenizer.setSeperator(/[\s\-\]/[\.]+/);

const idx = elasticlunr<IndexNote>(function () {
  this.addField("createdAt");
  this.addField("content");
  this.setRef("id");
  this.saveDocument(false);
});

export const loadAll = async ({ db }: { db?: typeof DB } = { db: DB }) => {
  return db.get("entries").reject({ deleted: true }).value();
};

export const add = async (
  { content }: Pick<Note, "content">,
  { db }: { db?: typeof DB } = { db: DB }
) => {
  const note = {
    id: shortid.generate(),
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
  };

  db.get("entries").push(note).write();
  idx.addDoc(formatDocumentForIndex(note));

  return note;
};

export const remove = async (
  id: string,
  { db }: { db?: typeof DB } = { db: DB }
) => {
  const note = db.get("entries").find({ id }).value();

  db.get("entries")
    .find({ id: id })
    .assign({ ...note, deleted: true, updatedAt: new Date() })
    .write();

  idx.removeDoc(formatDocumentForIndex(note));
};

export const update = async (
  note: Note,
  { db }: { db?: typeof DB } = { db: DB }
) => {
  db.get("entries")
    .find({ id: note.id })
    .assign({ ...note, updatedAt: new Date() })
    .write();
  idx.updateDoc(formatDocumentForIndex(note));
  return;
};

export const updateOrInsert = async (
  note: Note,
  { db }: { db?: typeof DB } = { db: DB }
) => {
  if (!note) return;

  const found = db.get("entries").find({ id: note.id }).value();

  if (!found) {
    db.get("entries").push(note).write();
    idx.addDoc(formatDocumentForIndex(note));
    return;
  }

  if (new Date(found.updatedAt) < new Date(note.updatedAt)) {
    db.get("entries")
      .find({ id: note.id })
      .assign({ ...note })
      .write();

    idx.updateDoc(formatDocumentForIndex(note));
  }
};

export const search = async (query: string) => {
  return idx.search(query, {
    // @ts-ignore
    expand: true,
  });
};

loadAll().then((notes) =>
  notes.map((note) => idx.addDoc(formatDocumentForIndex(note)))
);

function formatDocumentForIndex(note: Note) {
  return {
    ...note,
    createdAt: format(new Date(note.createdAt), "cccc MMMM"),
  };
}
