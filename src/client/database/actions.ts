import { Database } from "models/types";
import createAction from "utils/createAction";

export const databaseLoad = createAction("DB_LOAD")<{
  db: Database;
}>();

export type DatabaseActionTypes = ReturnType<typeof databaseLoad>;
