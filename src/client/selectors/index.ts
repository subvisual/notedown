import { find, orderBy, compact } from "lodash";
import { createSelector } from "reselect";

import { Note, RootState } from "../../models/types";

export const getAllNotes = (state: RootState) => state.notes.notes;

export const getDeletingNote = (state: RootState) =>
  state.notes.deleting
    ? find(state.notes.notes, { id: state.notes.deleting })
    : null;

export const getSelectedId = (state: RootState) => state.notes.selectedId;

export const getSelected = createSelector(
  getAllNotes,
  getSelectedId,
  (notes, id) => find(notes, { id })
);

export const getEdit = (state: RootState) => state.notes.edit;

export const getFocusedNoteId = (state: RootState) => state.notes.focusId;

export const getSearchQuery = (state: RootState) => state.notes.searchQuery;

export const getSearchResult = (state: RootState) => state.notes.searchResult;

export const getSearchResultNotes = createSelector(
  getSearchQuery,
  getAllNotes,
  getSearchResult,
  (searchQuery, notes, searchResult) =>
    searchQuery
      ? orderBy(
          compact(searchResult.map(({ id }) => find(notes, { id }))),
          (note: Note) => new Date(note.createdAt),
          "desc"
        )
      : notes.filter((note) => !note.archived)
);

export const getTheme = (state: RootState) => state.settings;

export const getMode = (state: RootState) => state.mode.name;

export const getWritingFocusMode = (state: RootState) =>
  state.mode.name === "editorFocus";

export const getDb = (state: RootState) => state.db.db;

export const getBackupFolder = (state: RootState) =>
  state.settings.backupFolder;
