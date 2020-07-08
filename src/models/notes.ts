import * as PDFJS from "pdfjs-dist";
import * as shortid from "shortid";
import { range, flatten, compact } from "lodash";
import { format } from "date-fns";
import { LowdbAsync } from "lowdb";

import { Note } from "./types";
import * as Index from "./index";
import { Database } from "./types";

//@ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const loadAll = async (db: LowdbAsync<Database>) => {
  return db.get("entries").reject({ deleted: true }).value();
};

export const add = async (
  db: LowdbAsync<Database>,
  { content }: Pick<Note, "content">
) => {
  const note = {
    id: shortid.generate(),
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
  };

  db.get("entries").push(note).write();
  Index.add(await formatDocumentForIndex(note));

  return note;
};

export const remove = async (db: LowdbAsync<Database>, id: string) => {
  const note = db.get("entries").find({ id }).value();

  db.get("entries")
    .find({ id: id })
    .assign({ ...note, deleted: true, updatedAt: new Date() })
    .write();

  Index.remove(id);
};

export const update = async (db: LowdbAsync<Database>, note: Note) => {
  db.get("entries")
    .find({ id: note.id })
    .assign({ ...note, updatedAt: new Date() })
    .write();
  Index.update(await formatDocumentForIndex(note));
  return;
};

export const updateOrInsert = async (db: LowdbAsync<Database>, note: Note) => {
  if (!note) return;

  const found = db.get("entries").find({ id: note.id }).value();

  if (!found) {
    db.get("entries").push(note).write();
    Index.add(await formatDocumentForIndex(note));
    return;
  }

  if (new Date(found.updatedAt) < new Date(note.updatedAt)) {
    db.get("entries")
      .find({ id: note.id })
      .assign({ ...note })
      .write();

    Index.update(await formatDocumentForIndex(note));
  }
};

export const hydrateIndex = async (db: LowdbAsync<Database>) => {
  try {
    await Index.loadIndex();
  } catch (e) {
    console.error(e);
    loadAll(db).then((notes) =>
      notes.map(async (note) => Index.add(await formatDocumentForIndex(note)))
    );
  }
};

async function formatDocumentForIndex(note: Note) {
  let content = note.content;

  if (content) {
    const pdfs = await pdfFromMarkdown(content);
    const pdfsContent = await Promise.all(pdfs.map(textFromPDF));
    content += " " + flatten(pdfsContent).join(" ");
  }

  return {
    ...note,
    content,
    createdAt: format(new Date(note.createdAt), "cccc MMMM"),
  };
}

async function pdfFromMarkdown(markdown: string) {
  const markdownPDFs = markdown.match(/\[[^\]]*\]\([^\)]*\.pdf\)/g);

  if (!markdownPDFs) return [];

  return compact(
    await Promise.all(
      markdownPDFs.map(async (content) => {
        const match = content.match(/\[[^\]]*\]\(([^\)]*\.pdf)\)/);

        if (match) return match[1];
        else return null;
      })
    )
  );
}

async function textFromPDF(pdfURL: string) {
  const res = PDFJS.getDocument(pdfURL);
  const pdf = await res.promise;
  const maxPages = pdf.numPages;

  return Promise.all(
    range(1, maxPages + 1).map(async (pageNr) => {
      const page = await pdf.getPage(pageNr);
      const pageContent = await page.getTextContent();
      return pageContent.items.map(({ str }) => str);
    })
  );
}
