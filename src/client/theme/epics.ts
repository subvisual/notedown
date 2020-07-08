import { ofType, ActionsObservable } from "redux-observable";
import { mergeMap, tap, ignoreElements } from "rxjs/operators";
import { StateObservable } from "redux-observable";

import { ThemeActionTypes, themeLoad, themeColors } from "./actions";
import * as Theme from "models/theme";
import { RootState } from "models/types";

export const loadThemeEpic = (
  action$: ActionsObservable<ThemeActionTypes>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(themeLoad.type),
    mergeMap(() => Theme.get(state$.value.db.db).then(themeColors))
  );

export const setThemeEpic = (
  action$: ActionsObservable<ThemeActionTypes>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(themeColors.type),
    tap(({ payload }) => Theme.set(state$.value.db.db, payload)),
    ignoreElements()
  );

export const themeEpics = [loadThemeEpic, setThemeEpic];
