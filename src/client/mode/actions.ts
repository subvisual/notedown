import createAction from "../utils/createAction";

export const modeSet = createAction("MODALS_SET")<string>();
export const modeClose = createAction("MODALS_CLOSE")();
export const modeHandleKey = createAction("MODALS_HANDLE_KEY")<{
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
}>();

export type ModeActionTypes =
  | ReturnType<typeof modeHandleKey>
  | ReturnType<typeof modeSet>
  | ReturnType<typeof modeClose>;
