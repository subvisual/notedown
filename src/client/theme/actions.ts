import createAction from "../utils/createAction";
import { ThemeColors } from "../../models/types";

export const themeColors = createAction("THEME_COLORS")<ThemeColors>();
export const themeLoad = createAction("THEME_LOAD")();

export type ThemeActionTypes =
  | ReturnType<typeof themeColors>
  | ReturnType<typeof themeLoad>;

export { ThemeColors };
