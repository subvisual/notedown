import { LowdbAsync } from "lowdb";

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

export type SearchResult = {
  id: number;
};

export interface NotesState {
  deleting?: number;
  edit?: Note;
  focusId?: number;
  notes: Note[];
  searchQuery: string;
  searchResult: SearchResult[];
  selected?: Note;
}

export interface ThemeState {
  colors: ThemeColors;
}

export interface DatabaseState {
  db: Database;
}

export interface ModeState {
  name:
    | "tips"
    | "shortcuts"
    | "colorPicker"
    | "notes"
    | "search"
    | "editor"
    | "editorFocus";
}

export interface RootState {
  notes: NotesState;
  theme: ThemeState;
  mode: ModeState;
  db: DatabaseState;
}
