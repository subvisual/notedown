import { ofType, ActionsObservable, StateObservable } from "redux-observable";
import { mergeMap, filter } from "rxjs/operators";
import { of } from "rxjs";

import { modeHandleKey, modeSet } from "./actions";
import { RootState, Note } from "models/types";
import { getSearchResultNotes, getAllNotes, getSelected } from "selectors";
import { findIndex } from "lodash";
import { notesSelect, notesEdit, notesDelete } from "notes";

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

        return of(notesSelect(notes[newIndex]));
      } else if (key === "k" || key === "ArrowUp") {
        // MOVE UP
        const notes = getSearchResultNotes(state$.value);
        const selected = getSelected(state$.value);
        const index = getSelectedNoteIndex(notes, selected);
        const newIndex = selected ? Math.max(index - 1, 0) : 0;

        return of(notesSelect(notes[newIndex]));
      } else if (key === "e") {
        // EDIT
        return of(notesEdit());
      } else if (key === "d") {
        // DELETE
        return of(notesDelete(null));
      } else if (key === "n") {
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
        return of(notesSelect(notes[notes.length - 1]));
      } else if (key === "g") {
        // FIRST
        const notes = getAllNotes(state$.value);
        return of(notesSelect(notes[0]));
      } else {
        return of();
      }
    })
  );

export const modeEpics = [modeNotesKeyEpic];
