import { Database } from "../database";

import migration1 from "./001-initial.sql";
import migration2 from "./002-settings.sql";

const migrations = [migration1, migration2].map((sql, index) => ({
  id: index,
  sql,
}));

interface DatabaseMigrations {
  id: number;
}

export const run = async (db: Database) => {
  db.serialize(function () {
    db.run(`CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY
    )`);
  });

  const dbMigrations = (await db.all(
    `SELECT id FROM migrations ORDER BY id ASC`
  )) as DatabaseMigrations[];

  const lastMigrationId = dbMigrations.length
    ? dbMigrations[dbMigrations.length - 1].id
    : -1;

  for (const migration of migrations) {
    if (migration.id > lastMigrationId) {
      await db.run("BEGIN");
      try {
        await db.exec(migration.sql);
        await db.run(`INSERT INTO migrations (id) VALUES (?)`, [migration.id]);
        await db.run("COMMIT");
      } catch (err) {
        await db.run("ROLLBACK");
        throw err;
      }
    }
  }
};
