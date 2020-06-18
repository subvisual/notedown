import { ModeActionTypes, modeSet, modeClose } from "./actions";
import { ModeState } from "../../models/types";

export function modeReducer(state: ModeState, action: ModeActionTypes) {
  switch (action.type) {
    case modeSet.type: {
      if (state.name === "search" && action.payload === "search")
        return { ...state, name: null };

      return { ...state, name: action.payload };
    }

    case modeClose.type:
      return { ...state, name: null };
    default:
      return state || { name: null };
  }
}
