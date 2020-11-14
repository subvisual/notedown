import { orderBy } from "lodash";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Note, NotesState } from "models/types";

const initialState: NotesState = {
  notes: [],
  edit: null,
  savedSearches: [],
  searchResult: [],
  searchQuery: "",
};

const notes = createSlice({
  name: "notes",
  initialState: initialState,
  reducers: {
    notesDelete: (state, action) => {
      if (action.payload) return { ...state, deleting: action.payload };
      else if (!state.deleting && !action.payload && state.selectedId)
        return { ...state, deleting: state.selectedId };
      else return { ...state, deleting: null };
    },
    notesLoadSavedQueriesResult: (state, action) => {
      return { ...state, savedSearches: action.payload };
    },
    notesSearch: (state, action) => {
      return { ...state, searchQuery: action.payload };
    },
    notesSearchResult: (state, action) => {
      return { ...state, searchResult: action.payload };
    },
    notesAdd: (state, action) => {
      return { ...state, edit: { ...action.payload, id: "draft" } };
    },
    notesAddSuccess: (state, action) => {
      return {
        ...state,
        edit: null,
        notes: [action.payload, ...state.notes],
        selectedId: action.payload.id,
      };
    },
    notesEditSuccess: (state, action) => {
      return {
        ...state,
        edit: action.payload,
      };
    },
    notesSelectDebounced: (state, action) => {
      return { ...state, selectedId: action.payload, focusId: action.payload };
    },
    notesUpdate: (state, action) => {
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
    },
    notesLoadSuccess: (state, action) => {
      return {
        ...state,
        notes: orderBy(
          action.payload,
          (note: Note) => new Date(note.createdAt),
          "desc"
        ),
      };
    },
    notesRemove: (state, action) => {
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };
    },
    notesEdit: (state, _action: PayloadAction<Note | null>) => state,
    notesEditTmp: (state, _action) => state,
    notesSelect: (state, _action) => state,
    notesLoad: (state) => state,
    notesSelectDown: (state, _action) => state,
    notesLoadSavedQueries: (state) => state,
    notesSaveSearch: (state, _action) => state,
  },
});

export const {
  notesSelect,
  notesSelectDebounced,
  notesDelete,
  notesRemove,
  notesUpdate,
  notesEdit,
  notesEditSuccess,
  notesEditTmp,
  notesAdd,
  notesAddSuccess,
  notesLoad,
  notesLoadSuccess,
  notesSelectDown,
  notesLoadSavedQueries,
  notesLoadSavedQueriesResult,
  notesSaveSearch,
  notesSearch,
  notesSearchResult,
} = notes.actions;

export const notesReducer = notes.reducer;
