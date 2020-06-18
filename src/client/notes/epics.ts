import { interval, of, merge } from "rxjs";
import { isString } from "lodash";
import {
  mergeMap,
  throttle,
  tap,
  ignoreElements,
  debounceTime,
  filter,
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
  notesUpdateOrAdd,
  notesSearch,
  notesSearchResult,
  notesSelect,
  notesSelectDebounced,
  notesSyncFolder,
} from "./actions";
import * as Sync from "../../models/sync";
import * as Notes from "../../models/notes";
import { RootState } from "../../models/types";

export const loadNotesEpic = (action$: ActionsObservable<NotesActionTypes>) =>
  action$.pipe(
    ofType(notesLoad.type),
    mergeMap(() => Notes.loadAll().then(notesLoadSuccess))
  );

export const notesOnboardingEpic = (
  action$: ActionsObservable<ReturnType<typeof notesLoadSuccess>>
) =>
  action$.pipe(
    ofType(notesLoadSuccess.type),
    mergeMap(({ payload }) => of(payload.length)),
    tap(console.log),
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
  action$: ActionsObservable<ReturnType<typeof notesAdd>>
) =>
  action$.pipe(
    ofType(notesAdd.type),
    mergeMap(({ payload }) =>
      Notes.add({ content: payload }).then(notesAddSuccess)
    )
  );

export const notesUpdateOrAddEpic = (
  action$: ActionsObservable<ReturnType<typeof notesUpdateOrAdd>>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(notesUpdateOrAdd.type),
    mergeMap(({ payload }) => {
      if (state$.value.notes.edit) {
        return of(
          notesUpdate({
            ...state$.value.notes.edit,
            ...payload,
          })
        );
      } else {
        return of(notesAdd(payload.content));
      }
    })
  );

export const notesRemoveEpic = (
  action$: ActionsObservable<ReturnType<typeof notesRemove>>
) =>
  action$.pipe(
    ofType(notesRemove.type),
    tap(({ payload }) => Notes.remove(payload)),
    ignoreElements()
  );

export const notesUpdateEpic = (
  action$: ActionsObservable<ReturnType<typeof notesUpdate>>
) =>
  action$.pipe(
    ofType(notesUpdate.type),
    tap(({ payload }) => Notes.update(payload)),
    ignoreElements()
  );

export const notesSelectEpic = (
  action$: ActionsObservable<ReturnType<typeof notesSelect>>
) =>
  action$.pipe(
    ofType(notesSelect.type),
    throttle(() => interval(60), { leading: true, trailing: true }),
    mergeMap(({ payload }) => of(notesSelectDebounced(payload)))
  );

export const notesSearchEpic = (
  action$: ActionsObservable<ReturnType<typeof notesSearch>>
) =>
  action$.pipe(
    ofType(notesSearch.type),
    throttle(() => interval(200), { trailing: true }),
    mergeMap(({ payload }) => Notes.search(payload).then(notesSearchResult))
  );

export const notesSyncEpic = (
  action$: ActionsObservable<
    | ReturnType<typeof notesAddSuccess>
    | ReturnType<typeof notesUpdate>
    | ReturnType<typeof notesRemove>
  >
) =>
  merge(
    interval(60000),
    action$.pipe(
      ofType(notesAddSuccess.type, notesRemove.type, notesUpdate.type)
    )
  ).pipe(
    debounceTime(5000),
    tap(() => Sync.run()),
    mergeMap(() => of(notesLoad()))
  );

export const notesSyncFolderEpic = (
  action$: ActionsObservable<ReturnType<typeof notesSyncFolder>>
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
    mergeMap((path) => Sync.setFolder(path)),
    ignoreElements()
  );

export const notesEpics = [
  loadNotesEpic,
  notesAddEpic,
  notesRemoveEpic,
  notesUpdateEpic,
  notesUpdateOrAddEpic,
  notesSearchEpic,
  notesSelectEpic,
  notesSyncEpic,
  notesSyncFolderEpic,
  notesOnboardingEpic,
];
