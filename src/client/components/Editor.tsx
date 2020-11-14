import * as React from "react";
import * as _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { CodeMirrorEditor } from "./CodeMirrorEditor";
const { remote } = window.require("electron");

import "codemirror/mode/gfm/gfm";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/display/placeholder";

import { notesAdd, notesUpdate, notesEditTmp } from "notes";
import { getEdit, getWritingFocusMode, getMode } from "selectors";
import { useEditorPaste } from "utils/useEditorPaste";
import { useEditorKeydown } from "utils/useEditorKeydown";
import { useEditorNoteEdit } from "utils/useEditorNoteEdit";
import { modeSet } from "mode";
import EditorRoot from "./EditorRoot";
import { debounce } from "lodash";

const placeholder = "Write your thoughts or drag any files here";

export function Editor() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const noteEdit = useSelector(getEdit);
  const [editor, setEditor] = React.useState<CodeMirror.Editor>(null);
  const writingFocusMode = useSelector(getWritingFocusMode);
  const mode = useSelector(getMode);

  useEditorNoteEdit(editor, noteEdit);
  useEditorKeydown(rootRef);
  useEditorPaste(rootRef, editor);

  React.useEffect(() => {
    if (!editor) return;

    if (mode === "editor" || writingFocusMode) editor.focus();
    else editor.getInputField().blur();
  }, [mode, editor]);

  React.useEffect(() => {
    if (!editor) return;

    const onChange = debounce(
      () => {
        const currentContent = editor.getValue();

        if (noteEdit || currentContent) {
          dispatch(notesEditTmp({ ...noteEdit, content: currentContent }));
        } else {
          dispatch(notesEditTmp(null));
        }
      },
      500,
      { maxWait: 1000, trailing: true, leading: true }
    );

    editor.on("change", onChange);

    return () => {
      editor.off("change", onChange);
    };
  }, [editor, noteEdit, dispatch]);

  const extraKeys = React.useMemo(() => {
    const save = (codeMirror: CodeMirror.Editor) => {
      if (noteEdit && noteEdit.id && noteEdit.id !== "draft") {
        dispatch(
          notesUpdate({
            ...noteEdit,
            content: codeMirror.getValue(),
            history: editor.getHistory(),
          })
        );
      } else {
        dispatch(
          notesAdd({
            content: codeMirror.getValue(),
            history: editor.getHistory(),
          })
        );
      }
      setImmediate(() => {
        editor.getInputField().blur();
      });
    };

    return {
      Esc: () => {
        if (mode === "editor" || writingFocusMode) dispatch(modeSet("notes"));
      },
      "Shift-Ctrl-Enter": () => {
        dispatch(modeSet("editorFocus"));
      },
      "Shift-Cmd-Enter": () => {
        dispatch(modeSet("editorFocus"));
      },
      "Ctrl-Enter": (codeMirror: CodeMirror.Editor) => {
        save(codeMirror);
      },
      "Cmd-Enter": (codeMirror: CodeMirror.Editor) => {
        save(codeMirror);
      },
    };
  }, [mode, editor, noteEdit, dispatch]);

  const onFocus = React.useCallback(() => {
    if (mode !== "editor" && !writingFocusMode) dispatch(modeSet("editor"));
  }, [mode]);

  const onBlur = React.useCallback(() => {
    if (
      (mode === "editor" || writingFocusMode) &&
      !!remote.webContents.getFocusedWebContents()
    )
      dispatch(modeSet("notes"));
  }, [mode]);

  return (
    <EditorRoot center={writingFocusMode} ref={rootRef}>
      <CodeMirrorEditor
        extraKeys={extraKeys}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        onEditor={setEditor}
      />
    </EditorRoot>
  );
}
