import { createSlice } from "@reduxjs/toolkit";

import { DatabaseState } from "@notedown/lib/types";

const initialState: DatabaseState = { db: null };

const database = createSlice({
  name: "database",
  initialState: initialState,
  reducers: {
    databaseLoad: (state, action) => {
      return { ...state, db: action.payload.db };
    },
  },
});

export const { databaseLoad } = database.actions;

export const databaseReducer = database.reducer;
