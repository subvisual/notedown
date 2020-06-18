import { ThemeColors } from "../client/theme";

export type Note = {
  archived?: boolean;
  content: string;
  createdAt: Date;
  deleted: boolean;
  id: string;
  updatedAt: Date;
};

export type SearchResult = {
  ref: string;
  score: number;
};

export interface NotesState {
  deleting?: string;
  edit?: Note;
  focusId?: string;
  notes: Note[];
  searchQuery: string;
  searchResult: SearchResult[];
  selected?: Note;
}

export interface ThemeState {
  colors: ThemeColors;
}

export interface ModeState {
  name: "tips" | "shortcuts" | "colorPicker" | "search" | "editor";
}

export interface MenuBarState {
  show: boolean;
  previewId: string;
  previewOnHover: boolean;
}

export interface RootState {
  notes: NotesState;
  theme: ThemeState;
  mode: ModeState;
  menuBar: MenuBarState;
}

export interface Database {
  entries: Note[];
  theme: ThemeColors;
}

export { ThemeColors } from "../client/theme";
