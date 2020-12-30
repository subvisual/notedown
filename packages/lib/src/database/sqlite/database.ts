import * as SQLite3 from "sqlite3";
import { callbackify } from "util";

export class Database {
  db: SQLite3.Database;

  constructor(db: SQLite3.Database) {
    this.db = db;
  }

  exec = (sql: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      let returned = false;

      this.db.exec(sql, (err: Error | null) => {
        if (returned) return;

        returned = true;
        if (err) reject(err);
        else resolve();
      });
    });
  };

  run = (sql: string, params: any[] = []) => {
    return new Promise((resolve, reject) => {
      let returned = false;

      this.db.run(sql, params, function (err: Error | null) {
        if (returned) return;

        returned = true;
        if (err) reject(err);
        else resolve(this);
      });
    });
  };

  all = (sql: string, ...params: any[]) => {
    return new Promise((resolve, reject) => {
      let returned = false;

      this.db.all(sql, params, (err: Error | null, rows: any[]) => {
        if (returned) return;

        returned = true;
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  get = (sql: string, ...params: any[]) => {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err: Error | null, row: any) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  };

  serialize = (callback: () => void) => {
    return this.db.serialize(callback);
  };

  close = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.db.close((err: Error) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };
}
