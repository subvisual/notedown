import * as React from "react";
import * as _ from "lodash";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import * as CodeMirror from "codemirror";

import "codemirror/mode/gfm/gfm";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/display/placeholder";

import * as Files from "models/files";
import { notesUpdateOrAdd } from "notes/actions";

import { getEdit, getWritingFocusMode } from "selectors";
import { useEditorPaste } from "utils/useEditorPaste";
import { useEditorKeydown } from "utils/useEditorKeydown";
import { useEditorNoteEdit } from "utils/useEditorNoteEdit";
import {
  isHref,
  isImageSrc,
  isAudioSrc,
  matchMdImage,
  matchMdListItem,
} from "utils/regex";

import EditorRoot from "./EditorRoot";

const Input = styled.textarea`
  width: 100%;
  padding: 1rem 1rem;
  border: 0;
  background: transparent;
`;

export function Editor() {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const noteEdit = useSelector(getEdit);
  const [editor, setEditor] = React.useState<CodeMirror.Editor>(null);
  const [focus, setFocus] = React.useState<boolean>(false);
  const writingFocusMode = useSelector(getWritingFocusMode);

  useEditorNoteEdit(editor, noteEdit);
  useEditorKeydown(rootRef, editor, focus);
  useEditorPaste(rootRef, editor);

  React.useLayoutEffect(() => {
    const codeMirror = CodeMirror.fromTextArea(ref.current, {
      placeholder: "Write your thoughts or drag any files here",
      lineWrapping: true,
      mode: {
        name: "gfm",
        tokenTypeOverrides: {
          emoji: "emoji",
        },
      },
      theme: "notes",
      extraKeys: {
        Esc: () => codeMirror.getInputField().blur(),
        "Ctrl-Enter": () => {
          dispatch(notesUpdateOrAdd({ content: codeMirror.getValue() }));
          setImmediate(() => {
            codeMirror.getInputField().blur();
            codeMirror.setValue("");
          });
        },
        "Cmd-Enter": () => {
          dispatch(notesUpdateOrAdd({ content: codeMirror.getValue() }));
          setImmediate(() => {
            codeMirror.getInputField().blur();
            codeMirror.setValue("");
          });
        },
      },
    });

    let widgets: {
      line: number;
      widget: CodeMirror.LineWidget;
      url: string;
      img: HTMLImageElement;
    }[] = [];

    const onUpdate = (
      _editor: any,
      change: CodeMirror.EditorChangeLinkedList
    ) => {
      const { from, to, text, removed, origin } = change;

      if (origin === "paste") {
        if (isHref(text[0])) {
          codeMirror.replaceRange(`[${text[0]}](${text[0]})`, from, {
            line: to.line,
            ch: from.ch + text[0].length,
          });
        }
      }

      // auto insert list characters
      if (text.length > 1 && text[0] === "" && text[1] === "") {
        const line = codeMirror.getLine(from.line);
        const doc = codeMirror.getDoc();
        const cursor = doc.getCursor();

        const match = matchMdListItem(line);

        if (match) {
          // previous line is empty
          if (match.empty && codeMirror.getLine(from.line + 1) === "") {
            codeMirror.replaceRange("", { line: from.line, ch: 0 }, to);
          } else if (match.type === "unordered") {
            codeMirror.replaceRange(match.nextElement, cursor);
          } else {
            codeMirror.replaceRange(match.nextElement, cursor);
          }
        }
      }

      if (removed.length > text.length) {
        const diff = removed.length - text.length;

        widgets.forEach((widget) => {
          if (widget.line > from.line + diff) widget.line -= diff;
        });
      } else if (text.length > removed.length) {
        const diff = text.length - removed.length;

        widgets.forEach((widget) => {
          if (widget.line > from.line + diff) widget.line += diff;
        });
      }

      _.range(from.line, Math.max(to.line, from.line + text.length) + 1).map(
        (line: number) => {
          const lineValue = codeMirror.getLine(line);
          const lineWidget = _.find(widgets, { line });

          if (!lineValue) {
            if (lineWidget) {
              lineWidget.widget.clear();
              widgets = _.reject(widgets, { line });
            }

            return;
          }

          const match = matchMdImage(lineValue);

          if (!match) {
            if (lineWidget) {
              lineWidget.widget.clear();
              widgets = _.reject(widgets, { line });
            }

            return;
          }

          let url = match.src;

          if (lineWidget && lineWidget.url === url) {
            return;
          }

          if (lineWidget) {
            lineWidget.img.src = url;
            lineWidget.widget.changed();
          } else {
            const img = document.createElement("img");
            img.src = url;
            widgets.push({
              line,
              img: img,
              url: url,
              widget: codeMirror.addLineWidget(line, img),
            });
          }
        }
      );
    };

    const onFocus = () => setFocus(true);
    const onBlur = () => setFocus(false);

    const onDrop = async (_: any, e: React.DragEvent<HTMLDivElement>) => {
      const files = e.dataTransfer.files;
      let savedFile;
      const doc = codeMirror.getDoc();
      const cursor = doc.getCursor();

      if (e.dataTransfer.getData("url")) {
        const url = e.dataTransfer.getData("url");
        savedFile = await Files.addRemoteFile(url);
      } else {
        for (var i = 0; i < files.length; i++) {
          const file = files.item(i);
          savedFile = await Files.addLocalFile(file);
        }
      }

      if (isImageSrc(savedFile.filePath))
        doc.replaceRange(
          `![${savedFile.name}](notesfile://${savedFile.fileName})`,
          cursor
        );
      else if (isAudioSrc(savedFile.filePath))
        doc.replaceRange(
          `!audio[${savedFile.name}](notesfile://${savedFile.fileName})`,
          cursor
        );
      else
        doc.replaceRange(
          `[${savedFile.name}](notesfile://${window.encodeURI(
            savedFile.fileName
          )})`,
          cursor
        );
    };

    codeMirror.on("change", onUpdate);
    codeMirror.on("focus", onFocus);
    codeMirror.on("blur", onBlur);
    // @ts-ignore
    codeMirror.on("drop", onDrop);

    setEditor(codeMirror);

    return () => {
      codeMirror.off("change", onUpdate);
      setEditor(null);
    };
  }, [ref]);

  return (
    <EditorRoot center={writingFocusMode} ref={rootRef}>
      <Input ref={ref} />
    </EditorRoot>
  );
}
