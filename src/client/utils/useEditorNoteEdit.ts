import * as React from "react";

import { Note } from "../../models/types";

export const useEditorNoteEdit = (
  editor: CodeMirror.Editor,
  noteEdit: Note
) => {
  React.useEffect(() => {
    if (!editor) return;

    if (noteEdit && noteEdit.content) {
      editor.setValue(noteEdit.content);
      editor.focus();
      editor.execCommand("goDocEnd");
    } else {
      editor.setValue("");
      editor.focus();
    }
  }, [editor, noteEdit]);
};
