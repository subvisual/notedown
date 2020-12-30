import * as React from "react";

import { DraftNote, Note } from "@notedown/lib/types";

export const useEditorNoteEdit = (
  editor: CodeMirror.Editor,
  noteEdit: Note | DraftNote
) => {
  React.useEffect(() => {
    if (!editor) return;

    if (noteEdit && noteEdit.content) {
      editor.setValue(noteEdit.content);

      if (noteEdit.history) editor.setHistory(noteEdit.history);

      setImmediate(() => {
        editor.execCommand("goDocEnd");
      });

      setTimeout(() => {
        editor.refresh();
        editor.execCommand("goDocEnd");
      }, 1000);
    } else {
      editor.setValue("");
      editor.setHistory({ done: [], undone: [] });
    }
  }, [editor, noteEdit]);
};
