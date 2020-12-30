import { Database } from "./database/sqlite/database";
export { Database } from "./database/sqlite/database";

export interface ThemeColors {
  background1: string;
  background2: string;
  accent1: string;
}

export type Note = {
  archived?: boolean;
  content: string;
  createdAt: Date;
  deleted: boolean;
  history?: object;
  id: number;
  updatedAt: Date;
};

export type DraftNote = {
  id: "draft";
  content: string;
  history?: object;
};

export type SearchResult = {
  id: number;
};

export interface NotesState {
  savedSearches: string[];
  deleting?: number;
  edit?: Note | DraftNote;
  focusId?: number;
  notes: Note[];
  searchQuery: string;
  searchResult: SearchResult[];
  selectedId?: number;
}

export interface SettingsState {
  colors: ThemeColors;
  backupFolder?: string;
}

export interface DatabaseState {
  db: Database;
}

export type ModeStateNames =
  | "settings"
  | "tips"
  | "shortcuts"
  | "colorPicker"
  | "notes"
  | "search"
  | "editor"
  | "editorFocus";

export interface ModeState {
  name: ModeStateNames;
}

export interface RootState {
  notes: NotesState;
  settings: SettingsState;
  mode: ModeState;
  db: DatabaseState;
}
