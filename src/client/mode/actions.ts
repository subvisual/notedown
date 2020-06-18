import createAction from "../utils/createAction";

export const modeSet = createAction("MODALS_SET")<string>();
export const modeClose = createAction("MODALS_CLOSE")();

export type ModeActionTypes =
  | ReturnType<typeof modeSet>
  | ReturnType<typeof modeClose>;
