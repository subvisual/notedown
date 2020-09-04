import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";

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

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware();

export default function configureStore() {
  const store = createStore(
    combineReducers({
      notes: notesReducer,
      settings: settingsReducer,
      mode: modeReducer,
      db: databaseReducer,
    }),
    composeEnhancers(applyMiddleware(epicMiddleware))
  );

  epicMiddleware.run(rootEpic);

  return store;
}
