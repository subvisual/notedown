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
import { getSelected, getSearchResultNotes } from "../selectors";

const Root = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: calc(100% - 4rem);
  margin: 0 auto;
  position: relative;
  margin-bottom: 0.5rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 50%;
    background: ${({ theme }) => theme.background2};
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 600px;
  flex-grow: 0;
  flex-shrink: 1;
  padding-right: 3rem;
  padding-left: 1rem;
`;

export function HomePage() {
  const dispatch = useDispatch();

  const selected = useSelector(getSelected);
  const notes = useSelector(getSearchResultNotes);

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
    dispatch(modeSet("colorPicker"));
  }, [dispatch]);

  const helpHandler = useCallback(() => {
    dispatch(modeSet("tips"));
  }, [dispatch]);

  const searchHandler = useCallback(() => {
    dispatch(modeSet("search"));
  }, [dispatch]);

  const editorHandler = useCallback(() => {
    dispatch(modeSet("editor"));
  }, [dispatch]);

  const deleteHandler = useCallback(() => {
    dispatch(notesDelete(null));
  }, [dispatch]);

  const shortcutsHandler = useCallback(() => {
    dispatch(modeSet("shortcuts"));
  }, [dispatch]);

  useKeyPress("/", undefined, searchHandler);
  useKeyPress("c", undefined, colorPickerHandler);
  useKeyPress("e", undefined, editHandler);
  useKeyPress("f", undefined, searchHandler);
  useKeyPress("h", undefined, helpHandler);
  useKeyPress("s", undefined, shortcutsHandler);
  useKeyPress("i", undefined, editorHandler);
  useKeyPress("d", undefined, deleteHandler);

  useKeyPress("k", undefined, upHandler);
  useKeyPress("j", undefined, downHandler);
  useKeyPress("ArrowUp", undefined, upHandler);
  useKeyPress("ArrowDown", undefined, downHandler);

  return (
    <>
      <MenuBar />
      <Help />
      <Root>
        <Left>
          <NotesList notes={notes} selected={selected} />
        </Left>
        <Editor />
      </Root>
    </>
  );
}
