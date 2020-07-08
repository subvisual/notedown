import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";

import { notesReducer } from "../notes/reducers";
import { themeReducer } from "../theme/reducers";
import { modeReducer } from "../mode/reducers";
import { databaseReducer } from "../database/reducers";

import { notesEpics } from "../notes/epics";
import { themeEpics } from "../theme/epics";

export const rootEpic = combineEpics.apply(this, [
  ...notesEpics,
  ...themeEpics,
]);

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware();

export default function configureStore() {
  const store = createStore(
    combineReducers({
      notes: notesReducer,
      theme: themeReducer,
      mode: modeReducer,
      db: databaseReducer,
    }),
    composeEnhancers(applyMiddleware(epicMiddleware))
  );

  epicMiddleware.run(rootEpic);

  return store;
}
