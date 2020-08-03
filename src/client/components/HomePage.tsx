import * as React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { NotesList } from "./NotesList";
import { Editor } from "./Editor";
import { Help } from "./Help";
import { MenuBar } from "./MenuBar";
import { notesLoad } from "../notes";
import { modeHandleKey } from "../mode";
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
  flex-basis: 700px;
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
  flex-basis: 700px;
  flex-grow: 0;
  flex-shrink: 1;
`;

export function HomePage() {
  const dispatch = useDispatch();

  const selected = useSelector(getSelected);
  const notes = useSelector(getSearchResultNotes);
  const mode = useSelector(getMode);
  const writingFocusMode = useSelector(getWritingFocusMode);

  useEffect(() => {
    dispatch(notesLoad());
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
      </Root>
    </>
  );
}
