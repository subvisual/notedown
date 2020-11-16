import * as React from "react";
import * as _ from "lodash";
import styled from "styled-components";
import * as CodeMirror from "codemirror";
import { Subject } from "rxjs";

import "codemirror/lib/codemirror.css";
import "codemirror/addon/display/placeholder";
import "codemirror/addon/display/placeholder";
import "codemirror/mode/gfm/gfm";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import "codemirror/mode/ruby/ruby";
import "codemirror/mode/rust/rust";

import * as Files from "models/files";

import {
  isHref,
  isImageSrc,
  isAudioSrc,
  matchMdImage,
  matchMdListItem,
} from "utils/regex";

export const pasteWithoutFormatting = new Subject<string>();

const Input = styled.textarea`
  width: 100%;
  padding: 1rem 1rem;
  border: 0;
  background: transparent;
`;

interface Props {
  extraKeys: { [key: string]: (cm?: CodeMirror.Editor) => any };
  placeholder: string;
  onFocus: () => any;
  onBlur: () => any;
  onEditor: (editor: CodeMirror.Editor) => any;
}

export const CodeMirrorEditor = ({
  extraKeys,
  placeholder,
  onFocus,
  onBlur,
  onEditor,
}: Props) => {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [editor, setEditor] = React.useState<CodeMirror.Editor>(null);

  React.useEffect(() => {
    if (editor) editor.setOption("extraKeys", extraKeys);
  }, [editor, extraKeys]);

  React.useEffect(() => {
    if (editor) editor.setOption("placeholder", placeholder);
  }, [editor, placeholder]);

  React.useEffect(() => {
    if (!editor) return;

    editor.on("focus", onFocus);
    editor.on("blur", onBlur);

    return () => {
      editor.off("focus", onFocus);
      editor.off("blur", onBlur);
    };
  }, [editor, onFocus, onBlur]);

  React.useEffect(() => {
    if (!editor) return;

    const subscription = pasteWithoutFormatting.subscribe({
      next: (text: string) => {
        const doc = editor.getDoc();
        var cursor = doc.getCursor();
        doc.replaceRange(text, cursor);
      },
    });

    return () => subscription.unsubscribe();
  }, [editor]);

  React.useLayoutEffect(() => {
    const codeMirror = CodeMirror.fromTextArea(ref.current, {
      placeholder,
      lineWrapping: true,
      lint: false,
      autocorrect: false,
      autocapitalize: false,
      spellcheck: false,
      gutters: ["cm-custom-gutter-space"],
      mode: {
        fencedCodeBlockHighlighting: false,
        highlightFormatting: true,
        name: "gfm",
        tokenTypeOverrides: {
          emoji: "emoji",
        },
      },
      theme: "notes",
      extraKeys,
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
          setImmediate(() => {
            codeMirror.replaceRange(
              `[${text[0]}](${text[0]})`,
              from,
              {
                line: to.line,
                ch: from.ch + text[0].length,
              },
              "+notedown"
            );

            codeMirror.setSelection(
              { line: to.line, ch: from.ch + 1 },
              { line: to.line, ch: from.ch + 1 + text[0].length }
            );
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
              widget: codeMirror.addLineWidget(line, img, {
                handleMouseEvents: true,
              }),
            });
          }
        }
      );
    };

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
    // @ts-ignore
    codeMirror.on("drop", onDrop);

    setEditor(codeMirror);
    onEditor(codeMirror);

    return () => {
      codeMirror.off("change", onUpdate);
      // @ts-ignore
      codeMirror.off("drop", onDrop);
      onEditor(null);
      setEditor(null);
    };
  }, [ref]);

  return <Input ref={ref} />;
};
