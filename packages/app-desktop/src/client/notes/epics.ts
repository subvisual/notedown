import { interval, of, from } from "rxjs";
import {
  mergeMap,
  throttle,
  tap,
  ignoreElements,
  debounceTime,
  filter,
  map,
  catchError,
  take,
  concatMap,
} from "rxjs/operators";
import { ofType, ActionsObservable, StateObservable } from "redux-observable";

import {
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
  notesEdit,
  notesEditTmp,
  notesEditSuccess,
  notesSaveSearch,
  notesLoadSavedQueries,
  notesLoadSavedQueriesResult,
} from "./reducers";
import * as Notes from "@notedown/lib/notes";
import { RootState, Note } from "@notedown/lib/types";
import { modeSet } from "mode";
import { getSelected } from "selectors";
import * as Search from "@notedown/lib/search";

export const notesRestoreTmpStateEpic = (
  action$: ActionsObservable<ReturnType<typeof notesLoad>>
) =>
  action$.pipe(
    ofType(notesLoad.type),
    take(1),
    map(() => localStorage.getItem("tmpNotesEdit")),
    filter((content: unknown) => {
      return typeof content === "string" && content !== "";
    }),
    map((content: unknown) => JSON.parse(content as string)),
    catchError((err) => {
      console.error(err);
      return of(null);
    }),
    mergeMap((note: unknown) => of(notesEdit(note as Note)))
  );

export const notesSaveTmpStateEpic = (
  action$: ActionsObservable<ReturnType<typeof notesEditTmp>>
) =>
  action$.pipe(
    ofType(notesEditTmp.type),
    map(({ payload }) => (!!payload ? JSON.stringify(payload) : "")),
    tap((content) => localStorage.setItem("tmpNotesEdit", content)),
    ignoreElements()
  );

export const notesLoadEpic = (
  action$: ActionsObservable<ReturnType<typeof notesLoad>>,
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
        notesAdd({
          content: `
Hi!

If this is your first time around, here are a few tips to get you started:

1. Write your notes on the right and press _Cmd+Enter_ or _Ctrl+Enter_ to save them.
2. NoteDown was designed around searching. Write everything down and use the seach _Cmd+f_ to look it up when necessary.
3. Your focus can be on the notes list, the editor, the search input or other modals. To restore the focus back to the notes list, press _Escape_.
4. From the notes list, press _s_ to see all the available shortcuts, or _h_ for more tips.
`,
        })
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
      Notes.add(state$.value.db.db, payload).then(notesAddSuccess)
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
    tap(({ payload }) => Notes.update(state$.value.db.db, payload)),
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
  action$: ActionsObservable<ReturnType<typeof notesSearch>>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(notesSearch.type),
    filter(({ payload }) => !!payload),
    throttle(() => interval(500), { trailing: true, leading: false }),
    concatMap(({ payload }) =>
      from(Notes.search(state$.value.db.db, payload)).pipe(
        catchError((_err) => {
          return of([]);
        })
      )
    ),
    mergeMap((results) => of(notesSearchResult(results)))
  );

export const notesEditEpic = (
  action$: ActionsObservable<ReturnType<typeof notesEdit>>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(notesEdit.type),
    map(({ payload }) => (payload ? payload : getSelected(state$.value))),
    filter((note) => !!note),
    mergeMap((note) => of(notesEditSuccess(note)))
  );

export const notesEditFocusEpic = (
  action$: ActionsObservable<ReturnType<typeof notesEditSuccess>>
) =>
  action$.pipe(
    ofType(notesEditSuccess.type),
    debounceTime(20),
    mergeMap(() => of(modeSet("editor")))
  );

export const notesSaveSearchEpic = (
  action$: ActionsObservable<ReturnType<typeof notesSaveSearch>>
) =>
  action$.pipe(
    ofType(notesSaveSearch.type),
    debounceTime(500),
    map(({ payload }) => Search.save(payload)),
    mergeMap((queries) => of(notesLoadSavedQueriesResult(queries)))
  );

export const notesLoadSavedSearchEpic = (
  action$: ActionsObservable<ReturnType<typeof notesLoadSavedQueries>>
) =>
  action$.pipe(
    ofType(notesLoadSavedQueries.type),
    mergeMap(() => of(notesLoadSavedQueriesResult(Search.getAll())))
  );

export const notesEpics = [
  notesLoadEpic,
  notesAddEpic,
  notesRemoveEpic,
  notesUpdateEpic,
  notesSearchEpic,
  notesSelectEpic,
  notesOnboardingEpic,
  notesEditEpic,
  notesEditFocusEpic,
  notesRestoreTmpStateEpic,
  notesSaveTmpStateEpic,
  notesSaveSearchEpic,
  notesLoadSavedSearchEpic,
];
