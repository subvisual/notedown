import { ModeActionTypes, modeSet, modeClose } from "./actions";
import { ModeState } from "models/types";

export function modeReducer(state: ModeState, action: ModeActionTypes) {
  switch (action.type) {
    case modeSet.type: {
      if (state.name === "search" && action.payload === "search")
        return { ...state, name: "notes" };

      if (state.name === "editorFocus" && action.payload === "editorFocus")
        return { ...state, name: "editor" };

      return { ...state, name: action.payload };
    }

    case modeClose.type:
      return { ...state, name: "notes" };
    default:
      return state || { name: "notes" };
  }
}
