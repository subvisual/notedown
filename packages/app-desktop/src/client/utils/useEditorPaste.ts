import * as React from "react";
import * as electron from "electron";
import * as Files from "@notedown/lib/files";

export const useEditorPaste = (
  ref: React.MutableRefObject<HTMLDivElement>,
  editor: CodeMirror.Editor
) => {
  React.useLayoutEffect(() => {
    if (!ref.current || !editor) return;

    const onPaste = async (_event: Event) => {
      const image = electron.clipboard.readImage();
      if (image.isEmpty()) return;
      const savedFile = await Files.addBuffer(image.toJPEG(90));
      const doc = editor.getDoc();
      var cursor = doc.getCursor();
      doc.replaceRange(`![](notesfile://${savedFile.fileName})`, cursor);
    };

    ref.current.addEventListener("paste", onPaste);

    return () => ref.current.removeEventListener("paste", onPaste);
  }, [ref.current, editor]);
};
