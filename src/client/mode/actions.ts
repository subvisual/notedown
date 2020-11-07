import createAction from "../utils/createAction";

export const modeSet = createAction("MODE_SET")<string>();
export const modeClose = createAction("MODE_CLOSE")();
export const modeHandleKey = createAction("MODE_HANDLE_KEY")<{
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
}>();

export type ModeActionTypes =
  | ReturnType<typeof modeHandleKey>
  | ReturnType<typeof modeSet>
  | ReturnType<typeof modeClose>;
