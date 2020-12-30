import { createSlice } from "@reduxjs/toolkit";

import { ModeState } from "@notedown/lib/types";

const initialState: ModeState = { name: "notes" };

const mode = createSlice({
  name: "mode",
  initialState: initialState,

  reducers: {
    modeSet: (state, action) => {
      if (state.name === "search" && action.payload === "search")
        return { ...state, name: "notes" };

      if (state.name === "editorFocus" && action.payload === "editorFocus")
        return { ...state, name: "editor" };

      return { ...state, name: action.payload };
    },
    modeClose: (state) => {
      return { ...state, name: "notes" };
    },
    modeHandleKey: (state, _) => state,
  },
});

export const { modeSet, modeClose, modeHandleKey } = mode.actions;

export const modeReducer = mode.reducer;
