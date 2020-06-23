import * as PDFJS from "pdfjs-dist";
import * as shortid from "shortid";
import * as elasticlunr from "elasticlunr";
import { range, flatten, compact } from "lodash";
import { format } from "date-fns";

import { Note } from "./types";
import { db as DB } from "./database";

//@ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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
  idx.addDoc(await formatDocumentForIndex(note));

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

  idx.removeDoc(await formatDocumentForIndex(note));
};

export const update = async (
  note: Note,
  { db }: { db?: typeof DB } = { db: DB }
) => {
  db.get("entries")
    .find({ id: note.id })
    .assign({ ...note, updatedAt: new Date() })
    .write();
  idx.updateDoc(await formatDocumentForIndex(note));
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
    idx.addDoc(await formatDocumentForIndex(note));
    return;
  }

  if (new Date(found.updatedAt) < new Date(note.updatedAt)) {
    db.get("entries")
      .find({ id: note.id })
      .assign({ ...note })
      .write();

    idx.updateDoc(await formatDocumentForIndex(note));
  }
};

export const search = async (query: string) => {
  return idx.search(query, {
    // @ts-ignore
    expand: true,
  });
};

loadAll().then((notes) =>
  notes.map(async (note) => idx.addDoc(await formatDocumentForIndex(note)))
);

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
