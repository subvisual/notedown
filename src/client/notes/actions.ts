import { DraftNote, Note, SearchResult } from "models/types";
import createAction from "utils/createAction";

export const notesSelect = createAction("NOTES_SELECT")<number>();
export const notesSelectDebounced = createAction("NOTES_SELECT_DEBOUNCED")<
  number
>();
export const notesDelete = createAction("NOTES_DELETE")<number>();
export const notesRemove = createAction("NOTES_REMOVE")<number>();
export const notesUpdate = createAction("NOTES_UPDATE")<Note>();
export const notesEdit = createAction("NOTES_EDIT")<Note | null>();
export const notesEditSuccess = createAction("NOTES_EDIT_SUCCESS")<Note>();
export const notesEditTmp = createAction("NOTES_EDIT_TMP")<Note | DraftNote>();
export const notesAdd = createAction("NOTES_ADD")<
  Pick<Note, "content" | "history">
>();
export const notesAddSuccess = createAction("NOTES_ADD_SUCCESS")<Note>();
export const notesLoad = createAction("NOTES_LOAD")();
export const notesLoadSuccess = createAction("NOTES_LOAD_SUCCESS")<Note[]>();
export const notesSelectDown = createAction("NOTES_SELECT_DOWN")();
export const notesLoadSavedQueries = createAction("NOTES_LOAD_SAVED_QUERIES")();
export const notesLoadSavedQueriesResult = createAction(
  "NOTES_LOAD_SAVED_QUERIES_RESULT"
)<string[]>();
export const notesSaveSearch = createAction("NOTES_SAVE_SEARCH")<string>();
export const notesSearch = createAction("NOTES_SEARCH")<string>();
export const notesSearchResult = createAction("NOTES_SEARCH_RESULT")<
  SearchResult[]
>();

export type NotesActionTypes =
  | ReturnType<typeof notesLoadSavedQueriesResult>
  | ReturnType<typeof notesSelectDebounced>
  | ReturnType<typeof notesSearchResult>
  | ReturnType<typeof notesSaveSearch>
  | ReturnType<typeof notesSearch>
  | ReturnType<typeof notesSelect>
  | ReturnType<typeof notesUpdate>
  | ReturnType<typeof notesEdit>
  | ReturnType<typeof notesEditSuccess>
  | ReturnType<typeof notesEditTmp>
  | ReturnType<typeof notesDelete>
  | ReturnType<typeof notesRemove>
  | ReturnType<typeof notesAdd>
  | ReturnType<typeof notesAddSuccess>
  | ReturnType<typeof notesLoad>
  | ReturnType<typeof notesLoadSuccess>
  | ReturnType<typeof notesSelectDown>;
