import { ofType, ActionsObservable, StateObservable } from "redux-observable";
import { mergeMap, filter, tap, ignoreElements } from "rxjs/operators";
import { of } from "rxjs";

import { modeHandleKey, modeSet } from "./reducers";
import { RootState, Note } from "models/types";
import { getSearchResultNotes, getAllNotes, getSelected } from "selectors";
import { findIndex } from "lodash";
import { notesSelect, notesEdit, notesDelete, notesSearch } from "notes";

const getSelectedNoteIndex = (notes: Note[], selected: Note) => {
  return selected && findIndex(notes, (note) => note.id === selected.id);
};

export const modeNotesKeyEpic = (
  action$: ActionsObservable<ReturnType<typeof modeHandleKey>>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    filter(() => state$.value.mode.name === "notes"),
    ofType(modeHandleKey.type),
    mergeMap(({ payload: { key, ctrlKey, metaKey } }) => {
      if (ctrlKey || metaKey) return of();

      if (key === "/" || key === "f") {
        // SEARCH
        return of(modeSet("search"));
      } else if (key === "j" || key === "ArrowDown") {
        // MOVE DOWN
        const notes = getSearchResultNotes(state$.value);
        const selected = getSelected(state$.value);
        const index = getSelectedNoteIndex(notes, selected);
        const newIndex = selected ? Math.min(index + 1, notes.length - 1) : 0;

        return of(notesSelect(notes[newIndex].id));
      } else if (key === "k" || key === "ArrowUp") {
        // MOVE UP
        const notes = getSearchResultNotes(state$.value);
        const selected = getSelected(state$.value);
        const index = getSelectedNoteIndex(notes, selected);
        const newIndex = selected ? Math.max(index - 1, 0) : 0;

        return of(notesSelect(notes[newIndex].id));
      } else if (key === "e") {
        // EDIT
        return of(notesEdit());
      } else if (key === "d") {
        // DELETE
        return of(notesDelete(null));
      } else if (key === "t") {
        // FOCUS
        return of(modeSet("editorFocus"));
      } else if (key === "h") {
        // HELP
        return of(modeSet("tips"));
      } else if (key === "s") {
        // SHORTCUTS
        return of(modeSet("shortcuts"));
      } else if (key === "i") {
        // MOVE TO EDITOR
        return of(modeSet("editor"));
      } else if (key === "c") {
        // COLOR PICKER
        return of(modeSet("colorPicker"));
      } else if (key === "G") {
        // LAST
        const notes = getAllNotes(state$.value);
        return of(notesSelect(notes[notes.length - 1].id));
      } else if (key === "g") {
        // FIRST
        const notes = getAllNotes(state$.value);
        return of(notesSelect(notes[0].id));
      } else {
        return of();
      }
    })
  );

export const modeSearchKeyEpic = (
  action$: ActionsObservable<ReturnType<typeof modeHandleKey>>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    filter(() => state$.value.mode.name === "search"),
    ofType(modeHandleKey.type),
    mergeMap(({ payload }) => {
      const nr = parseInt(payload.key, 10);

      if (nr && nr < 10 && nr > 0 && (payload.ctrlKey || payload.metaKey)) {
        return of(notesSearch(state$.value.notes.savedSearches[nr - 1]));
      }

      return of();
    })
  );

export const modeEpics = [modeNotesKeyEpic, modeSearchKeyEpic];
