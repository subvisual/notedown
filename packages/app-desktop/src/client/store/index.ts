import { combineReducers } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { configureStore } from "@reduxjs/toolkit";

import { notesReducer } from "../notes/reducers";
import { settingsReducer } from "../settings/reducers";
import { modeReducer } from "../mode/reducers";
import { databaseReducer } from "../database/reducers";

import { notesEpics } from "../notes/epics";
import { settingsEpics } from "../settings/epics";
import { modeEpics } from "../mode/epics";

export const rootEpic = combineEpics.apply(this, [
  ...notesEpics,
  ...settingsEpics,
  ...modeEpics,
]);

const epicMiddleware = createEpicMiddleware();

export default function configure() {
  const store = configureStore({
    reducer: combineReducers({
      notes: notesReducer,
      settings: settingsReducer,
      mode: modeReducer,
      db: databaseReducer,
    }),
    middleware: [epicMiddleware],
    devTools: true,
  });

  epicMiddleware.run(rootEpic);

  return store;
}
