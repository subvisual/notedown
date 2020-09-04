import { SettingsActionTypes, themeColors } from "./";
import { SettingsState } from "../../models/types";
import { backupFolderResult } from "./actions";

export function settingsReducer(
  state: SettingsState = {
    colors: {
      background1: "#2a2438",
      background2: "#352f44",
      accent1: "#411e8f",
    },
  },
  action: SettingsActionTypes
): SettingsState {
  switch (action.type) {
    case themeColors.type:
      return { ...state, colors: action.payload };
    case backupFolderResult.type:
      return { ...state, backupFolder: action.payload };
    default:
      return state;
  }
}
