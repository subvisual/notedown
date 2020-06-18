import createAction from "../utils/createAction";

export interface ThemeColors {
  background1: string;
  background2: string;
  accent1: string;
}

export const themeColors = createAction("THEME_COLORS")<ThemeColors>();
export const themeLoad = createAction("THEME_LOAD")();

export type ThemeActionTypes =
  | ReturnType<typeof themeColors>
  | ReturnType<typeof themeLoad>;
