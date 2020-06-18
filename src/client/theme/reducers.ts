import { ThemeActionTypes, themeColors } from "./";
import { ThemeState } from "../../models/types";

export function themeReducer(
  state: ThemeState = {
    colors: {
      background1: "#2a2438",
      background2: "#352f44",
      accent1: "#411e8f",
    },
  },
  action: ThemeActionTypes
): ThemeState {
  switch (action.type) {
    case themeColors.type:
      return { ...state, colors: action.payload };
    default:
      return state;
  }
}
