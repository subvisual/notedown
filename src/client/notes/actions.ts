import { Note, SearchResult } from "models/types";
import createAction from "utils/createAction";

export const notesSelect = createAction("NOTES_SELECT")<Note>();
export const notesSelectDebounced = createAction("NOTES_SELECT_DEBOUNCED")<
  Note
>();
export const notesDelete = createAction("NOTES_DELETE")<string>();
export const notesRemove = createAction("NOTES_REMOVE")<string>();
export const notesUpdate = createAction("NOTES_UPDATE")<Note>();
export const notesEdit = createAction("NOTES_EDIT")<Note>();
export const notesEditTmp = createAction("NOTES_EDIT_TMP")<Note>();
export const notesAdd = createAction("NOTES_ADD")<string>();
export const notesAddSuccess = createAction("NOTES_ADD_SUCCESS")<Note>();
export const notesLoad = createAction("NOTES_LOAD")();
export const notesLoadSuccess = createAction("NOTES_LOAD_SUCCESS")<Note[]>();
export const notesSelectDown = createAction("NOTES_SELECT_DOWN")();
export const notesSearch = createAction("NOTES_SEARCH")<string>();
export const notesSearchResult = createAction("NOTES_SEARCH_RESULT")<
  SearchResult[]
>();
export const notesSyncFolder = createAction("NOTES_SYNC_FOLDER")();

export type NotesActionTypes =
  | ReturnType<typeof notesSyncFolder>
  | ReturnType<typeof notesSelectDebounced>
  | ReturnType<typeof notesSearchResult>
  | ReturnType<typeof notesSearch>
  | ReturnType<typeof notesSelect>
  | ReturnType<typeof notesUpdate>
  | ReturnType<typeof notesEdit>
  | ReturnType<typeof notesEditTmp>
  | ReturnType<typeof notesDelete>
  | ReturnType<typeof notesRemove>
  | ReturnType<typeof notesAdd>
  | ReturnType<typeof notesAddSuccess>
  | ReturnType<typeof notesLoad>
  | ReturnType<typeof notesLoadSuccess>
  | ReturnType<typeof notesSelectDown>;
