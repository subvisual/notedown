import * as React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { NotesList } from "./NotesList";
import { Editor } from "./Editor";
import { Help } from "./Help";
import { MenuBar } from "./MenuBar";
import { notesLoad, notesLoadSavedQueries } from "../notes";
import { modeHandleKey } from "../mode";
import {
  getSelected,
  getSearchResultNotes,
  getWritingFocusMode,
  getMode,
} from "../selectors";
import { SavedQueryes } from "./SavedQueries";

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
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 50%;
    background: ${({ theme, hidePanel }) =>
      hidePanel ? "transparent" : theme.background2};
    z-index: 4;

    @media (max-width: 900px) {
      background: transparent;
    }
  }
`;

const Left = styled.div<{ hide: boolean }>`
  display: flex;
  flex-direction: column;
  flex-basis: 700px;
  flex-grow: 0;
  flex-shrink: 1;
  z-index: 4;

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
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 700px;
  flex-grow: 0;
  flex-shrink: 1;
  z-index: 0;
  overflow: hidden;
`;

const RightOverlay = styled.div<{ show: boolean }>`
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  width: 50%;
  transition: opacity ease-in-out 0.1s;
  transition-delay: 0.1s;
  opacity: ${({ show }) => (show ? "1" : "0")};
  background-color: ${({ theme }) => theme.background2};
  pointer-events: ${({ show }) => (show ? "initial" : "none")};
  z-index: 3;
`;

export function HomePage() {
  const dispatch = useDispatch();

  const selected = useSelector(getSelected);
  const notes = useSelector(getSearchResultNotes);
  const mode = useSelector(getMode);
  const writingFocusMode = useSelector(getWritingFocusMode);

  useEffect(() => {
    dispatch(notesLoad());
    dispatch(notesLoadSavedQueries());
  }, []);

  useEffect(() => {
    if (!dispatch) return;

    const handler = (event: KeyboardEvent) => {
      dispatch(
        modeHandleKey({
          key: event.key,
          ctrlKey: !!event.ctrlKey,
          metaKey: !!event.metaKey,
        })
      );
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [dispatch, notes]);

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
        <RightOverlay show={mode == "search"}>
          <SavedQueryes />
        </RightOverlay>
      </Root>
    </>
  );
}
