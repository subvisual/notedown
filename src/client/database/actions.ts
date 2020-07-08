import { LowdbAsync } from "lowdb";

import { Database } from "models/types";
import createAction from "utils/createAction";

export const databaseLoad = createAction("DB_LOAD")<LowdbAsync<Database>>();

export type DatabaseActionTypes = ReturnType<typeof databaseLoad>;
