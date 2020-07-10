import * as React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import { getMode } from "../selectors";
import { modeClose, modeSet } from "../mode";
import { Modal } from "./Modal";

const Content = styled.div`
  padding: 2rem;

  p {
    margin-bottom: 1rem;
  }

  ul {
    list-style-position: outside;
    padding-left: 1rem;
    margin-bottom: 1rem;
  }

  button {
    background: transparent;
    border: 0;
    text-decoration: underline;
    font-size: inherit;
    color: currentColor;
    font-family: inherit;
  }
`;

export const Help = () => {
  const currentMode = useSelector(getMode);
  const dispatch = useDispatch();

  return (
    <Modal
      open={currentMode === "tips" || currentMode === "shortcuts"}
      onClose={() => dispatch(modeClose())}
      contentLabel="Help and shortcuts"
    >
      <Content>
        {currentMode === "tips" && (
          <ul>
            <li>Write in markdown.</li>
            <li>
              Drag and drop files from the file system or the browser to import
              them.
            </li>
            <li>Paste images to import them.</li>
            <li>Files are saved alongside the notes.</li>
            <li>
              Use <em>Sync Folder</em> from the menu to back-up your files to a
              folder. You can use this to setup backups to a cloud provider. Two
              computers could use this sync data.
            </li>
            <li>
              <button onClick={() => dispatch(modeSet("colorPicker"))}>
                Change the theme.
              </button>
            </li>
          </ul>
        )}
        {currentMode === "shortcuts" && (
          <>
            <ul>
              <li>
                <em>Cmd+Enter</em> - Save the note on the editor.
              </li>
              <li>
                <em>i/up</em> - Select the note above.
              </li>
              <li>
                <em>j/down</em> - Select the note below.
              </li>
              <li>
                <em>g</em> - Select the first note.
              </li>
              <li>
                <em>G</em> - Select the last note.
              </li>
              <li>
                <em>i/Cmd+N</em> - Focus on the editor.
              </li>
              <li>
                <em>e/Cmd+E</em> - Edit the selected note.
              </li>
              <li>
                <em>f/Cmd+F</em> - Go to the search input. Press <em>Cmd+F</em>{" "}
                again to leave.
              </li>
              <li>
                <em>d</em> - Delete the selected note.
              </li>
              <li>
                <em>s</em> - Show the list of shortcuts.
              </li>
              <li>
                <em>h</em> - Show a list of tips.
              </li>
              <li>
                <em>Escape</em> - Restore the focus back to the notes list.
              </li>
              <li>
                <em>c</em> - Change the theme.
              </li>
              <li>
                <em>n</em> - Focus mode.
              </li>
            </ul>
            <p>
              Some shortcuts are only available when your focus is on the notes
              list.
            </p>
            <p>
              Any shortcut that uses <em>Cmd</em> as a modifier also supports{" "}
              <em>Ctrl</em>.
            </p>
          </>
        )}
      </Content>
    </Modal>
  );
};
