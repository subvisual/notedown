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
      if (noteEdit.history) editor.setHistory(noteEdit.history);
      setTimeout(() => {
        editor.refresh();
        editor.execCommand("goDocEnd");
      }, 100);
    } else {
      editor.setValue("");
      editor.setHistory({ done: [], undone: [] });
    }
  }, [editor, noteEdit]);
};
