import createAction from "../utils/createAction";
import { ThemeColors } from "../../models/types";

export const themeColors = createAction("THEME_COLORS")<ThemeColors>();
export const themeLoad = createAction("THEME_LOAD")();
export const backupFolder = createAction("BACKUP_FOLDER")();
export const backupFolderResult = createAction("BACKUP_FOLDER_RESULT")<
  string | undefined
>();
export const backupFolderSet = createAction("BACKUP_FOLDER_SET")<
  string | null
>();

export type SettingsActionTypes =
  | ReturnType<typeof backupFolder>
  | ReturnType<typeof backupFolderSet>
  | ReturnType<typeof backupFolderResult>
  | ReturnType<typeof themeColors>
  | ReturnType<typeof themeLoad>;

export { ThemeColors };
