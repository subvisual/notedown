import { ofType, ActionsObservable } from "redux-observable";
import { mergeMap, tap, ignoreElements } from "rxjs/operators";

import { ThemeActionTypes, themeLoad, themeColors } from "./actions";
import * as Theme from "../../models/theme";

export const loadThemeEpic = (action$: ActionsObservable<ThemeActionTypes>) =>
  action$.pipe(
    ofType(themeLoad.type),
    mergeMap(() => Theme.get().then(themeColors))
  );

export const setThemeEpic = (action$: ActionsObservable<ThemeActionTypes>) =>
  action$.pipe(
    ofType(themeColors.type),
    tap(({ payload }) => Theme.set(payload)),
    ignoreElements()
  );

export const themeEpics = [loadThemeEpic, setThemeEpic];
