import * as React from "react";
import styled from "styled-components";
import * as ReactModal from "react-modal";
import { useSelector, useDispatch } from "react-redux";

import { textColorForBackground } from "../utils/color";
import { getMode, getTheme } from "../selectors";
import { modeClose, modeSet } from "../mode";
import { Title } from "./Title";

const Content = styled.div`
  padding: 2rem;

  p {
    margin-bottom: 1rem;
  }

  ul {
    list-style-position: outside;
    padding-left: 1rem;
    margin-bottom: 2rem;
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

const SideBySide = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 4rem;
`;

export const Help = () => {
  const currentMode = useSelector(getMode);
  const dispatch = useDispatch();
  const theme = useSelector(getTheme);

  return (
    <ReactModal
      isOpen={currentMode === "tips" || currentMode === "shortcuts"}
      onRequestClose={() => dispatch(modeClose())}
      style={{
        overlay: {
          backgroundColor: theme.colors.background1,
          zIndex: 4,
        },
        content: {
          backgroundColor: "transparent",
          border: 0,
          bottom: "auto",
          color: textColorForBackground(theme.colors.background1),
          left: "50%",
          margin: 0,
          minWidth: 600,
          overflow: "initial",
          padding: 0,
          right: "auto",
          top: "50%",
          transform: "translate(-50%, -50%)",
        },
      }}
      contentLabel="Help and shortcuts"
    >
      <Content>
        {currentMode === "tips" && (
          <ul>
            <li>Write in markdown.</li>
            <li>Use full-text search.</li>
            <li>
              Drag and drop files from the file system or the browser to import
              them.
            </li>
            <li>Paste images to import them.</li>
            <li>Files are saved alongside the notes.</li>
            <li>
              <button onClick={() => dispatch(modeSet("colorPicker"))}>
                Change the theme.
              </button>
            </li>
          </ul>
        )}
        {currentMode === "shortcuts" && (
          <>
            <p>
              Any shortcut that uses <em>Cmd</em> as a modifier also supports{" "}
              <em>Ctrl</em>.
            </p>
            <SideBySide>
              <div>
                <Title>Global Shortcuts</Title>
                <ul>
                  <li>
                    <em>Escape</em> - Move focus to the notes list
                  </li>
                </ul>
                <Title>Notes list shortcuts</Title>
                <ul>
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
                    <em>f/Cmd+F</em> - Go to the search input. Press{" "}
                    <em>Cmd+F</em> again to leave.
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
                    <em>c</em> - Change the theme.
                  </li>
                  <li>
                    <em>Cmd+,</em> - Preferences
                  </li>
                </ul>
              </div>
              <div>
                <Title>Editor shortcuts</Title>
                <ul>
                  <li>
                    <em>Cmd+Enter</em> - Save the note on the editor.
                  </li>
                  <li>
                    <em>Escape</em> - Restore the focus back to the notes list.
                  </li>
                  <li>
                    <em>t/Cmd+T</em> - Toggle focus mode.
                  </li>
                  <li>
                    <em>Cmd+Shift+Enter</em> - Paste without formatting.
                  </li>
                </ul>
                <Title>Search shortcuts</Title>
                <ul>
                  <li>
                    <em>Cmd+Enter</em> - Saves the current search.
                  </li>
                  <li>
                    <em>Cmd+number</em> - Uses the saved search with the
                    corresponding number.
                  </li>
                </ul>
              </div>
            </SideBySide>
          </>
        )}
      </Content>
    </ReactModal>
  );
};
