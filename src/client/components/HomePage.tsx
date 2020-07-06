import * as React from "react";
import { useEffect, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { findIndex } from "lodash";

import { useKeyPress } from "../utils/useKeyPress";
import { NotesList } from "./NotesList";
import { Editor } from "./Editor";
import { Help } from "./Help";
import { MenuBar } from "./MenuBar";
import { notesLoad, notesEdit, notesSelect, notesDelete } from "../notes";
import { modeSet } from "../mode";
import {
  getSelected,
  getSearchResultNotes,
  getWritingFocusMode,
  getMode,
} from "../selectors";

const Root = styled.div<{ hidePanel: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: calc(100% - 4rem);
  margin: 0 auto;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 50%;
    background: ${({ theme, hidePanel }) =>
      hidePanel ? "transparent" : theme.background2};

    @media (max-width: 900px) {
      background: transparent;
    }
  }
`;

const Left = styled.div<{ hide: boolean }>`
  display: flex;
  flex-direction: column;
  flex-basis: 600px;
  flex-grow: 0;
  flex-shrink: 1;

  @media (max-width: 900px) {
    position: absolute;
    top: 0;
    left: 0;
    width: 400px;
    max-width: 90%;
    background: ${({ theme }) => theme.background2};
    z-index: 4;
    height: 100%;
    transform: ${({ hide }) =>
      hide ? "translateX(calc(-100% + 1.49rem))" : "translateX(0)"};
    transition: all ease-in-out 0.1s;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 600px;
  flex-grow: 0;
  flex-shrink: 1;
`;

export function HomePage() {
  const dispatch = useDispatch();

  const selected = useSelector(getSelected);
  const notes = useSelector(getSearchResultNotes);
  const mode = useSelector(getMode);
  const writingFocusMode = useSelector(getWritingFocusMode);

  const selectedIndex = React.useMemo(
    () => selected && findIndex(notes, { id: selected.id }),
    [notes, selected]
  );

  useEffect(() => {
    dispatch(notesLoad());
  }, []);

  const downHandler = useCallback(() => {
    const index = selected ? Math.min(selectedIndex + 1, notes.length - 1) : 0;
    dispatch(notesSelect(notes[index]));
  }, [dispatch, notesSelect, notes, selectedIndex]);

  const upHandler = useCallback(() => {
    const index = selected ? Math.max(selectedIndex - 1, 0) : 0;
    dispatch(notesSelect(notes[index]));
  }, [dispatch, notesSelect, notes, selectedIndex]);

  const editHandler = useCallback(() => {
    dispatch(notesEdit());
  }, [dispatch, selected]);

  const colorPickerHandler = useCallback(() => {
    if (mode === "notes") dispatch(modeSet("colorPicker"));
  }, [dispatch]);

  const helpHandler = useCallback(() => {
    if (mode === "notes") dispatch(modeSet("tips"));
  }, [dispatch]);

  const searchHandler = useCallback(() => {
    if (mode === "notes") dispatch(modeSet("search"));
  }, [dispatch]);

  const editorHandler = useCallback(() => {
    if (mode === "notes") dispatch(modeSet("editor"));
  }, [dispatch]);

  const deleteHandler = useCallback(() => {
    if (mode === "notes") dispatch(notesDelete(null));
  }, [dispatch]);

  const shortcutsHandler = useCallback(() => {
    if (mode === "notes") dispatch(modeSet("shortcuts"));
  }, [dispatch]);

  const editorFocusHandler = useCallback(() => {
    if (mode === "notes") dispatch(modeSet("editorFocus"));
  }, [dispatch]);

  useKeyPress("/", undefined, searchHandler);
  useKeyPress("c", undefined, colorPickerHandler);
  useKeyPress("e", undefined, editHandler);
  useKeyPress("f", undefined, searchHandler);
  useKeyPress("h", undefined, helpHandler);
  useKeyPress("s", undefined, shortcutsHandler);
  useKeyPress("i", undefined, editorHandler);
  useKeyPress("d", undefined, deleteHandler);
  useKeyPress("n", undefined, editorFocusHandler);
  useKeyPress("k", undefined, upHandler);
  useKeyPress("j", undefined, downHandler);
  useKeyPress("ArrowUp", undefined, upHandler);
  useKeyPress("ArrowDown", undefined, downHandler);

  return (
    <>
      <MenuBar />
      <Help />
      <Root hidePanel={writingFocusMode}>
        {!writingFocusMode && (
          <Left hide={mode === "editor" || writingFocusMode}>
            <NotesList notes={notes} selected={selected} />
          </Left>
        )}
        <Right>
          <Editor />
        </Right>
      </Root>
    </>
  );
}
