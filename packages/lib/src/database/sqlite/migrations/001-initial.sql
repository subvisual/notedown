CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY NOT NULL,
  content TEXT NOT NULL,
  pdfsContent TEXT,
  archived BOOLEAN NOT NULL DEFAULT 0,
  deleted BOOLEAN NOT NULL DEFAULT 0,
  history TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(
  id UNINDEXED,
  content,
  pdfsContent,
  createdAt,
  content='notes',
  content_rowid='id',
  tokenize='porter'
);

CREATE TRIGGER IF NOT EXISTS notes_ai AFTER INSERT ON notes
BEGIN
  INSERT INTO notes_fts (rowid, content, createdAt, pdfsContent)
  VALUES (new.id, new.content, new.createdAt, new.pdfsContent);
END;

CREATE TRIGGER IF NOT EXISTS notes_ad AFTER DELETE ON notes
BEGIN
  INSERT INTO notes_fts (notes_fts, rowid, content, createdAt, pdfsContent)
  VALUES ('delete', old.id, old.content, old.createdAt, old.pdfsContent);
END;

CREATE TRIGGER IF NOT EXISTS notes_au AFTER UPDATE ON notes
BEGIN
  INSERT INTO notes_fts (notes_fts, rowid, content, createdAt, pdfsContent)
  VALUES ('delete', old.id, old.content, old.createdAt, old.pdfsContent);
  INSERT INTO notes_fts (rowid, content, createdAt, pdfsContent)
  VALUES (new.id, new.content, new.createdAt, new.pdfsContent);
END;
