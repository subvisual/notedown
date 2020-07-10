import { interval, of, merge } from "rxjs";
import { isString } from "lodash";
import {
  mergeMap,
  throttle,
  tap,
  ignoreElements,
  debounceTime,
  filter,
  map,
  catchError,
} from "rxjs/operators";
import { ofType, ActionsObservable } from "redux-observable";
import { StateObservable } from "redux-observable";
import { remote } from "electron";

const { dialog } = remote;

import {
  NotesActionTypes,
  notesAdd,
  notesAddSuccess,
  notesLoadSuccess,
  notesRemove,
  notesUpdate,
  notesLoad,
  notesSearch,
  notesSearchResult,
  notesSelect,
  notesSelectDebounced,
  notesSyncFolder,
  notesEdit,
  notesEditTmp,
} from "./actions";
import * as Sync from "../../models/sync";
import * as Notes from "../../models/notes";
import * as Index from "../../models/index";
import { RootState, Note } from "../../models/types";
import { modeSet } from "mode";

export const notesRestoreTmpState = (
  action$: ActionsObservable<NotesActionTypes>
) =>
  action$.pipe(
    ofType(notesLoad.type),
    map(() => localStorage.getItem("tmpNotesEdit")),
    filter((content: unknown) => {
      return typeof content === "string" && content !== "";
    }),
    map((content: unknown) => JSON.parse(content as string)),
    catchError((err) => {
      console.error(err);
      return of(null);
    }),
    mergeMap((note: unknown) => of(notesEdit(note as Note))),
    tap((e: any) => console.log(e))
  );

export const notesSaveTmpState = (
  action$: ActionsObservable<NotesActionTypes>
) =>
  action$.pipe(
    ofType(notesEditTmp.type),
    throttle(() => interval(500), { trailing: true }),
    map(({ payload }) => (!!payload ? JSON.stringify(payload) : "")),
    tap((content) => localStorage.setItem("tmpNotesEdit", content)),
    ignoreElements()
  );

export const notesSaveIndexEpic = (
  action$: ActionsObservable<
    | ReturnType<typeof notesAddSuccess>
    | ReturnType<typeof notesUpdate>
    | ReturnType<typeof notesRemove>
  >
) =>
  action$.pipe(
    ofType(notesAddSuccess.type, notesUpdate.type, notesRemove.type),
    tap(() => Index.saveIndex()),
    ignoreElements()
  );

export const loadNotesEpic = (
  action$: ActionsObservable<NotesActionTypes>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(notesLoad.type),
    mergeMap(() => Notes.loadAll(state$.value.db.db).then(notesLoadSuccess))
  );

export const notesOnboardingEpic = (
  action$: ActionsObservable<ReturnType<typeof notesLoadSuccess>>
) =>
  action$.pipe(
    ofType(notesLoadSuccess.type),
    mergeMap(({ payload }) => of(payload.length)),
    filter((count) => count === 0),
    mergeMap(() =>
      of(
        notesAdd(`
Hi!

If this is your first time around, here are a few tips to get you started:

1. Write your notes on the right and press _Cmd+Enter_ or _Ctrl+Enter_ to save them.
2. NoteDown was designed around searching. Write everything down and use the seach _Cmd+f_ to look it up when necessary.
3. Your focus can be on the notes list, the editor, the search input or other modals. To restore the focus back to the notes list, press _Escape_.
4. From the notes list, press _s_ to see all the available shortcuts, or _h_ for more tips.
`)
      )
    )
  );

export const notesAddEpic = (
  action$: ActionsObservable<ReturnType<typeof notesAdd>>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(notesAdd.type),
    mergeMap(({ payload }) =>
      Notes.add(state$.value.db.db, { content: payload }).then(notesAddSuccess)
    )
  );

export const notesRemoveEpic = (
  action$: ActionsObservable<ReturnType<typeof notesRemove>>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(notesRemove.type),
    tap(({ payload }) => Notes.remove(state$.value.db.db, payload)),
    ignoreElements()
  );

export const notesUpdateEpic = (
  action$: ActionsObservable<ReturnType<typeof notesUpdate>>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(notesUpdate.type),
    mergeMap(({ payload }) =>
      of(state$.value.notes.notes.find((note) => note.id === payload.id))
    ),
    tap((note) => Notes.update(state$.value.db.db, note)),
    ignoreElements()
  );

export const notesSelectEpic = (
  action$: ActionsObservable<ReturnType<typeof notesSelect>>
) =>
  action$.pipe(
    ofType(notesSelect.type),
    throttle(() => interval(50), { leading: true, trailing: true }),
    mergeMap(({ payload }) => of(notesSelectDebounced(payload)))
  );

export const notesSearchEpic = (
  action$: ActionsObservable<ReturnType<typeof notesSearch>>
) =>
  action$.pipe(
    ofType(notesSearch.type),
    throttle(() => interval(200), { trailing: true }),
    mergeMap(({ payload }) => Index.search(payload).then(notesSearchResult))
  );

export const notesSyncEpic = (
  action$: ActionsObservable<
    | ReturnType<typeof notesAddSuccess>
    | ReturnType<typeof notesUpdate>
    | ReturnType<typeof notesRemove>
  >,
  state$: StateObservable<RootState>
) =>
  merge(
    interval(60000),
    action$.pipe(
      ofType(notesAddSuccess.type, notesRemove.type, notesUpdate.type)
    )
  ).pipe(
    debounceTime(5000),
    tap(() => Sync.run(state$.value.db.db)),
    mergeMap(() => of(notesLoad()))
  );

export const notesSyncFolderEpic = (
  action$: ActionsObservable<ReturnType<typeof notesSyncFolder>>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(notesSyncFolder.type),
    mergeMap(() =>
      of(
        dialog.showOpenDialogSync({
          properties: ["openDirectory", "createDirectory"],
        })
      )
    ),
    filter((path) => !!path),
    mergeMap((path) => of(path[0])),
    filter((path) => isString(path)),
    mergeMap((path) => Sync.setFolder(state$.value.db.db, path)),
    ignoreElements()
  );

export const notesEditFocusEpic = (
  action$: ActionsObservable<ReturnType<typeof notesEdit>>
) =>
  action$.pipe(
    ofType(notesEdit.type),
    debounceTime(20),
    mergeMap(() => of(modeSet("editor")))
  );

export const notesEpics = [
  loadNotesEpic,
  notesAddEpic,
  notesRemoveEpic,
  notesUpdateEpic,
  notesSearchEpic,
  notesSelectEpic,
  notesSyncEpic,
  notesSyncFolderEpic,
  notesOnboardingEpic,
  notesSaveIndexEpic,
  notesEditFocusEpic,
  notesRestoreTmpState,
  notesSaveTmpState,
];
