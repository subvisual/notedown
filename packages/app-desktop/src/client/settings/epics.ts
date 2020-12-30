import { ofType, ActionsObservable } from "redux-observable";
import { of, merge, interval } from "rxjs";
import {
  debounceTime,
  mergeMap,
  tap,
  ignoreElements,
  catchError,
  map,
  filter,
} from "rxjs/operators";
import { StateObservable } from "redux-observable";

import {
  themeLoad,
  themeColors,
  backupFolder,
  backupFolderResult,
  backupFolderSet,
} from "./reducers";
import * as Theme from "@notedown/lib/theme";
import * as Backup from "@notedown/lib/backup";
import { RootState } from "@notedown/lib/types";

export const loadThemeEpic = (
  action$: ActionsObservable<ReturnType<typeof themeLoad>>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(themeLoad.type),
    mergeMap(() => Theme.get(state$.value.db.db).then(themeColors))
  );

export const setThemeEpic = (
  action$: ActionsObservable<ReturnType<typeof themeColors>>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(themeColors.type),
    tap(({ payload }) => Theme.set(state$.value.db.db, payload)),
    ignoreElements()
  );

export const loadBackupFolderEpic = (
  action$: ActionsObservable<ReturnType<typeof backupFolder>>
) =>
  action$.pipe(
    ofType(backupFolder.type),
    mergeMap(() => Backup.get().then(backupFolderResult))
  );

export const setBackupFolderEpic = (
  action$: ActionsObservable<ReturnType<typeof backupFolderSet>>
) =>
  action$.pipe(
    ofType(backupFolderSet.type),
    mergeMap(({ payload }) => Backup.set(payload).then(backupFolderResult)),
    catchError((err) => {
      console.error(err);
      return of([]);
    })
  );

export const runBackupEpic = (
  action$: ActionsObservable<ReturnType<typeof backupFolderResult>>,
  state$: StateObservable<RootState>
) =>
  merge(
    interval(60000 * 15),
    action$.pipe(ofType(backupFolderResult.type))
  ).pipe(
    debounceTime(5000),
    map(() => state$.value.settings.backupFolder),
    filter((content: unknown) => {
      return !!content && typeof content === "string" && content !== "";
    }),
    mergeMap((backupFolder: unknown) => Backup.run(backupFolder as string)),
    ignoreElements()
  );

export const settingsEpics = [
  loadThemeEpic,
  setThemeEpic,
  loadBackupFolderEpic,
  setBackupFolderEpic,
  runBackupEpic,
];
