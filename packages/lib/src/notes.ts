import * as PDFJS from "pdfjs-dist";
import { range, flatten, compact } from "lodash";

import { Note, Database } from "./types";

//@ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const search = async (db: Database, query: string) => {
  return db.all(
    "SELECT id FROM notes_fts WHERE notes_fts MATCH ? ORDER BY rank",
    query
  ) as Promise<Pick<Note, "id">[]>;
};

interface DBNote extends Omit<Note, "history"> {
  history?: string;
}

export const loadAll = async (db: Database) => {
  const notes = (await db.all(
    "SELECT * FROM notes WHERE deleted = 0 ORDER BY createdAt DESC"
  )) as DBNote[];

  return notes.map((note) => ({
    ...note,
    history: note.history ? JSON.parse(note.history) : null,
  }));
};

export const add = async (
  db: Database,
  { content, history }: Pick<Note, "content" | "history">
) => {
  const {
    lastID,
  } = (await db.run(
    "INSERT INTO notes (content, pdfsContent, history) values (?, ?, ?)",
    [content, await getPDFsContent(content), JSON.stringify(history)]
  )) as { lastID: number };

  const note = {
    id: lastID,
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
    archived: false,
  };

  return note;
};

export const remove = async (db: Database, id: number) => {
  await db.run("UPDATE notes SET deleted = 1, updatedAt = ? WHERE id = ?", [
    new Date(),
    id,
  ]);
};

export const update = async (db: Database, note: Note) => {
  await db.run(
    "UPDATE notes SET content = ?, pdfsContent = ?, history = ?, deleted = ?, archived = ?, updatedAt = ? WHERE id = ?",
    [
      note.content,
      getPDFsContent(note.content),
      JSON.stringify(note.history),
      note.deleted,
      note.archived,
      new Date(),
      note.id,
    ]
  );

  return;
};

export async function getPDFsContent(content: string) {
  let pdfsContent = "";

  if (content) {
    const pdfs = await pdfFromMarkdown(content);
    const allContent = await Promise.all(pdfs.map(textFromPDF));
    pdfsContent += " " + flatten(allContent).join(" ");
  }

  return pdfsContent;
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
