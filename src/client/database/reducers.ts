import { DatabaseState } from "models/types";

import { DatabaseActionTypes, databaseLoad } from "./actions";

export function databaseReducer(
  state: DatabaseState,
  action: DatabaseActionTypes
): DatabaseState {
  switch (action.type) {
    case databaseLoad.type:
      return { ...state, db: action.payload };
    default:
      return (
        state || {
          db: null,
        }
      );
  }
}
