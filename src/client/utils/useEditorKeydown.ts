import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMode } from "../selectors";
import { modeClose } from "../mode";

export const useEditorKeydown = (
  ref: React.MutableRefObject<HTMLDivElement>,
  editor: CodeMirror.Editor,
  focus: boolean
) => {
  const dispatch = useDispatch();
  const currentMode = useSelector(getMode);

  React.useLayoutEffect(() => {
    if (!focus) dispatch(modeClose());

    const localHandler = (e: KeyboardEvent) => {
      e.stopPropagation();
    };

    ref.current.addEventListener("keydown", localHandler);

    return () => ref.current.removeEventListener("keydown", localHandler);
  }, [ref.current, editor, focus]);

  React.useLayoutEffect(() => {
    if (currentMode !== "editor" && currentMode !== "editorFocus") return;

    setImmediate(() => editor.focus());
  }, [editor, currentMode]);
};
