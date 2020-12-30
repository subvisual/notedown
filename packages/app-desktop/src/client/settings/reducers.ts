import { createSlice } from "@reduxjs/toolkit";

import { SettingsState } from "@notedown/lib/types";

const initialState: SettingsState = {
  colors: {
    background1: "#2a2438",
    background2: "#352f44",
    accent1: "#411e8f",
  },
};

const settings = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    themeColors: (state, action) => {
      return { ...state, colors: action.payload };
    },
    backupFolderResult: (state, action) => {
      return { ...state, backupFolder: action.payload };
    },
    themeLoad: (state) => state,
    backupFolder: (state) => state,
    backupFolderSet: (state, _action) => state,
  },
});

export const {
  themeColors,
  themeLoad,
  backupFolder,
  backupFolderResult,
  backupFolderSet,
} = settings.actions;

export const settingsReducer = settings.reducer;
