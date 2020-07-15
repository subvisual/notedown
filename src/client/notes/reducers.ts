import { orderBy } from "lodash";

import { Note, NotesState } from "models/types";

import {
  NotesActionTypes,
  notesAddSuccess,
  notesEdit,
  notesSelectDebounced,
  notesUpdate,
  notesLoadSuccess,
  notesRemove,
  notesSearch,
  notesSearchResult,
  notesDelete,
} from "./actions";

export function notesReducer(
  state: NotesState,
  action: NotesActionTypes
): NotesState {
  switch (action.type) {
    case notesDelete.type: {
      if (action.payload) return { ...state, deleting: action.payload };
      else if (!state.deleting && !action.payload && state.selected)
        return { ...state, deleting: state.selected.id };
      else if (!action.payload) return { ...state, deleting: null };
    }

    case notesSearch.type:
      return { ...state, searchQuery: action.payload };

    case notesSearchResult.type:
      return { ...state, searchResult: action.payload };

    case notesAddSuccess.type:
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        selected: action.payload,
        focusId: action.payload.id,
      };

    case notesEdit.type: {
      if (state.selected || action.payload)
        return { ...state, edit: state.selected || action.payload };
      else return state;
    }

    case notesSelectDebounced.type:
      return { ...state, selected: action.payload, focusId: action.payload.id };

    case notesUpdate.type:
      return {
        ...state,
        edit: null,
        notes: state.notes.map((note) => {
          if (note.id === action.payload.id)
            return { ...note, ...action.payload };
          else return note;
        }),
      };

    case notesLoadSuccess.type:
      return {
        ...state,
        notes: orderBy(
          action.payload,
          (note: Note) => new Date(note.createdAt),
          "desc"
        ),
      };

    case notesRemove.type:
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };

    default:
      return (
        state || {
          notes: [],
          searchResult: [],
          searchQuery: "",
        }
      );
  }
}
