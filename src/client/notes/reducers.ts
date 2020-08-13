import { orderBy, find } from "lodash";

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
  notesEditSuccess,
} from "./actions";

export function notesReducer(
  state: NotesState,
  action: NotesActionTypes
): NotesState {
  switch (action.type) {
    case notesDelete.type: {
      if (action.payload) return { ...state, deleting: action.payload };
      else if (!state.deleting && !action.payload && state.selectedId)
        return { ...state, deleting: state.selectedId };
      else return { ...state, deleting: null };
    }

    case notesSearch.type:
      return { ...state, searchQuery: action.payload };

    case notesSearchResult.type:
      return { ...state, searchResult: action.payload };

    case notesAddSuccess.type:
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        selectedId: action.payload.id,
      };

    case notesEditSuccess.type:
      return {
        ...state,
        edit: action.payload,
      };

    case notesSelectDebounced.type:
      return { ...state, selectedId: action.payload, focusId: action.payload };

    case notesUpdate.type:
      return {
        ...state,
        edit: null,
        selectedId: action.payload.id,
        notes: state.notes.map((note) => {
          if (note.id === action.payload.id)
            return { ...note, ...action.payload };
          else return note;
        }),
      };

    case notesLoadSuccess.type: {
      return {
        ...state,
        notes: orderBy(
          action.payload,
          (note: Note) => new Date(note.createdAt),
          "desc"
        ),
      };
    }

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
